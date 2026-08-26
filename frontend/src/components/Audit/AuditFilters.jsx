import {
  Search,
  Filter,
  RotateCcw,
} from "lucide-react";

export default function AuditFilters({
  filters,
  onChange,
  onReset,
}) {
  const handleChange = (field, value) => {
    onChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <div className="audit-filters">
      <div className="audit-filter-title">
        <Filter size={18} />

        <span>Filters</span>
      </div>

      {/* Search */}
      <div className="audit-search">
        <Search size={18} />

        <input
          type="text"
          placeholder="Search events..."
          value={filters.search || ""}
          onChange={(e) =>
            handleChange(
              "search",
              e.target.value
            )
          }
        />
      </div>

      {/* Event Type */}
      <select
        value={filters.type || "all"}
        onChange={(e) =>
          handleChange("type", e.target.value)
        }
      >
        <option value="all">
          All Event Types
        </option>

        <option value="SHIPMENT_CREATED">
          Shipment Created
        </option>

        <option value="SHIPMENT_UPDATED">
          Shipment Updated
        </option>

        <option value="SENSOR_DATA">
          Sensor Data
        </option>

        <option value="LOCATION_UPDATED">
          Location Updated
        </option>

        <option value="USER_LOGIN">
          User Login
        </option>

        <option value="SECURITY_EVENT">
          Security Event
        </option>
      </select>

      {/* Date From */}
      <div className="date-filter">
        <label>From</label>

        <input
          type="date"
          value={filters.fromDate || ""}
          onChange={(e) =>
            handleChange(
              "fromDate",
              e.target.value
            )
          }
        />
      </div>

      {/* Date To */}
      <div className="date-filter">
        <label>To</label>

        <input
          type="date"
          value={filters.toDate || ""}
          onChange={(e) =>
            handleChange(
              "toDate",
              e.target.value
            )
          }
        />
      </div>

      {/* Reset */}
      <button
        className="audit-reset-button"
        onClick={onReset}
        type="button"
      >
        <RotateCcw size={16} />

        Reset
      </button>
    </div>
  );
}