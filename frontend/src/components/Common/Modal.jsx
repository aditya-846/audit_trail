import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = "medium",
  showClose = true,
}) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener(
      "keydown",
      handleEscape
    );

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );

      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="modal-overlay"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose?.();
        }
      }}
    >
      <div
        className={`modal-container modal-${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            {title && (
              <h2 id="modal-title">
                {title}
              </h2>
            )}

            {description && (
              <p>{description}</p>
            )}
          </div>

          {showClose && (
            <button
              type="button"
              className="modal-close-button"
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
}