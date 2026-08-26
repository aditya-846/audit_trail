import { Route, Routes } from "react-router-dom";

import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Shipments from "./pages/Shipments";
import ShipmentDetails from "./pages/ShipmentDetails";
import AuditLogs from "./pages/AuditLogs";
import LiveMonitor from "./pages/LiveMonitor";
import MapView from "./pages/MapView";
import SensorData from "./pages/SensorData";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signin" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/signup" element={<Register />} />
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/shipments" element={<Shipments />} />
      <Route path="/shipments/:id" element={<ShipmentDetails />} />
      <Route path="/audit-logs" element={<AuditLogs />} />
      <Route path="/live" element={<LiveMonitor />} />
      <Route path="/live-monitor" element={<LiveMonitor />} />
      <Route path="/map" element={<MapView />} />
      <Route path="/sensor-data" element={<SensorData />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
