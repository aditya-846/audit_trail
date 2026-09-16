import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Package,
  Thermometer,
  MapPin,
  Calendar,
  Activity,
  ShieldCheck,
  History,
  RotateCcw,
} from "lucide-react";

import { useNavigate, useParams } from "react-router-dom";
import StatusBadge from "../components/Common/StatusBadge";
import Loading from "../components/Common/Loading";
import api from "../services/api";

export default function ShipmentDetails({
  shipment: propShipment,
}) {
  const navigate = useNavigate();
  const { id: paramId } = useParams();
  const [data, setData] = useState(propShipment || null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVersion, setSelectedVersion] = useState(null);

  const containerId = paramId || propShipment?.id || propShipment?.containerId || "SHIP-001";

  useEffect(() => {
    let isMounted = true;
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const url = selectedVersion
          ? `/shipments/${containerId}?asOf=${encodeURIComponent(selectedVersion)}`
          : `/shipments/${containerId}`;
        const res = await api.get(url);
        if (isMounted && res) {
          setData(res);
        }
      } catch (err) {
        console.error("Failed to load shipment details:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDetails();
    return () => { isMounted = false; };
  }, [containerId, selectedVersion]);

  useEffect(() => {
    let isMounted = true;
    const fetchEvents = async () => {
      try {
        const res = await api.get(`/shipments/${containerId}/events`);
        if (isMounted && res?.events) {
          setEvents(res.events);
        }
      } catch (err) {
        console.error("Failed to load shipment events:", err);
      }
    };

    fetchEvents();
    return () => { isMounted = false; };
  }, [containerId]);

  const displayData = data || propShipment || {
    id: containerId,
    name: "Cold-Chain Container",
    currentStatus: "IN_TRANSIT",
    location: "In Transit",
    temperature: 4.5,
    version: 1,
    lastUpdated: new Date().toISOString(),
  };

  return (
    <div className="shipment-details-page animate-fade-in-scale">
      <button
        className="back-button"
        onClick={() => navigate("/shipments")}
      >
        <ArrowLeft size={18} />
        Back to Shipments
      </button>

      <div className="page-header">
        <div>
          <div className="shipment-detail-id">
            <Package size={20} />
            {displayData.id || containerId}
          </div>
          <h1>{displayData.name || `Container ${displayData.id || containerId}`}</h1>
          <p>
            Immutable event-sourced ledger & state reconstruction
            {displayData.version !== undefined && ` (Version: v${displayData.version})`}
          </p>
        </div>

        <StatusBadge status={displayData.currentStatus || displayData.status || "Active"} />
      </div>

      {loading ? (
        <Loading message="Reconstructing ledger state..." />
      ) : (
        <>
          <div className="details-grid">
            <DetailCard
              icon={<Package />}
              title="Container ID"
              value={displayData.id || containerId}
            />
            <DetailCard
              icon={<MapPin />}
              title="Current Location"
              value={displayData.location || "Not available"}
            />
            <DetailCard
              icon={<Thermometer />}
              title="Temperature"
              value={displayData.temperature !== undefined && displayData.temperature !== null ? `${displayData.temperature}°C` : "--"}
            />
            <DetailCard
              icon={<Activity />}
              title="Status"
              value={displayData.currentStatus || displayData.status || "Active"}
            />
            <DetailCard
              icon={<Calendar />}
              title="Last Updated"
              value={
                displayData.lastUpdated
                  ? new Date(displayData.lastUpdated).toLocaleString()
                  : "--"
              }
            />
            <DetailCard
              icon={<History />}
              title="Aggregate Version"
              value={`v${displayData.version ?? 1}`}
            />
          </div>

          {events && events.length > 0 && (
            <div className="security-card" style={{ flexDirection: "column", alignItems: "stretch", marginTop: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <History size={20} />
                  <h3 style={{ margin: 0 }}>Event Stream Timeline & Time Travel</h3>
                </div>
                {selectedVersion && (
                  <button
                    onClick={() => setSelectedVersion(null)}
                    style={{
                      background: "rgba(59, 130, 246, 0.2)",
                      border: "1px solid rgba(59, 130, 246, 0.4)",
                      color: "#93c5fd",
                      padding: "0.3rem 0.8rem",
                      borderRadius: "6px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      fontSize: "0.85rem"
                    }}
                  >
                    <RotateCcw size={14} /> Reset to Live
                  </button>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {events.map((evt, idx) => {
                  const isCurrent = selectedVersion === evt.timestamp;
                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedVersion(evt.timestamp)}
                      style={{
                        padding: "0.75rem 1rem",
                        borderRadius: "8px",
                        background: isCurrent ? "rgba(59, 130, 246, 0.25)" : "rgba(255, 255, 255, 0.04)",
                        border: isCurrent ? "1px solid #3b82f6" : "1px solid rgba(255, 255, 255, 0.08)",
                        cursor: "pointer",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      <div>
                        <strong>v{evt.version} — {evt.eventType}</strong>
                        <div style={{ fontSize: "0.8rem", opacity: 0.8, marginTop: "0.2rem" }}>
                          {JSON.stringify(evt.payload)}
                        </div>
                      </div>
                      <span style={{ fontSize: "0.75rem", opacity: 0.6 }}>
                        {new Date(evt.timestamp).toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="security-card" style={{ marginTop: "1.5rem" }}>
            <ShieldCheck size={24} />
            <div>
              <h3>Audit Protected & Event Sourced</h3>
              <p>
                All state transitions are persisted immutably in the Event Store.
                OCC (Optimistic Concurrency Control) prevents race conditions and stale writes.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function DetailCard({
  icon,
  title,
  value,
}) {
  return (
    <div className="detail-card">
      <div className="detail-card-icon">
        {icon}
      </div>
      <div>
        <span>{title}</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}