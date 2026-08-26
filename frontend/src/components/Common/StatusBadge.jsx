import {
  CheckCircle,
  Clock,
  AlertTriangle,
  Truck,
  Package,
} from "lucide-react";

const statusConfig = {
  active: { label: "Active", className: "active", icon: Clock },
  "in transit": { label: "In Transit", className: "in-transit", icon: Truck },
  delivered: { label: "Delivered", className: "delivered", icon: CheckCircle },
  completed: { label: "Completed", className: "completed", icon: CheckCircle },
  delayed: { label: "Delayed", className: "delayed", icon: AlertTriangle },
  processing: { label: "Processing", className: "processing", icon: Package },
};

export default function StatusBadge({ status = "Active" }) {
  const key = String(status).trim().toLowerCase();
  const config = statusConfig[key] || {
    label: status,
    className: "default",
    icon: Package,
  };
  const Icon = config.icon;

  return (
    <span className={`status-badge ${config.className}`}>
      <Icon size={14} />
      <span>{config.label}</span>
    </span>
  );
}
