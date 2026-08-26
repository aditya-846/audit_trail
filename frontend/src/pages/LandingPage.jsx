import {
  Activity,
  ArrowRight,
  Database,
  Map,
  Package,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  { icon: Package, title: "Shipment control", text: "Track every container from origin to delivery." },
  { icon: Activity, title: "Live telemetry", text: "See sensor activity and route changes as they happen." },
  { icon: Database, title: "Immutable history", text: "Keep every operational event traceable and auditable." },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <main className="landing-page">
      <nav className="landing-nav">
        <button className="landing-brand" onClick={() => navigate("/")}>
          <span className="landing-brand-icon"><ShieldCheck size={20} /></span>
          <span>AuditFlow</span>
        </button>
        <div className="landing-nav-actions">
          <button className="landing-text-button" onClick={() => navigate("/login")}>Sign In</button>
          <button className="landing-outline-button" onClick={() => navigate("/register")}>Create Account</button>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="landing-copy">
          <span className="landing-eyebrow"><span className="landing-live-dot" /> Event intelligence for modern logistics</span>
          <h1>Make every shipment <span>accountable.</span></h1>
          <p>AuditFlow brings shipment movement, sensor signals, and immutable event history into one calm operational view.</p>
          <div className="landing-hero-actions">
            <button className="landing-primary-button" onClick={() => navigate("/register")}>Get started <ArrowRight size={17} /></button>
            <button className="landing-secondary-button" onClick={() => navigate("/dashboard")}>View dashboard</button>
          </div>
          <div className="landing-proof"><ShieldCheck size={16} /> Event-sourced. Role-aware. Ready for operations.</div>
        </div>

        <div className="landing-visual" aria-label="Shipment operations overview">
          <div className="landing-visual-header"><span><span className="landing-live-dot" /> SYSTEM LIVE</span><span>08:42:16 UTC</span></div>
          <div className="landing-route-map">
            <div className="route-grid" />
            <div className="route-line route-line-one" /><div className="route-line route-line-two" />
            <span className="route-point point-one" /><span className="route-point point-two" /><span className="route-point point-three" />
            <div className="route-label label-one"><Map size={13} /> Chennai <strong>Origin</strong></div>
            <div className="route-label label-two"><Truck size={13} /> Hyderabad <strong>In transit</strong></div>
            <div className="route-label label-three"><Package size={13} /> Vizag <strong>Delivered</strong></div>
          </div>
          <div className="landing-visual-footer"><div><span>Active routes</span><strong>18</strong></div><div><span>Events today</span><strong>1,284</strong></div><div><span>On-time rate</span><strong>96.8%</strong></div></div>
        </div>
      </section>

      <section className="landing-features">
        {features.map(({ icon: Icon, title, text }) => <article className="landing-feature" key={title}><div className="landing-feature-icon"><Icon size={19} /></div><h2>{title}</h2><p>{text}</p></article>)}
      </section>
    </main>
  );
}
