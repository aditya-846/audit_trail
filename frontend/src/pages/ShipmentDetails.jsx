import {
  ArrowLeft,
  Package,
  Thermometer,
  MapPin,
  Calendar,
  Activity,
  ShieldCheck,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import StatusBadge from "../components/Common/StatusBadge";

export default function ShipmentDetails({
  shipment,
}) {
  const navigate = useNavigate();

  const data = shipment || {
    containerId: "CONT-2026-001",
    descriptiveName:
      "Pharmaceutical Cold Chain",
    originPort: "Chennai Port",
    status: "In Transit",
    initTemp: 4,
    location: "Hyderabad",
    createdAt: "2026-08-20",
  };

  return (
    <div className="shipment-details-page">

      <button
        className="back-button"
        onClick={() =>
          navigate("/shipments")
        }
      >
        <ArrowLeft size={18} />

        Back to Shipments
      </button>

      <div className="page-header">

        <div>
          <div className="shipment-detail-id">
            <Package size={20} />

            {data.containerId}
          </div>

          <h1>
            {data.descriptiveName}
          </h1>

          <p>
            Shipment and audit information
          </p>
        </div>

        <StatusBadge
          status={data.status}
        />

      </div>

      <div className="details-grid">

        <DetailCard
          icon={<Package />}
          title="Container ID"
          value={data.containerId}
        />

        <DetailCard
          icon={<MapPin />}
          title="Origin Port"
          value={data.originPort}
        />

        <DetailCard
          icon={<MapPin />}
          title="Current Location"
          value={
            data.location || "Not available"
          }
        />

        <DetailCard
          icon={<Thermometer />}
          title="Initial Temperature"
          value={`${data.initTemp ?? "--"}°C`}
        />

        <DetailCard
          icon={<Calendar />}
          title="Created"
          value={
            data.createdAt
              ? new Date(
                  data.createdAt
                ).toLocaleDateString()
              : "--"
          }
        />

        <DetailCard
          icon={<Activity />}
          title="Tracking Status"
          value={data.status}
        />

      </div>

      <div className="security-card">
        <ShieldCheck size={24} />

        <div>
          <h3>Audit Protected</h3>

          <p>
            All shipment changes are recorded
            as immutable audit events.
          </p>
        </div>
      </div>

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