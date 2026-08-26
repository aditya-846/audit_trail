import {
  Polyline,
  CircleMarker,
  Tooltip,
} from "react-leaflet";

export default function RouteLayer({
  shipment,
  selected = false,
}) {
  const origin =
    getCoordinates(
      shipment.originCoordinates
    ) ||
    getCoordinates(
      shipment.originLocation
    );

  const destination =
    shipment.latitude &&
    shipment.longitude
      ? [
          Number(shipment.latitude),
          Number(shipment.longitude),
        ]
      : null;

  /*
   * If there is no origin and destination,
   * don't draw anything.
   */
  if (!origin || !destination) {
    return null;
  }

  const route = [
    origin,
    destination,
  ];

  const status =
    shipment.status?.toLowerCase() ||
    "active";

  const routeClass =
    status.includes("delayed")
      ? "delayed"
      : status.includes("delivered")
      ? "delivered"
      : "active";

  return (
    <>
      {/* Route line */}
      <Polyline
        positions={route}
        pathOptions={{
          className: `shipment-route ${routeClass}`,
          weight: selected ? 6 : 4,
          opacity: selected ? 0.9 : 0.65,
          dashArray:
            status.includes("transit")
              ? "10 8"
              : undefined,
        }}
      >
        <Tooltip>
          {shipment.containerId ||
            shipment.shipmentId ||
            "Shipment"}{" "}
          Route
        </Tooltip>
      </Polyline>

      {/* Origin marker */}
      <CircleMarker
        center={origin}
        radius={7}
        pathOptions={{
          className: "origin-marker",
          weight: 2,
          fillOpacity: 1,
        }}
      >
        <Tooltip>
          Origin:{" "}
          {shipment.originPort ||
            "Origin"}
        </Tooltip>
      </CircleMarker>

      {/* Current location marker */}
      <CircleMarker
        center={destination}
        radius={selected ? 9 : 7}
        pathOptions={{
          className: `destination-marker ${routeClass}`,
          weight: 2,
          fillOpacity: 1,
        }}
      >
        <Tooltip>
          Current Location:{" "}
          {shipment.location ||
            "Current position"}
        </Tooltip>
      </CircleMarker>
    </>
  );
}


/*
 * Supports:
 *
 * [17.385, 78.4867]
 *
 * {
 *   lat: 17.385,
 *   lng: 78.4867
 * }
 *
 * {
 *   latitude: 17.385,
 *   longitude: 78.4867
 * }
 */
function getCoordinates(location) {
  if (!location) {
    return null;
  }

  if (
    Array.isArray(location) &&
    location.length >= 2
  ) {
    return [
      Number(location[0]),
      Number(location[1]),
    ];
  }

  if (
    location.lat !== undefined &&
    location.lng !== undefined
  ) {
    return [
      Number(location.lat),
      Number(location.lng),
    ];
  }

  if (
    location.latitude !== undefined &&
    location.longitude !== undefined
  ) {
    return [
      Number(location.latitude),
      Number(location.longitude),
    ];
  }

  return null;
}