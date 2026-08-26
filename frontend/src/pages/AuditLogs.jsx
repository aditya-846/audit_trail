import { useEffect, useMemo, useState } from "react";
import {
  Activity, AlertTriangle, ArrowLeft, CheckCircle2, Clock, Download,
  Filter, Map, MapPin, Package, Search, ShieldCheck, Thermometer, User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import eventService from "../services/eventService";

const demoEvents = [
  { id: "EVT-001", type: "Shipment Created", description: "Container CONT-2026-001 was registered", user: "Admin User", time: "10:42 AM", date: "Today", color: "blue", container: "CONT-2026-001" },
  { id: "EVT-002", type: "Temperature Updated", description: "Container CONT-2026-002 reported 4°C", user: "Sensor System", time: "10:36 AM", date: "Today", color: "orange", container: "CONT-2026-002" },
  { id: "EVT-003", type: "Location Updated", description: "Shipment moved to Visakhapatnam Port", user: "GPS System", time: "10:29 AM", date: "Today", color: "purple", container: "CONT-2026-003" },
  { id: "EVT-004", type: "Audit Event", description: "Shipment status change was logged", user: "Admin User", time: "10:22 AM", date: "Today", color: "blue", container: "CONT-2026-004" },
  { id: "EVT-005", type: "Shipment Delivered", description: "Container CONT-2026-005 reached destination", user: "System", time: "10:09 AM", date: "Today", color: "green", container: "CONT-2026-005" },
  { id: "EVT-006", type: "Temperature Alert", description: "Temperature exceeded safe threshold", user: "Sensor System", time: "09:54 AM", date: "Today", color: "red", container: "CONT-2026-006" },
];

const eventIcons = {
  "Shipment Created": Package,
  "Temperature Updated": Thermometer,
  "Location Updated": MapPin,
  "Audit Event": ShieldCheck,
  "Shipment Delivered": CheckCircle2,
  "Temperature Alert": AlertTriangle,
};

function formatEvent(event) {
  const rawType = event.type || event.eventType || "Audit Event";
  const type = {
    CONTAINER_CREATED: "Shipment Created",
    TEMPERATURE_UPDATE: "Temperature Updated",
    TEMPERATURE_SPIKE: "Temperature Alert",
    LOADED_ON_SHIP: "Location Updated",
    ARRIVED_AT_PORT: "Shipment Delivered",
  }[rawType] || rawType;
  const timestamp = event.createdAt || event.timestamp;
  const date = timestamp ? new Date(timestamp) : null;
  const color = type.includes("Alert") ? "red" : type.includes("Temperature") ? "orange" : type.includes("Delivered") ? "green" : type.includes("Location") ? "purple" : "blue";
  return { ...event, type, description: event.description || event.message || "System event recorded.", user: event.user || event.actor || "System", container: event.container || event.shipmentId || event.aggregateId || "-", time: date ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--", date: date ? date.toLocaleDateString() : "Unknown", color };
}

export default function AuditLogs() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [events, setEvents] = useState(demoEvents);
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("All Events");
  const [dateFilter, setDateFilter] = useState("All Time");

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await eventService.getPaginatedEvents({ page: 1, limit: 20, sort: "createdAt", order: "desc" });
        if (response.events?.length) setEvents(response.events.map(formatEvent));
      } catch (error) {
        console.error("Failed to load events:", error);
      }
    };
    loadEvents();
  }, []);

  const filteredEvents = useMemo(() => events.filter((event) => {
    const matchesSearch = JSON.stringify(event).toLowerCase().includes(search.toLowerCase());
    const matchesFilter = eventFilter === "All Events" || event.type === eventFilter;
    const eventDate = event.createdAt || event.timestamp ? new Date(event.createdAt || event.timestamp) : null;
    const now = new Date();
    const days = dateFilter === "Today" ? 1 : dateFilter === "Last 7 Days" ? 7 : dateFilter === "Last 30 Days" ? 30 : null;
    const matchesDate = !days || (eventDate && now - eventDate <= days * 86400000);
    return matchesSearch && matchesFilter && matchesDate;
  }), [events, search, eventFilter, dateFilter]);

  const exportEvents = () => {
    const csv = ["Type,Description,User,Container,Time", ...filteredEvents.map((event) => [event.type, event.description, event.user, event.container, event.time].map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))].join("\n");
    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    link.download = "auditflow-events.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="audit-page audit-logs-layout">
      <aside className="audit-sidebar">
        <div className="audit-brand"><div className="audit-brand-icon"><ShieldCheck size={21} /></div><div><h2>AuditFlow</h2><span>Shipment Audit Platform</span></div></div>
        <nav className="audit-navigation">
          <NavButton icon={<ShieldCheck size={17} />} label="Dashboard" onClick={() => navigate("/dashboard")} />
          <NavButton icon={<Package size={17} />} label="Shipments" onClick={() => navigate("/shipments")} />
          <NavButton icon={<ShieldCheck size={17} />} label="Audit Logs" active />
          <NavButton icon={<Clock size={17} />} label="Live Monitor" onClick={() => navigate("/live-monitor")} live />
          <NavButton icon={<Map size={17} />} label="Map View" onClick={() => navigate("/map")} />
          <NavButton icon={<Thermometer size={17} />} label="Sensor Data" onClick={() => navigate("/sensor-data")} />
        </nav>
        <div className="audit-sidebar-bottom"><div className="audit-security"><ShieldCheck size={17} /><div><strong>System Secure</strong><span>Audit protection active</span></div></div><button className="audit-logout" onClick={logout}>Sign Out</button></div>
      </aside>

      <main className="audit-main">
        <header className="audit-header"><div><button className="audit-back" onClick={() => navigate("/dashboard")}><ArrowLeft size={14} /> Dashboard</button><h1>Audit Logs</h1><p>Complete history of shipment and system events.</p></div><div className="audit-user"><div className="audit-avatar">{(user?.name || "Admin User").slice(0, 2).toUpperCase()}</div><div><strong>{user?.name || "Admin User"}</strong><span>{user?.role || "Administrator"}</span></div></div></header>
        <section className="audit-summary"><Summary icon={<ShieldCheck size={18} />} label="Total Events" value="12,842" color="blue" /><Summary icon={<CheckCircle2 size={18} />} label="Successful" value="12,516" color="green" /><Summary icon={<AlertTriangle size={18} />} label="Warnings" value="322" color="orange" /><Summary icon={<AlertTriangle size={18} />} label="Critical" value="04" color="red" /></section>
        <section className="audit-filter-panel"><div className="audit-search"><Search size={16} /><input placeholder="Search events or container ID..." value={search} onChange={(event) => setSearch(event.target.value)} /></div><div className="audit-filter"><Filter size={14} /><select value={eventFilter} onChange={(event) => setEventFilter(event.target.value)}><option>All Events</option>{Object.keys(eventIcons).map((type) => <option key={type}>{type}</option>)}</select></div><div className="audit-filter"><select value={dateFilter} onChange={(event) => setDateFilter(event.target.value)}><option>Today</option><option>Last 7 Days</option><option>Last 30 Days</option><option>All Time</option></select></div><button className="audit-export" onClick={exportEvents}><Download size={14} /> Export</button></section>
        <section className="audit-events-panel"><div className="audit-events-header"><div><h2>Event History</h2><p>Showing {filteredEvents.length} events</p></div><div className="audit-protected"><ShieldCheck size={13} /> Immutable Audit Trail</div></div><div className="audit-events">{filteredEvents.length ? filteredEvents.map((event) => <AuditEvent key={event.id || event._id} event={event} />) : <div className="audit-empty"><Search size={28} /><strong>No events found</strong><span>Try changing your search or filters.</span></div>}</div></section>
        <footer className="audit-footer"><span>© 2026 AuditFlow</span><span>Secure audit-protected environment</span></footer>
      </main>
    </div>
  );
}

function NavButton({ icon, label, onClick, active, live }) { return <button className={active ? "audit-active" : ""} onClick={onClick}>{icon}{label}{live && <span className="live-indicator" />}</button>; }
function Summary({ icon, label, value, color }) { return <div className="audit-summary-card"><div className={`audit-summary-icon ${color}`}>{icon}</div><div><span>{label}</span><strong>{value}</strong></div></div>; }
function AuditEvent({ event }) { const Icon = eventIcons[event.type] || Activity; return <div className="audit-event-row"><div className="audit-event-time"><strong>{event.time}</strong><span>{event.date}</span></div><div className={`audit-event-icon ${event.color}`}><Icon size={16} /></div><div className="audit-event-content"><div className="audit-event-title"><strong>{event.type}</strong><span className="audit-event-tag">{event.container}</span></div><p>{event.description}</p><div className="audit-event-user"><User size={11} /> {event.user}</div></div><span className="audit-details">View Details</span></div>; }
