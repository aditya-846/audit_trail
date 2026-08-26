import {
  Package,
  Truck,
  CheckCircle,
  AlertTriangle,
  Activity,
  Database,
} from "lucide-react";

const iconMap = {
  package: Package,
  truck: Truck,
  check: CheckCircle,
  alert: AlertTriangle,
  activity: Activity,
  database: Database,
};

export default function StatCard({
  title,
  value,
  change,
  description,
  icon = "package",
  type = "blue",
}) {
  const Icon = iconMap[icon] || Package;

  return (
    <div className="dashboard-stat-card">
      <div className="stat-card-top">
        <div className={`stat-card-icon ${type}`}>
          <Icon size={22} />
        </div>

        {change && (
          <span
            className={`stat-change ${
              change.startsWith("-") ? "negative" : "positive"
            }`}
          >
            {change}
          </span>
        )}
      </div>

      <div className="stat-card-content">
        <p>{title}</p>

        <h2>{value}</h2>

        {description && (
          <span className="stat-description">
            {description}
          </span>
        )}
      </div>
    </div>
  );
}