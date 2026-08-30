import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import AuditLogs from "../src/pages/AuditLogs";

describe("Audit Logs Page", () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            {
              id: "LOG-001",
              action: "Shipment Created",
              user: "Admin",
              timestamp: "2026-08-30T10:00:00Z",
            },
            {
              id: "LOG-002",
              action: "Shipment Updated",
              user: "Manager",
              timestamp: "2026-08-30T11:00:00Z",
            },
          ]),
      })
    );
  });

  it("renders audit logs page", () => {
    render(<AuditLogs />);

    expect(
      screen.getByText(/audit logs/i)
    ).toBeInTheDocument();
  });

  it("displays audit log records", async () => {
    render(<AuditLogs />);

    await waitFor(() => {
      expect(
        screen.getByText(/Shipment Created/i)
      ).toBeInTheDocument();
    });

    expect(
      screen.getByText(/Shipment Updated/i)
    ).toBeInTheDocument();
  });

  it("calls audit logs API", async () => {
    render(<AuditLogs />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});