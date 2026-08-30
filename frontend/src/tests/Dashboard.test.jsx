import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Dashboard from "../src/pages/Dashboard";

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
    render(<Dashboard />);

    expect(
      screen.getByText(/dashboard/i)
    ).toBeInTheDocument();
  });

  it("displays dashboard statistics", async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(screen.getByText(/25/i)).toBeInTheDocument();
    });
  });

  it("calls API when dashboard loads", async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});