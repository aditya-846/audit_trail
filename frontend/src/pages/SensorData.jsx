import "../styles/sensor-data.css";

const sensors = [
  {
    id: "SENSOR-001",
    container: "CONT-2026-001",
    location: "Hyderabad",
    temperature: "4.1°C",
    humidity: "62%",
    status: "Normal",
    updated: "Just now",
  },
  {
    id: "SENSOR-002",
    container: "CONT-2026-002",
    location: "Vijayawada",
    temperature: "7.4°C",
    humidity: "68%",
    status: "Normal",
    updated: "1 min ago",
  },
  {
    id: "SENSOR-003",
    container: "CONT-2026-003",
    location: "Visakhapatnam",
    temperature: "4.7°C",
    humidity: "59%",
    status: "Normal",
    updated: "3 min ago",
  },
  {
    id: "SENSOR-004",
    container: "CONT-2026-004",
    location: "Chennai",
    temperature: "9.2°C",
    humidity: "74%",
    status: "Warning",
    updated: "5 min ago",
  },
];

export default function SensorData() {
  return (
    <div className="sensor-page">
      <div className="sensor-page-header">
        <div className="sensor-title-section">
          <div className="sensor-breadcrumb">
            <span>Dashboard</span>
            <span aria-hidden="true">›</span>
            <span>Sensor Data</span>
          </div>
          <h1>Sensor Data</h1>
          <p>Monitor temperature and environmental conditions.</p>
        </div>

        <div className="sensor-live">
          <span className="live-dot" />
          Live Monitoring
        </div>
      </div>

      <div className="sensor-summary">
        <div className="sensor-card">
          <div className="sensor-card-top">
            <div className="sensor-icon blue">🌡</div>
            <span className="sensor-trend positive">+2.4%</span>
          </div>
          <div className="sensor-value">5.8°C</div>
          <div className="sensor-label">Average Temperature</div>
        </div>

        <div className="sensor-card">
          <div className="sensor-card-top">
            <div className="sensor-icon purple">💧</div>
            <span className="sensor-trend positive">Stable</span>
          </div>
          <div className="sensor-value">64%</div>
          <div className="sensor-label">Average Humidity</div>
        </div>

        <div className="sensor-card">
          <div className="sensor-card-top">
            <div className="sensor-icon green">✓</div>
            <span className="sensor-trend positive">Online</span>
          </div>
          <div className="sensor-value">24</div>
          <div className="sensor-label">Sensors Online</div>
        </div>

        <div className="sensor-card">
          <div className="sensor-card-top">
            <div className="sensor-icon yellow">!</div>
            <span className="sensor-trend warning">Attention</span>
          </div>
          <div className="sensor-value">2</div>
          <div className="sensor-label">Active Alerts</div>
        </div>
      </div>

      <div className="sensor-overview">
        <div className="environment-card">
          <div className="section-header">
            <div>
              <h2>Environmental Overview</h2>
              <p>Current sensor conditions</p>
            </div>
            <button className="sensor-filter" type="button">
              Last 24 Hours <span aria-hidden="true">▾</span>
            </button>
          </div>

          <div className="environment-grid">
            <div className="environment-item">
              <div className="environment-icon temperature">🌡</div>
              <div><span>Temperature</span><strong>5.8°C</strong></div>
            </div>
            <div className="environment-item">
              <div className="environment-icon humidity">💧</div>
              <div><span>Humidity</span><strong>64%</strong></div>
            </div>
            <div className="environment-item">
              <div className="environment-icon pressure">◉</div>
              <div><span>Pressure</span><strong>1013 hPa</strong></div>
            </div>
          </div>

          <div className="sensor-chart">
            <div className="chart-labels"><span>Temperature</span><span>Last 24 hours</span></div>
            <div className="chart-area">
              <div className="chart-line">
                <span className="chart-point p1" /><span className="chart-point p2" />
                <span className="chart-point p3" /><span className="chart-point p4" />
                <span className="chart-point p5" /><span className="chart-point p6" />
              </div>
              <div className="chart-grid-line line-1" /><div className="chart-grid-line line-2" /><div className="chart-grid-line line-3" />
            </div>
            <div className="chart-times"><span>00:00</span><span>04:00</span><span>08:00</span><span>12:00</span><span>16:00</span><span>20:00</span><span>24:00</span></div>
          </div>
        </div>
      </div>

      <div className="sensor-table-card">
        <div className="sensor-table-header">
          <div><h2>Connected Sensors</h2><p>Latest readings from registered sensors</p></div>
          <div className="sensor-table-actions">
            <input type="text" placeholder="Search sensors..." className="sensor-search" />
            <button className="refresh-btn" type="button">↻ Refresh</button>
          </div>
        </div>

        <div className="sensor-table-wrapper">
          <table className="sensor-table">
            <thead><tr><th>Sensor</th><th>Container</th><th>Location</th><th>Temperature</th><th>Humidity</th><th>Status</th><th>Updated</th></tr></thead>
            <tbody>{sensors.map((sensor) => (
              <tr key={sensor.id}>
                <td><div className="sensor-id"><div className="sensor-small-icon">◉</div><div><strong>{sensor.id}</strong><small>IoT Sensor</small></div></div></td>
                <td className="container-text">{sensor.container}</td>
                <td className="location-text">📍 {sensor.location}</td>
                <td><span className="temperature-value">{sensor.temperature}</span></td>
                <td><span className="humidity-value">{sensor.humidity}</span></td>
                <td><span className={`sensor-status ${sensor.status === "Warning" ? "warning" : "normal"}`}><span className="status-dot" />{sensor.status}</span></td>
                <td className="updated-text">{sensor.updated}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>

        <div className="sensor-pagination">
          <span>Showing 1-4 of 24 sensors</span>
          <div><button type="button">‹</button><button className="active" type="button">1</button><button type="button">2</button><button type="button">3</button><button type="button">›</button></div>
        </div>
      </div>
    </div>
  );
}

export const routes = [
  { path: "/sensor-data", element: <SensorData /> },
];