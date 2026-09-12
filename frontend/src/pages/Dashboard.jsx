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
    <div className="dashboard-page animate-fade-in-scale">

      <div className="page-header animate-fade-in-up stagger-1">
        <div>
          <h1>Dashboard</h1>

          <p>
            Overview of your shipment and
            audit activity.
          </p>
        </div>
      </div>

      <div className="dashboard-stats-grid">

        <div className="animate-fade-in-up stagger-1">
          <StatCard
            title="Total Shipments"
            value={stats.total}
            change="+12.5%"
            description="Compared to last month"
            icon="package"
            type="blue"
          />
        </div>

        <div className="animate-fade-in-up stagger-2">
          <StatCard
            title="In Transit"
            value={stats.inTransit}
            change="+8.2%"
            description="Currently moving"
            icon="truck"
            type="purple"
          />
        </div>

        <div className="animate-fade-in-up stagger-3">
          <StatCard
            title="Delivered"
            value={stats.delivered}
            change="+15.4%"
            description="Successfully delivered"
            icon="check"
            type="green"
          />
        </div>

        <div className="animate-fade-in-up stagger-4">
          <StatCard
            title="Delayed"
            value={stats.delayed}
            change="-4.8%"
            description="Requires attention"
            icon="alert"
            type="orange"
          />
        </div>

      </div>

      <div className="dashboard-charts animate-fade-in-up stagger-5">

        <ShipmentChart />

        <ActivityChart />

      </div>

      <div className="animate-fade-in-up stagger-5">
        <RecentActivity />
      </div>

    </div>
  );
}