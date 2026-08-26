import { useEffect, useState } from "react";
import {
  X,
  Package,
  Thermometer,
  MapPin,
} from "lucide-react";

const initialForm = {
  containerId: "",
  descriptiveName: "",
  originPort: "",
  initTemp: "",
  status: "Active",
};

export default function ShipmentModal({
  isOpen,
  shipment,
  onClose,
  onSubmit,
  loading = false,
}) {
  const [form, setForm] =
    useState(initialForm);

  const isEditing = Boolean(shipment);

  useEffect(() => {
    if (shipment) {
      setForm({
        containerId:
          shipment.containerId ||
          shipment.shipmentId ||
          "",
        descriptiveName:
          shipment.descriptiveName ||
          shipment.name ||
          "",
        originPort:
          shipment.originPort ||
          shipment.origin ||
          "",
        initTemp:
          shipment.initTemp ??
          shipment.temperature ??
          "",
        status:
          shipment.status ||
          "Active",
      });
    } else {
      setForm(initialForm);
    }
  }, [shipment, isOpen]);

  if (!isOpen) {
    return null;
  }

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.containerId.trim()) {
      return;
    }

    if (!form.descriptiveName.trim()) {
      return;
    }

    if (!form.originPort.trim()) {
      return;
    }

    onSubmit({
      ...form,
      initTemp:
        form.initTemp === ""
          ? null
          : Number(form.initTemp),
    });
  };

  return (
    <div
      className="shipment-modal-overlay"
      onClick={onClose}
    >
      <div
        className="shipment-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >
        {/* Header */}
        <div className="shipment-modal-header">
          <div className="modal-title">
            <div className="modal-icon">
              <Package size={21} />
            </div>

            <div>
              <h2>
                {isEditing
                  ? "Edit Container"
                  : "Create Container"}
              </h2>

              <p>
                {isEditing
                  ? "Update container information"
                  : "Add a new container to the ledger"}
              </p>
            </div>
          </div>

          <button
            className="modal-close"
            onClick={onClose}
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form
          className="shipment-form"
          onSubmit={handleSubmit}
        >
          {/* Container ID */}
          <div className="form-group">
            <label>
              Container ID
              <span>*</span>
            </label>

            <div className="form-input">
              <Package size={17} />

              <input
                type="text"
                placeholder="CONT-2026-001"
                value={form.containerId}
                onChange={(e) =>
                  updateField(
                    "containerId",
                    e.target.value
                  )
                }
                disabled={isEditing}
              />
            </div>
          </div>

          {/* Name */}
          <div className="form-group">
            <label>
              Descriptive Name
              <span>*</span>
            </label>

            <div className="form-input">
              <Package size={17} />

              <input
                type="text"
                placeholder="Pharmaceutical Cold Chain"
                value={
                  form.descriptiveName
                }
                onChange={(e) =>
                  updateField(
                    "descriptiveName",
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          {/* Origin */}
          <div className="form-group">
            <label>
              Origin Port
              <span>*</span>
            </label>

            <div className="form-input">
              <MapPin size={17} />

              <input
                type="text"
                placeholder="Chennai Port"
                value={form.originPort}
                onChange={(e) =>
                  updateField(
                    "originPort",
                    e.target.value
                  )
                }
              />
            </div>
          </div>

          {/* Temperature */}
          <div className="form-group">
            <label>
              Init Temp (°C)
            </label>

            <div className="form-input">
              <Thermometer size={17} />

              <input
                type="number"
                step="0.1"
                placeholder="4"
                value={form.initTemp}
                onChange={(e) =>
                  updateField(
                    "initTemp",
                    e.target.value
                  )
                }
              />
            </div>

            <small>
              Example: 4°C for refrigerated
              pharmaceutical cargo.
            </small>
          </div>

          {/* Status */}
          {isEditing && (
            <div className="form-group">
              <label>Status</label>

              <select
                value={form.status}
                onChange={(e) =>
                  updateField(
                    "status",
                    e.target.value
                  )
                }
              >
                <option value="Active">
                  Active
                </option>

                <option value="In Transit">
                  In Transit
                </option>

                <option value="Delivered">
                  Delivered
                </option>

                <option value="Delayed">
                  Delayed
                </option>

                <option value="Completed">
                  Completed
                </option>
              </select>
            </div>
          )}

          {/* Footer */}
          <div className="shipment-modal-footer">
            <button
              type="button"
              className="cancel-button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading
                ? "Saving..."
                : isEditing
                ? "Save Changes"
                : "Create Container"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}