import {
  AlertTriangle,
  ArrowLeft,
  Home,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">

      <div className="not-found-card">

        <div className="not-found-icon">
          <AlertTriangle size={48} />
        </div>

        <div className="not-found-code">
          404
        </div>

        <h1>Page Not Found</h1>

        <p>
          The page you're looking for doesn't
          exist or may have been moved.
        </p>

        <div className="not-found-actions">

          <button
            className="primary-button"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <Home size={17} />

            Dashboard
          </button>

          <button
            className="secondary-button"
            onClick={() =>
              window.history.back()
            }
          >
            <ArrowLeft size={17} />

            Go Back
          </button>

        </div>

      </div>

    </div>
  );
}