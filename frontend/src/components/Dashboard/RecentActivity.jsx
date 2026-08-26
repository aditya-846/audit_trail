import {
  Activity,
  Package,
  Thermometer,
  MapPin,
  User,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const iconMap = {
  shipment: Package,
  sensor: Thermometer,
  location: MapPin,
  user: User,
  security: ShieldCheck,
  default: Activity,
};

const defaultActivities = [
  {
    id: 1,
    type: "shipment",
    title: "Shipment created",
    description:
      "Container CONT-2026-001 was registered",
    time: "2 minutes ago",
    status: "success",
  },
  {
    id: 2,
    type: "sensor",
    title: "Temperature updated",
    description:
      "Container CONT-2026-002 reported 4°C",
    time: "8 minutes ago",
    status: "info",
  },
  {
    id: 3,
    type: "location",
    title: "Location updated",
    description:
      "Shipment moved to Visakhapatnam Port",
    time: "15 minutes ago",
    status: "info",
  },
  {
    id: 4,
    type: "security",
    title: "Audit event recorded",
    description:
      "Shipment status change was logged",
    time: "22 minutes ago",
    status: "success",
  },
  {
    id: 5,
    type: "shipment",
    title: "Shipment delivered",
    description:
      "Container CONT-2026-005 reached destination",
    time: "35 minutes ago",
    status: "success",
  },
];

export default function RecentActivity({
  activities = defaultActivities,
}) {
  const navigate = useNavigate();

  return (
    <div className="recent-activity-card">
      <div className="recent-activity-header">
        <div>
          <h2>Recent Activity</h2>

          <p>
            Latest events recorded in the system
          </p>
        </div>

        <Activity size={20} />
      </div>

      <div className="activity-list">
        {activities.length === 0 ? (
          <div className="activity-empty">
            <Activity size={35} />

            <h3>No recent activity</h3>

            <p>
              New events will appear here.
            </p>
          </div>
        ) : (
          activities.map((activity) => {
            const Icon =
              iconMap[activity.type] ||
              iconMap.default;

            return (
              <div
                className="recent-activity-item"
                key={activity.id}
              >
                <div
                  className={`activity-icon ${
                    activity.status || "info"
                  }`}
                >
                  <Icon size={17} />
                </div>

                <div className="activity-details">
                  <strong>
                    {activity.title}
                  </strong>

                  <p>
                    {activity.description}
                  </p>
                </div>

                <time>
                  {activity.time}
                </time>
              </div>
            );
          })
        )}
      </div>

      {activities.length > 0 && (
        <button
          className="view-all-button"
          onClick={() => navigate("/audit-logs")}
          type="button"
        >
          View All Activity
          <ArrowUpRight size={13} />
        </button>
      )}
    </div>
  );
}