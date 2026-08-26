import {
  Inbox,
  Plus,
} from "lucide-react";

export default function EmptyState({
  title = "No data found",
  message = "There are no records to display.",
  actionLabel,
  onAction,
  icon: Icon = Inbox,
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Icon size={42} />
      </div>

      <h3>{title}</h3>

      <p>{message}</p>

      {actionLabel && onAction && (
        <button
          type="button"
          className="empty-action-button"
          onClick={onAction}
        >
          <Plus size={17} />
          {actionLabel}
        </button>
      )}
    </div>
  );
}