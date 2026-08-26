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
          value="1,248"
          change="+12.5%"
          description="Compared to last month"
          icon="package"
          type="blue"
        />

        <StatCard
          title="In Transit"
          value="386"
          change="+8.2%"
          description="Currently moving"
          icon="truck"
          type="purple"
        />

        <StatCard
          title="Delivered"
          value="742"
          change="+15.4%"
          description="Successfully delivered"
          icon="check"
          type="green"
        />

        <StatCard
          title="Delayed"
          value="24"
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