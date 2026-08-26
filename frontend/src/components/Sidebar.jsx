import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FileText,
  Map,
  Activity,
  Database,
  ShieldCheck,
  LogOut,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { user, logout } = useAuth();

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Shipments",
      path: "/shipments",
      icon: Package,
    },
    {
      name: "Audit Logs",
      path: "/audit-logs",
      icon: FileText,
    },
    {
      name: "Live Monitor",
      path: "/live",
      icon: Activity,
    },
    {
      name: "Map View",
      path: "/map",
      icon: Map,
    },
    {
      name: "Sensor Data",
      path: "/sensor-data",
      icon: Database,
    },
  ];

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-box">
          <ShieldCheck size={24} />
        </div>

        <div className="logo-text">
          <h2>AuditFlow</h2>
          <span>Event Intelligence</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-navigation">
        <p className="menu-title">MAIN MENU</p>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "active" : ""}`
              }
            >
              <Icon size={19} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="sidebar-bottom">
        <div className="security-status">
          <ShieldCheck size={18} />

          <div>
            <strong>System Secure</strong>
            <span>Audit protection active</span>
          </div>
        </div>

        <div className="sidebar-user">
          <div className="user-avatar">
            {user?.username
              ? user.username.charAt(0).toUpperCase()
              : "U"}
          </div>

          <div className="sidebar-user-info">
            <strong>{user?.username || "User"}</strong>
            <span>{user?.role || "read-only"}</span>
          </div>

          <button
            className="sidebar-logout"
            onClick={logout}
            title="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}