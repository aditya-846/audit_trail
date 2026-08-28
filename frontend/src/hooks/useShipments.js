import { useCallback, useEffect, useState } from "react";
import shipmentService from "../services/shipmentService";

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
  const rawStatus =
    shipment.status || shipment.currentStatus || "PENDING";

  const statusMap = {
    CREATED: "Active",
    PENDING: "Active",
    IN_TRANSIT: "In Transit",
    LOADED_ON_SHIP: "In Transit",
    ARRIVED_AT_PORT: "Delivered",
  };

  return {
    ...shipment,
    containerId: shipment.containerId || shipment.id,
    shipmentId: shipment.shipmentId || shipment.id,
    descriptiveName:
      shipment.descriptiveName || shipment.name,
    status: statusMap[rawStatus] || rawStatus,
  };
}

export default function useShipments() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadShipments = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await shipmentService.getShipments();

      const loadedShipments = response.shipments || [];

      setShipments(
        (loadedShipments.length
          ? loadedShipments
          : demoShipments
        ).map(normalizeShipment)
      );
    } catch (err) {
      console.error("Failed to load shipments:", err);

      // Use demo data if API is unavailable
      setShipments(demoShipments.map(normalizeShipment));

      setError("");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadShipments();
  }, [loadShipments]);

  return {
    shipments,
    loading,
    error,
    loadShipments,
  };
}