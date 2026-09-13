import { useMemo, useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "../styles/shipments.css";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

import Loading from "../components/Common/Loading";
import ErrorMessage from "../components/Common/ErrorMessage";
import ShipmentTable from "../components/Shipments/ShipmentTable";
import ShipmentFilters from "../components/Shipments/ShipmentFilters";
import ShipmentModal from "../components/Shipments/ShipmentModal";
import Pagination from "../components/Shipments/Pagination";

import useShipments from "../hooks/useShipments";

const initialFilters = {
  search: "",
  status: "all",
  sortBy: "createdAt",
};

export default function Shipments() {
  const { canEdit } = useAuth();
  const navigate = useNavigate();

  // Shipment hook
  const {
    shipments,
    pagination,
    loading,
    error,
    loadShipments,
  } = useShipments();

  const [filters, setFilters] = useState(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] =
    useState(null);

  const [saving, setSaving] = useState(false);

  // --------------------------------
  // LOAD DATA
  // --------------------------------
  
  useEffect(() => {
    loadShipments({
      ...filters,
      page: currentPage,
      limit: 8
    });
  }, [filters, currentPage, loadShipments]);

  // --------------------------------
  // SAVE SHIPMENT
  // --------------------------------

  const handleSubmit = async (formData) => {
    setSaving(true);

    try {
      const shipmentId =
        selectedShipment?.id ||
        formData.containerId;

      if (selectedShipment) {
        const detail = await api.get(
          `/shipments/${shipmentId}`
        );

        const status =
          formData.status === "Delivered" ||
          formData.status === "Completed"
            ? "ARRIVED_AT_PORT"
            : "IN_TRANSIT";

        await api.post(
          `/shipments/${shipmentId}/commands`,
          {
            type: "UPDATE_SHIPMENT",
            payload: {
              name: formData.descriptiveName,
              origin: formData.originPort,
              temperature: formData.initTemp,
              status,
            },
            expectedVersion: detail.version,
          }
        );
      } else {
        await api.post(
          `/shipments/${shipmentId}/commands`,
          {
            type: "CONTAINER_CREATED",
            payload: {
              name: formData.descriptiveName,
              origin: formData.originPort,
              temperature: formData.initTemp,
            },
            expectedVersion: 0,
          }
        );
      }

      await loadShipments({
        ...filters,
        page: currentPage,
        limit: 8
      });

      setModalOpen(false);
      setSelectedShipment(null);

    } catch (err) {
      console.error(
        "Failed to save shipment:",
        err
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------
  // RESET FILTERS
  // --------------------------------

  const resetFilters = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
  };

  // --------------------------------
  // LOADING
  // --------------------------------

  if (loading) {
    return (
      <Loading message="Loading shipments..." />
    );
  }

  // --------------------------------
  // ERROR
  // --------------------------------

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={loadShipments}
      />
    );
  }

  // --------------------------------
  // UI
  // --------------------------------

  return (
    <div className="shipments-page animate-fade-in-scale">

      {/* HEADER */}
      <div className="page-header animate-fade-in-up stagger-1">
        <div>
          <h1>Containers Ledger</h1>

          <p>
            Manage and monitor registered containers.
          </p>
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

      {/* FILTERS */}
      <div className="animate-fade-in-up stagger-2">
        <ShipmentFilters
          filters={filters}
          onChange={(value) => {
            setFilters(value);
            setCurrentPage(1);
          }}
          onReset={resetFilters}
        />
      </div>

      {/* TABLE */}
      <div className="animate-fade-in-up stagger-3">
        <ShipmentTable
          shipments={shipments}
          onView={(shipment) => {
            navigate(`/shipments/${shipment.id || shipment.containerId}`);
          }}
          onEdit={(shipment) => {
            setSelectedShipment(shipment);
            setModalOpen(true);
          }}
          canEdit={canEdit()}
        />
      </div>

      {/* PAGINATION */}
      <div className="animate-fade-in-up stagger-4">
        <Pagination
          currentPage={pagination?.currentPage || 1}
          totalPages={pagination?.totalPages || 1}
          totalItems={pagination?.totalItems || 0}
          pageSize={8}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {/* MODAL */}
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