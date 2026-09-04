import { useState, useEffect } from "react";
import StatCard from "../components/Dashboard/StatCard";
import ShipmentChart from "../components/Dashboard/ShipmentChart";
import ActivityChart from "../components/Dashboard/ActivityChart";
import RecentActivity from "../components/Dashboard/RecentActivity";

import {
  Package,
  Truck,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    inTransit: 0,
    delivered: 0,
    delayed: 0
  });

  useEffect(() => {
    fetch('/api/shipments/stats')
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.message);
        setStats(data);
      })
      .catch(err => console.error("Failed to fetch stats:", err));
  }, []);

  return (
    <div className="dashboard-page">

      <div className="page-header">
        <div>
          <h1>Dashboard</h1>

          <p>
            Overview of your shipment and
            audit activity.
          </p>
        </div>
      </div>

      <div className="dashboard-stats-grid">

        <StatCard
          title="Total Shipments"
          value={stats.total}
          change="+12.5%"
          description="Compared to last month"
          icon="package"
          type="blue"
        />

        <StatCard
          title="In Transit"
          value={stats.inTransit}
          change="+8.2%"
          description="Currently moving"
          icon="truck"
          type="purple"
        />

        <StatCard
          title="Delivered"
          value={stats.delivered}
          change="+15.4%"
          description="Successfully delivered"
          icon="check"
          type="green"
        />

        <StatCard
          title="Delayed"
          value={stats.delayed}
          change="-4.8%"
          description="Requires attention"
          icon="alert"
          type="orange"
        />

      </div>

      <div className="dashboard-charts">

        <ShipmentChart />

        <ActivityChart />

      </div>

      <RecentActivity />

    </div>
  );
}