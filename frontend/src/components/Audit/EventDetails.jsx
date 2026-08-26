import {
  X,
  ShieldCheck,
  Clock,
  User,
  Package,
  Thermometer,
  MapPin,
  Database,
} from "lucide-react";

export default function EventDetails({
  event,
  onClose,
}) {
  if (!event) {
    return null;
  }

  const createdAt = event.createdAt
    ? new Date(event.createdAt)
    : null;

  return (
    <div
      className="event-modal-overlay"
      onClick={onClose}
    >
      <div
        className="event-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="event-modal-header">
          <div className="event-modal-title">
            <div className="event-detail-icon">
              <ShieldCheck size={22} />
            </div>

            <div>
              <h2>Event Details</h2>

              <p>
                Immutable audit record
              </p>
            </div>
          </div>

          <button
            className="event-close-button"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        {/* Event type */}
        <div className="event-type-section">
          <span className="detail-label">
            EVENT TYPE
          </span>

          <span className="event-type-value">
            {formatEventType(
              event.type ||
                event.action ||
                "SYSTEM_EVENT"
            )}
          </span>
        </div>

        {/* Details */}
        <div className="event-details-grid">
          <DetailItem
            icon={<Database size={17} />}
            label="Event ID"
            value={
              event._id ||
              event.id ||
              "Not available"
            }
          />

          <DetailItem
            icon={<Clock size={17} />}
            label="Timestamp"
            value={
              createdAt
                ? createdAt.toLocaleString()
                : "Not available"
            }
          />

          <DetailItem
            icon={<User size={17} />}
            label="User"
            value={
              event.user ||
              event.username ||
              event.actor ||
              "System"
            }
          />

          <DetailItem
            icon={<Package size={17} />}
            label="Shipment ID"
            value={
              event.shipmentId ||
              "Not associated"
            }
          />

          <DetailItem
            icon={<MapPin size={17} />}
            label="Location"
            value={
              event.location ||
              "Not available"
            }
          />

          <DetailItem
            icon={<Thermometer size={17} />}
            label="Temperature"
            value={
              event.temperature !== undefined
                ? `${event.temperature}°C`
                : "Not available"
            }
          />
        </div>

        {/* Description */}
        <div className="event-description">
          <span className="detail-label">
            DESCRIPTION
          </span>

          <p>
            {event.message ||
              event.description ||
              "No description available for this event."}
          </p>
        </div>

        {/* Raw event */}
        <div className="raw-event">
          <div className="raw-event-header">
            <span className="detail-label">
              EVENT DATA
            </span>
          </div>

          <pre>
            {JSON.stringify(
              event,
              null,
              2
            )}
          </pre>
        </div>

        {/* Footer */}
        <div className="event-modal-footer">
          <div className="immutable-status">
            <ShieldCheck size={17} />

            <span>
              Immutable audit record
            </span>
          </div>

          <button
            className="close-modal-button"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  icon,
  label,
  value,
}) {
  return (
    <div className="detail-item">
      <div className="detail-item-icon">
        {icon}
      </div>

      <div>
        <span className="detail-label">
          {label}
        </span>

        <strong>{value}</strong>
      </div>
    </div>
  );
}

function formatEventType(type = "SYSTEM_EVENT") {
  return type
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}