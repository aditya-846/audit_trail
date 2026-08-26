import { createBrowserRouter } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Shipments from "./pages/Shipments";
import ShipmentDetails from "./pages/ShipmentDetails";
import AuditLogs from "./pages/AuditLogs";
import LiveMonitor from "./pages/LiveMonitor";
import MapView from "./pages/MapView";
import SensorData from "./pages/SensorData";
import NotFound from "./pages/NotFound";

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/register", element: <Register /> },
  { path: "/signup", element: <Register /> },
  { path: "/login", element: <Login /> },
  { path: "/signin", element: <Login /> },
  { path: "/dashboard", element: <Dashboard /> },
  { path: "/shipments", element: <Shipments /> },
  { path: "/shipments/:id", element: <ShipmentDetails /> },
  { path: "/audit-logs", element: <AuditLogs /> },
  { path: "/live", element: <LiveMonitor /> },
  { path: "/live-monitor", element: <LiveMonitor /> },
  { path: "/map", element: <MapView /> },
  { path: "/sensor-data", element: <SensorData /> },
  { path: "*", element: <NotFound /> },
]);
