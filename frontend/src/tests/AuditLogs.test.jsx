import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import AuditLogs from "../pages/AuditLogs";

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    user: { name: "Test User", role: "DISPATCHER" },
    logout: vi.fn(),
  }),
}));



describe("Audit Logs Page", () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            events: [
              {
                id: "LOG-001",
                type: "CONTAINER_CREATED",
                user: "Admin",
                createdAt: "2026-08-30T10:00:00Z",
              },
              {
                id: "LOG-002",
                type: "TEMPERATURE_UPDATE",
                user: "Manager",
                createdAt: "2026-08-30T11:00:00Z",
              },
            ],
          }),
      })
    );
  });

  it("renders audit logs page", () => {
    render(<AuditLogs />);

    expect(
      screen.getAllByText(/audit logs/i)[0]
    ).toBeInTheDocument();
  });

  it("displays audit log records", async () => {
    render(<AuditLogs />);

    await waitFor(() => {
      expect(
        screen.getAllByText(/Temperature Updated/i)[0]
      ).toBeInTheDocument();
    });

    expect(
      screen.getAllByText(/Shipment Created/i)[0]
    ).toBeInTheDocument();
  });

  it("calls audit logs API", async () => {
    render(<AuditLogs />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});