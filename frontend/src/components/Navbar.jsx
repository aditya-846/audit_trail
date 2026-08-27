import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const Navbar = () => {
  const navLinkStyle = ({ isActive }) => ({
    textDecoration: "none",

    color: isActive ? "#2563eb" : "#475569",

    backgroundColor: isActive
      ? "rgba(37, 99, 235, 0.10)"
      : "transparent",

    fontSize: "14px",
    fontWeight: isActive ? "700" : "600",

    padding: "10px 16px",

    borderRadius: "8px",

    transition: "all 0.25s ease",

    whiteSpace: "nowrap",

    border: isActive
      ? "1px solid rgba(37, 99, 235, 0.15)"
      : "1px solid transparent",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "inherit",
      }}
    >
      {/* ================= NAVBAR ================= */}
      <nav
        style={{
          width: "100%",

          minHeight: "70px",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",

          gap: "8px",

          padding: "10px 24px",

          /*
            No new background color is added here.
            This allows the navbar to blend with
            your existing application background.
          */
          background: "inherit",

          borderBottom: "1px solid rgba(148, 163, 184, 0.25)",

          boxShadow: "0 2px 8px rgba(15, 23, 42, 0.04)",

          position: "sticky",
          top: 0,

          zIndex: 1000,

          overflowX: "auto",
        }}
      >
        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          style={navLinkStyle}
          onMouseEnter={(e) => {
            if (!e.currentTarget.classList.contains("active")) {
              e.currentTarget.style.backgroundColor =
                "rgba(37, 99, 235, 0.06)";
              e.currentTarget.style.color = "#2563eb";
            }
          }}
          onMouseLeave={(e) => {
            if (!e.currentTarget.classList.contains("active")) {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#475569";
            }
          }}
        >
          DASHBOARD
        </NavLink>

        {/* Shipments */}
        <NavLink
          to="/shipments"
          style={navLinkStyle}
          onMouseEnter={(e) => {
            if (!e.currentTarget.classList.contains("active")) {
              e.currentTarget.style.backgroundColor =
                "rgba(37, 99, 235, 0.06)";
              e.currentTarget.style.color = "#2563eb";
            }
          }}
          onMouseLeave={(e) => {
            if (!e.currentTarget.classList.contains("active")) {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#475569";
            }
          }}
        >
          SHIPMENTS
        </NavLink>

        {/* Audit Logs */}
        <NavLink
          to="/audit-logs"
          style={navLinkStyle}
          onMouseEnter={(e) => {
            if (!e.currentTarget.classList.contains("active")) {
              e.currentTarget.style.backgroundColor =
                "rgba(37, 99, 235, 0.06)";
              e.currentTarget.style.color = "#2563eb";
            }
          }}
          onMouseLeave={(e) => {
            if (!e.currentTarget.classList.contains("active")) {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#475569";
            }
          }}
        >
          AUDIT LOGS
        </NavLink>

        {/* Live Monitor */}
        <NavLink
          to="/live"
          style={navLinkStyle}
          onMouseEnter={(e) => {
            if (!e.currentTarget.classList.contains("active")) {
              e.currentTarget.style.backgroundColor =
                "rgba(37, 99, 235, 0.06)";
              e.currentTarget.style.color = "#2563eb";
            }
          }}
          onMouseLeave={(e) => {
            if (!e.currentTarget.classList.contains("active")) {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#475569";
            }
          }}
        >
          LIVE MONITOR
        </NavLink>

        {/* Map View */}
        <NavLink
          to="/map"
          style={navLinkStyle}
          onMouseEnter={(e) => {
            if (!e.currentTarget.classList.contains("active")) {
              e.currentTarget.style.backgroundColor =
                "rgba(37, 99, 235, 0.06)";
              e.currentTarget.style.color = "#2563eb";
            }
          }}
          onMouseLeave={(e) => {
            if (!e.currentTarget.classList.contains("active")) {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#475569";
            }
          }}
        >
          MAP VIEW
        </NavLink>

        {/* Sensor Data */}
        <NavLink
          to="/sensor-data"
          style={navLinkStyle}
          onMouseEnter={(e) => {
            if (!e.currentTarget.classList.contains("active")) {
              e.currentTarget.style.backgroundColor =
                "rgba(37, 99, 235, 0.06)";
              e.currentTarget.style.color = "#2563eb";
            }
          }}
          onMouseLeave={(e) => {
            if (!e.currentTarget.classList.contains("active")) {
              e.currentTarget.style.backgroundColor = "transparent";
              e.currentTarget.style.color = "#475569";
            }
          }}
        >
          SENSOR DATA
        </NavLink>
      </nav>

      {/* ================= PAGE CONTENT ================= */}

      <main
        style={{
          width: "100%",
          minHeight: "calc(100vh - 70px)",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Navbar;