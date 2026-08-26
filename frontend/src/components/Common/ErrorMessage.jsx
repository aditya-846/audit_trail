import {
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export default function ErrorMessage({
  title = "Something went wrong",
  message = "Unable to load the requested data.",
  onRetry,
}) {
  return (
    <div className="error-message">
      <div className="error-icon">
        <AlertCircle size={28} />
      </div>

      <div className="error-content">
        <h3>{title}</h3>

        <p>{message}</p>

        {onRetry && (
          <button
            type="button"
            className="retry-button"
            onClick={onRetry}
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}