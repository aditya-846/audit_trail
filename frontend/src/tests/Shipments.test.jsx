import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Shipments from "../pages/Shipments";

vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
  Link: ({ children }) => children,
}));

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    user: { name: "Test User", role: "DISPATCHER" },
    logout: vi.fn(),
    canEdit: () => true,
  }),
}));

describe("Shipments Page", () => {
  beforeEach(() => {
    vi.restoreAllMocks();

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            shipments: [
              {
                id: "SHIP-001",
                shipmentId: "SHIP-001",
                status: "In Transit",
                origin: "Hyderabad",
                destination: "Vijayawada",
              },
              {
                id: "SHIP-002",
                shipmentId: "SHIP-002",
                status: "Delivered",
                origin: "Chennai",
                destination: "Hyderabad",
              },
            ],
          }),
      })
    );
  });

  it("renders shipments page", () => {
    render(<Shipments />);

    expect(
      screen.getByText(/shipments/i)
    ).toBeInTheDocument();
  });

  it("loads shipment data", async () => {
    render(<Shipments />);

    await waitFor(() => {
      expect(screen.getByText(/SHIP-001/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Hyderabad/i)).toBeInTheDocument();
    expect(screen.getByText(/Chennai/i)).toBeInTheDocument();
  });

  it("calls shipments API", async () => {
    render(<Shipments />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});