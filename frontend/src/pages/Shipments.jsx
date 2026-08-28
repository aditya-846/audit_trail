import { useMemo, useState } from "react";
import { Plus } from "lucide-react";

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
import usePagination from "../hooks/usePagination";

const initialFilters = {
  search: "",
  status: "all",
  sortBy: "createdAt",
};

export default function Shipments() {
  const { canEdit } = useAuth();

  // Shipment hook
  const {
    shipments,
    loading,
    error,
    loadShipments,
  } = useShipments();

  const [filters, setFilters] = useState(initialFilters);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] =
    useState(null);

  const [saving, setSaving] = useState(false);

  // --------------------------------
  // FILTER + SORT
  // --------------------------------

  const filteredShipments = useMemo(() => {
    let result = [...shipments];

    const search = filters.search.toLowerCase();

    // Search
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

    // Status filter
    if (filters.status !== "all") {
      result = result.filter(
        (shipment) =>
          shipment.status === filters.status
      );
    }

    // Sorting
    result.sort((first, second) => {
      if (filters.sortBy === "createdAt") {
        return (
          new Date(
            second.createdAt ||
              second.lastUpdated ||
              0
          ) -
          new Date(
            first.createdAt ||
              first.lastUpdated ||
              0
          )
        );
      }

      return String(
        first[filters.sortBy] || ""
      ).localeCompare(
        String(second[filters.sortBy] || "")
      );
    });

    return result;
  }, [shipments, filters]);

  // --------------------------------
  // PAGINATION
  // --------------------------------

  const {
    currentPage,
    totalPages,
    totalItems,
    paginatedData,
    goToPage,
    resetPage,
  } = usePagination(filteredShipments, 8);

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
            type: "MOVE",
            payload: {
              newLocation: formData.originPort,
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

      await loadShipments();

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
    resetPage();
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
    <div className="shipments-page">

      {/* HEADER */}
      <div className="page-header">
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
      <ShipmentFilters
        filters={filters}
        onChange={(value) => {
          setFilters(value);
          resetPage();
        }}
        onReset={resetFilters}
      />

      {/* TABLE */}
      <ShipmentTable
        shipments={paginatedData}
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

      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        pageSize={8}
        onPageChange={goToPage}
      />

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