import { Eye, Edit3, Package } from "lucide-react";
import StatusBadge from "../Common/StatusBadge";

export default function ShipmentTable({
  shipments = [],
  onView,
  onEdit,
  canEdit = false,
}) {
  if (shipments.length === 0) {
    return (
      <div className="shipment-empty">
        <Package size={45} />

        <h3>No shipments found</h3>

        <p>
          Create a container or change your filters to
          see shipments here.
        </p>
      </div>
    );
  }

  return (
    <div className="shipment-table-wrapper">
      <table className="shipment-table">
        <thead>
          <tr>
            <th>Container ID</th>
            <th>Name</th>
            <th>Origin</th>
            <th>Temperature</th>
            <th>Status</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {shipments.map((shipment) => (
            <tr
              key={
                shipment._id ||
                shipment.id ||
                shipment.containerId
              }
            >
              <td>
                <div className="shipment-id">
                  <div className="shipment-icon">
                    <Package size={16} />
                  </div>

                  <strong>
                    {shipment.containerId ||
                      shipment.shipmentId ||
                      "N/A"}
                  </strong>
                </div>
              </td>

              <td>
                {shipment.name ||
                  shipment.descriptiveName ||
                  shipment.description ||
                  "-"}
              </td>

              <td>
                {shipment.originPort ||
                  shipment.origin ||
                  "-"}
              </td>

              <td>
                <span className="temperature-value">
                  {shipment.temperature ??
                    shipment.initTemp ??
                    "--"}
                  {shipment.temperature !== undefined ||
                  shipment.initTemp !== undefined
                    ? "°C"
                    : ""}
                </span>
              </td>

              <td>
                <StatusBadge
                  status={
                    shipment.status ||
                    "Active"
                  }
                />
              </td>

              <td>
                {shipment.createdAt
                  ? new Date(
                      shipment.createdAt
                    ).toLocaleDateString()
                  : "-"}
              </td>

              <td>
                <div className="shipment-actions">
                  <button
                    className="table-action view"
                    onClick={() =>
                      onView?.(shipment)
                    }
                    title="View shipment"
                  >
                    <Eye size={16} />
                  </button>

                  {canEdit && (
                    <button
                      className="table-action edit"
                      onClick={() =>
                        onEdit?.(shipment)
                      }
                      title="Edit shipment"
                    >
                      <Edit3 size={16} />
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}