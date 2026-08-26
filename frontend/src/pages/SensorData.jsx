import {
  Thermometer,
  Activity,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";

import { useState } from "react";

const sensorData = [
  {
    id: 1,
    container: "CONT-2026-001",
    temperature: 4.2,
    humidity: 61,
    status: "Normal",
    updated: "2 min ago",
  },
  {
    id: 2,
    container: "CONT-2026-002",
    temperature: 7.8,
    humidity: 67,
    status: "Normal",
    updated: "4 min ago",
  },
  {
    id: 3,
    container: "CONT-2026-003",
    temperature: 11.4,
    humidity: 73,
    status: "Warning",
    updated: "5 min ago",
  },
  {
    id: 4,
    container: "CONT-2026-004",
    temperature: 3.8,
    humidity: 58,
    status: "Normal",
    updated: "8 min ago",
  },
];

export default function SensorData() {
  const [data] = useState(sensorData);

  const normalCount = data.filter(
    (item) => item.status === "Normal"
  ).length;

  const warningCount = data.filter(
    (item) => item.status === "Warning"
  ).length;

  return (
    <div className="sensor-page">

      <div className="page-header">

        <div>
          <h1>Sensor Data</h1>

          <p>
            Monitor temperature and
            environmental conditions.
          </p>
        </div>

      </div>

      <div className="sensor-summary">

        <SensorSummary
          icon={<Activity />}
          title="Total Sensors"
          value={data.length}
        />

        <SensorSummary
          icon={<CheckCircle />}
          title="Normal"
          value={normalCount}
        />

        <SensorSummary
          icon={<AlertTriangle />}
          title="Warnings"
          value={warningCount}
        />

      </div>

      <div className="sensor-table-card">

        <div className="section-header">
          <div>
            <h2>Sensor Readings</h2>

            <p>
              Latest readings from connected
              containers.
            </p>
          </div>
        </div>

        <div className="sensor-table-wrapper">

          <table className="sensor-table">

            <thead>
              <tr>
                <th>Container</th>
                <th>
                  <Thermometer size={15} />
                  Temperature
                </th>
                <th>Humidity</th>
                <th>Status</th>
                <th>Last Updated</th>
              </tr>
            </thead>

            <tbody>
              {data.map((sensor) => (
                <tr key={sensor.id}>

                  <td>
                    <strong>
                      {sensor.container}
                    </strong>
                  </td>

                  <td>
                    {sensor.temperature}°C
                  </td>

                  <td>
                    {sensor.humidity}%
                  </td>

                  <td>
                    <span
                      className={`sensor-status ${
                        sensor.status.toLowerCase()
                      }`}
                    >
                      {sensor.status ===
                      "Normal" ? (
                        <CheckCircle
                          size={14}
                        />
                      ) : (
                        <AlertTriangle
                          size={14}
                        />
                      )}

                      {sensor.status}
                    </span>
                  </td>

                  <td>
                    {sensor.updated}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

function SensorSummary({
  icon,
  title,
  value,
}) {
  return (
    <div className="sensor-summary-card">

      <div className="sensor-summary-icon">
        {icon}
      </div>

      <div>
        <span>{title}</span>

        <strong>{value}</strong>
      </div>

    </div>
  );
}