import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  FileText,
  Map,
  LogOut,
  User,
  Activity,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function Layout() {
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
  ];

  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="logo">
          <div className="logo-icon">A</div>

          <div>
            <h2>AuditFlow</h2>
            <span>Event Intelligence</span>
          </div>
        </div>

        <nav className="navigation">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `nav-item ${isActive ? "active" : ""}`
                }
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="user-card">
            <div className="avatar">
              <User size={18} />
            </div>

            <div className="user-info">
              <strong>{user?.username || "User"}</strong>
              <span>{user?.role || "read-only"}</span>
            </div>
          </div>

          <button className="logout-btn" onClick={logout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}