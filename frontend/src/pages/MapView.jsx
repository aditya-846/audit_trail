import { MapPinned } from "lucide-react";
import { useState } from "react";
import "leaflet/dist/leaflet.css";
import ShipmentMap from "../components/Map/ShipmentMap";

const demoShipments = [
  {
    id: "1",
    containerId: "CONT-2026-001",
    descriptiveName: "Pharmaceutical Cold Chain",
    originPort: "Chennai Port",
    originCoordinates: [13.0827, 80.2707],
    latitude: 17.385,
    longitude: 78.4867,
    location: "Hyderabad",
    temperature: 4,
    status: "In Transit",
  },
  {
    id: "2",
    containerId: "CONT-2026-002",
    descriptiveName: "Fresh Produce Shipment",
    originPort: "Mumbai Port",
    originCoordinates: [18.9388, 72.8354],
    latitude: 15.9129,
    longitude: 79.74,
    location: "Andhra Pradesh",
    temperature: 8,
    status: "Active",
  },
  {
    id: "3",
    containerId: "CONT-2026-003",
    descriptiveName: "Medical Supplies",
    originPort: "Visakhapatnam Port",
    originCoordinates: [17.6868, 83.2185],
    latitude: 17.385,
    longitude: 78.4867,
    location: "Hyderabad",
    temperature: 5,
    status: "Delivered",
  },
];

export default function MapView() {
  const [selectedShipment, setSelectedShipment] = useState(null);

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Map View</h1>
          <p>Track shipment routes and current locations in real time.</p>
        </div>

        <span className="live-status">LIVE TRACKING</span>
      </div>

      <div className="map-layout">
        <div className="map-container">
          <ShipmentMap
            shipments={demoShipments}
            selectedShipment={selectedShipment}
            onShipmentSelect={setSelectedShipment}
          />
        </div>

        <aside className="route-panel">
          <div className="route-panel-header">
            <h2>Active Routes</h2>
            <span>{demoShipments.length} shipments available</span>
          </div>

          <div className="route-list">
            {demoShipments.map((shipment) => (
              <button
                className="route-item"
                key={shipment.id}
                type="button"
                onClick={() => setSelectedShipment(shipment)}
              >
                <div className="route-id">
                  <strong>{shipment.containerId}</strong>
                  <span className="status-badge status-transit">
                    {shipment.status}
                  </span>
                </div>

                <div className="route-location">
                  <MapPinned size={14} />
                  {shipment.location}
                </div>
              </button>
            ))}
          </div>
        </aside>
      </div>

      {selectedShipment && (
        <div className="selected-shipment-card">
          <h3>{selectedShipment.containerId}</h3>
          <p>{selectedShipment.descriptiveName}</p>
          <strong>{selectedShipment.status}</strong>
        </div>
      )}
    </div>
  );
}
