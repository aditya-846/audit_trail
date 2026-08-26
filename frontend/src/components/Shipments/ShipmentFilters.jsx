import {
  Search,
  Filter,
  ArrowUpDown,
  X,
} from "lucide-react";

export default function ShipmentFilters({
  filters,
  onChange,
  onReset,
}) {
  const updateFilter = (field, value) => {
    onChange({
      ...filters,
      [field]: value,
    });
  };

  const hasFilters =
    filters.search ||
    filters.status !== "all" ||
    filters.sortBy !== "createdAt";

  return (
    <div className="shipment-filters">
      <div className="filters-heading">
        <Filter size={18} />

        <span>Shipment Filters</span>
      </div>

      {/* Search */}
      <div className="shipment-search">
        <Search size={18} />

        <input
          type="text"
          placeholder="Search container ID, name, port..."
          value={filters.search || ""}
          onChange={(e) =>
            updateFilter(
              "search",
              e.target.value
            )
          }
        />
      </div>

      {/* Status */}
      <select
        value={filters.status || "all"}
        onChange={(e) =>
          updateFilter(
            "status",
            e.target.value
          )
        }
      >
        <option value="all">
          All Statuses
        </option>

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

      {/* Sort */}
      <div className="sort-control">
        <ArrowUpDown size={17} />

        <select
          value={filters.sortBy || "createdAt"}
          onChange={(e) =>
            updateFilter(
              "sortBy",
              e.target.value
            )
          }
        >
          <option value="createdAt">
            Newest
          </option>

          <option value="containerId">
            Container ID
          </option>

          <option value="name">
            Name
          </option>

          <option value="originPort">
            Origin
          </option>

          <option value="temperature">
            Temperature
          </option>
        </select>
      </div>

      {/* Reset */}
      {hasFilters && (
        <button
          className="filter-reset"
          onClick={onReset}
          type="button"
        >
          <X size={16} />

          Clear
        </button>
      )}
    </div>
  );
}