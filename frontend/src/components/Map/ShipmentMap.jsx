import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";

import L from "leaflet";
import { useEffect } from "react";

import RouteLayer from "./RouteLayer";

// Fix Leaflet marker icons in Vite
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

export default function ShipmentMap({
  shipments = [],
  selectedShipment = null,
  onShipmentSelect,
}) {
  const defaultCenter = [
    17.385,
    78.4867,
  ];

  return (
    <div className="shipment-map-container">
      <MapContainer
        center={defaultCenter}
        zoom={5}
        scrollWheelZoom={true}
        className="shipment-map"
      >
        {/* OpenStreetMap */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Shipment routes */}
        {shipments.map((shipment) => (
          <RouteLayer
            key={
              shipment._id ||
              shipment.id ||
              shipment.containerId
            }
            shipment={shipment}
            selected={
              selectedShipment?._id ===
                shipment._id ||
              selectedShipment?.id ===
                shipment.id
            }
          />
        ))}

        {/* Shipment markers */}
        {shipments.map((shipment) => {
          if (
            !shipment.latitude ||
            !shipment.longitude
          ) {
            return null;
          }

          return (
            <Marker
              key={`marker-${
                shipment._id ||
                shipment.id ||
                shipment.containerId
              }`}
              position={[
                Number(shipment.latitude),
                Number(shipment.longitude),
              ]}
              eventHandlers={{
                click: () =>
                  onShipmentSelect?.(
                    shipment
                  ),
              }}
            >
              <Popup>
                <div className="map-popup">
                  <h3>
                    {shipment.containerId ||
                      shipment.shipmentId ||
                      "Shipment"}
                  </h3>

                  <p>
                    <strong>
                      Name:
                    </strong>{" "}
                    {shipment.name ||
                      shipment.descriptiveName ||
                      "-"}
                  </p>

                  <p>
                    <strong>
                      Status:
                    </strong>{" "}
                    {shipment.status ||
                      "Active"}
                  </p>

                  <p>
                    <strong>
                      Temperature:
                    </strong>{" "}
                    {shipment.temperature ??
                      shipment.initTemp ??
                      "--"}
                    °C
                  </p>

                  <p>
                    <strong>
                      Location:
                    </strong>{" "}
                    {shipment.location ||
                      "Current position"}
                  </p>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Automatically fit map */}
        <MapAutoFit
          shipments={shipments}
        />
      </MapContainer>

      {/* Map legend */}
      <div className="map-legend">
        <div className="map-legend-title">
          Shipment Status
        </div>

        <div className="legend-item">
          <span className="legend-dot active"></span>
          Active
        </div>

        <div className="legend-item">
          <span className="legend-dot transit"></span>
          In Transit
        </div>

        <div className="legend-item">
          <span className="legend-dot delivered"></span>
          Delivered
        </div>

        <div className="legend-item">
          <span className="legend-dot delayed"></span>
          Delayed
        </div>
      </div>
    </div>
  );
}


/*
 * Automatically moves the map
 * so all shipment locations are visible.
 */
function MapAutoFit({ shipments }) {
  const map = useMap();

  useEffect(() => {
    const locations = shipments
      .filter(
        (shipment) =>
          shipment.latitude &&
          shipment.longitude
      )
      .map((shipment) => [
        Number(shipment.latitude),
        Number(shipment.longitude),
      ]);

    if (locations.length === 0) {
      return;
    }

    if (locations.length === 1) {
      map.setView(locations[0], 8);
      return;
    }

    const bounds =
      L.latLngBounds(locations);

    map.fitBounds(bounds, {
      padding: [40, 40],
    });
  }, [shipments, map]);

  return null;
}