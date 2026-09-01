import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "../pages/Dashboard";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";

const Wrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>{children}</AuthProvider>
  </BrowserRouter>
);

describe("Dashboard Page", () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            shipments: 25,
            auditLogs: 120,
            sensors: 24,
            activeRoutes: 18,
          }),
      })
    );
  });

  it("renders dashboard", () => {
    render(<Dashboard />, { wrapper: Wrapper });

    expect(
      screen.getByText(/dashboard/i)
    ).toBeInTheDocument();
  });

  it("displays dashboard statistics", async () => {
    render(<Dashboard />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText(/1,248/i)).toBeInTheDocument();
    });
  });
});