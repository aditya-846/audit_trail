import { useEffect, useMemo, useState } from "react";
import { Plus } from "lucide-react";

import "../styles/shipments.css";
import api from "../services/api";
import shipmentService from "../services/shipmentService";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/Common/Loading";
import ErrorMessage from "../components/Common/ErrorMessage";
import ShipmentTable from "../components/Shipments/ShipmentTable";
import ShipmentFilters from "../components/Shipments/ShipmentFilters";
import ShipmentModal from "../components/Shipments/ShipmentModal";
import Pagination from "../components/Shipments/Pagination";

const initialFilters = {
  search: "",
  status: "all",
  sortBy: "createdAt",
};

const demoShipments = [
  {
    id: "1",
    containerId: "CONT-2026-001",
    descriptiveName: "Pharmaceutical Cold Chain",
    originPort: "Chennai Port",
    initTemp: 4,
    status: "In Transit",
    createdAt: "2026-08-20",
  },
  {
    id: "2",
    containerId: "CONT-2026-002",
    descriptiveName: "Fresh Produce Shipment",
    originPort: "Mumbai Port",
    initTemp: 8,
    status: "Active",
    createdAt: "2026-08-19",
  },
  {
    id: "3",
    containerId: "CONT-2026-003",
    descriptiveName: "Medical Supplies",
    originPort: "Visakhapatnam Port",
    initTemp: 5,
    status: "Delivered",
    createdAt: "2026-08-17",
  },
];

function normalizeShipment(shipment) {
  const rawStatus = shipment.status || shipment.currentStatus || "PENDING";
  const status = {
    CREATED: "Active",
    PENDING: "Active",
    IN_TRANSIT: "In Transit",
    LOADED_ON_SHIP: "In Transit",
    ARRIVED_AT_PORT: "Delivered",
  }[rawStatus] || rawStatus;

  return {
    ...shipment,
    containerId: shipment.containerId || shipment.id,
    shipmentId: shipment.shipmentId || shipment.id,
    descriptiveName: shipment.descriptiveName || shipment.name,
    status,
  };
}

export default function Shipments() {
  const { canEdit } = useAuth();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState(initialFilters);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadShipments = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await shipmentService.getShipments();
      const loadedShipments = response.shipments || [];
      setShipments(
        (loadedShipments.length ? loadedShipments : demoShipments).map(
          normalizeShipment
        )
      );
    } catch (error) {
      console.error("Failed to load shipments:", error);
      setShipments(demoShipments.map(normalizeShipment));
      setError("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadShipments();
  }, []);

  const filteredShipments = useMemo(() => {
    let result = [...shipments];
    const search = filters.search.toLowerCase();

    if (search) {
      result = result.filter((shipment) =>
        [
          shipment.containerId,
          shipment.shipmentId,
          shipment.name,
          shipment.descriptiveName,
          shipment.originPort,
          shipment.origin,
          shipment.status,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(search)
      );
    }

    if (filters.status !== "all") {
      result = result.filter(
        (shipment) => shipment.status === filters.status
      );
    }

    result.sort((first, second) => {
      if (filters.sortBy === "createdAt") {
        return new Date(second.createdAt || second.lastUpdated || 0) -
          new Date(first.createdAt || first.lastUpdated || 0);
      }

      return String(first[filters.sortBy] || "").localeCompare(
        String(second[filters.sortBy] || "")
      );
    });

    return result;
  }, [shipments, filters]);

  const pageSize = 8;
  const totalPages = Math.max(1, Math.ceil(filteredShipments.length / pageSize));
  const currentShipments = filteredShipments.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  const handleSubmit = async (formData) => {
    setSaving(true);

    try {
      const shipmentId = selectedShipment?.id || formData.containerId;

      if (selectedShipment) {
        const detail = await api.get(`/shipments/${shipmentId}`);
        const status = formData.status === "Delivered" || formData.status === "Completed"
          ? "ARRIVED_AT_PORT"
          : "IN_TRANSIT";

        await api.post(`/shipments/${shipmentId}/commands`, {
          type: "MOVE",
          payload: {
            newLocation: formData.originPort,
            status,
          },
          expectedVersion: detail.version,
        });
      } else {
        await api.post(`/shipments/${shipmentId}/commands`, {
          type: "CONTAINER_CREATED",
          payload: {
            name: formData.descriptiveName,
            origin: formData.originPort,
            temperature: formData.initTemp,
          },
          expectedVersion: 0,
        });
      }

      await loadShipments();
      setModalOpen(false);
      setSelectedShipment(null);
    } catch (error) {
      console.error("Failed to save shipment:", error);
    } finally {
      setSaving(false);
    }
  };

  const resetFilters = () => {
    setFilters(initialFilters);
    setPage(1);
  };

  if (loading) {
    return <Loading message="Loading shipments..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadShipments} />;
  }

  return (
    <div className="shipments-page">
      <div className="page-header">
        <div>
          <h1>Containers Ledger</h1>
          <p>Manage and monitor registered containers.</p>
        </div>

        {canEdit() && (
          <button
            className="primary-button"
            onClick={() => {
              setSelectedShipment(null);
              setModalOpen(true);
            }}
          >
            <Plus size={18} />
            Create Container
          </button>
        )}
      </div>

      <ShipmentFilters
        filters={filters}
        onChange={(value) => {
          setFilters(value);
          setPage(1);
        }}
        onReset={resetFilters}
      />

      <ShipmentTable
        shipments={currentShipments}
        onView={(shipment) => {
          setSelectedShipment(shipment);
          setModalOpen(true);
        }}
        onEdit={(shipment) => {
          setSelectedShipment(shipment);
          setModalOpen(true);
        }}
        canEdit={canEdit()}
      />

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        totalItems={filteredShipments.length}
        pageSize={pageSize}
        onPageChange={setPage}
      />

      <ShipmentModal
        isOpen={modalOpen}
        shipment={selectedShipment}
        onClose={() => {
          setModalOpen(false);
          setSelectedShipment(null);
        }}
        onSubmit={handleSubmit}
        loading={saving}
      />
    </div>
  );
}