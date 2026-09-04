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
            total: 999,
            inTransit: 888,
            delivered: 777,
            delayed: 666
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
      // The total stat should be rendered based on our fetch mock
      expect(screen.getByText(/999/i)).toBeInTheDocument();
      expect(screen.getByText(/888/i)).toBeInTheDocument();
    });
  });

  it("calls API when dashboard loads", async () => {
    render(<Dashboard />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});