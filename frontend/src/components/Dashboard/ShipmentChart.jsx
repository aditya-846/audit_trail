import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const defaultData = [
  {
    name: "In Transit",
    value: 45,
  },
  {
    name: "Delivered",
    value: 30,
  },
  {
    name: "Processing",
    value: 15,
  },
  {
    name: "Delayed",
    value: 10,
  },
];

const COLORS = [
  "#2563eb",
  "#12b76a",
  "#7f56d9",
  "#f79009",
];

export default function ShipmentChart({
  data = defaultData,
}) {
  return (
    <div className="dashboard-chart-card">
      <div className="chart-header">
        <div>
          <h2>Shipment Overview</h2>

          <p>
            Current shipment status distribution
          </p>
        </div>

        <div className="chart-period">
          This Month
        </div>
      </div>

      <div className="shipment-chart">
        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={75}
              outerRadius={110}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>

            <Tooltip
              formatter={(value) => [
                `${value}%`,
                "Shipments",
              ]}
            />

            <Legend
              verticalAlign="bottom"
              height={40}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}