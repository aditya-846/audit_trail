import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import AuditLogs from "../pages/AuditLogs";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";

const Wrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>{children}</AuthProvider>
  </BrowserRouter>
);

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
                action: "Shipment Created",
                type: "Shipment Created",
                user: "Admin",
                timestamp: "2026-08-30T10:00:00Z",
              },
              {
                id: "LOG-002",
                action: "Shipment Updated",
                type: "Shipment Updated",
                user: "Manager",
                timestamp: "2026-08-30T11:00:00Z",
              },
            ],
          }),
      })
    );
  });

  it("renders audit logs page", async () => {
    render(<AuditLogs />, { wrapper: Wrapper });

    expect(
      screen.getByRole("heading", { name: /audit logs/i })
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it("displays audit logs from API", async () => {
    render(<AuditLogs />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(
        screen.getAllByText(/Shipment Created/i)[0]
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Shipment Updated/i)
      ).toBeInTheDocument();
    });
  });

  it("calls audit logs API", async () => {
    render(<AuditLogs />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});