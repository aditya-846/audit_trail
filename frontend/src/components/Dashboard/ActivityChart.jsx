import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const defaultData = [
  {
    day: "Mon",
    events: 120,
  },
  {
    day: "Tue",
    events: 180,
  },
  {
    day: "Wed",
    events: 145,
  },
  {
    day: "Thu",
    events: 220,
  },
  {
    day: "Fri",
    events: 190,
  },
  {
    day: "Sat",
    events: 250,
  },
  {
    day: "Sun",
    events: 210,
  },
];

export default function ActivityChart({
  data = defaultData,
}) {
  return (
    <div className="dashboard-chart-card">
      <div className="chart-header">
        <div>
          <h2>Event Activity</h2>

          <p>
            Events recorded during the week
          </p>
        </div>

        <div className="chart-period">
          Last 7 Days
        </div>
      </div>

      <div className="activity-chart">
        <ResponsiveContainer
          width="100%"
          height={300}
        >
          <AreaChart
            data={data}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient
                id="activityGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#2563eb"
                  stopOpacity={0.3}
                />

                <stop
                  offset="95%"
                  stopColor="#2563eb"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#eaecf0"
            />

            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#667085",
                fontSize: 12,
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#667085",
                fontSize: 12,
              }}
            />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="events"
              stroke="#2563eb"
              strokeWidth={3}
              fill="url(#activityGradient)"
              name="Events"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}