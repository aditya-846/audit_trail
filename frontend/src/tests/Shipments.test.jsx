import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import Shipments from "../pages/Shipments";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";

const Wrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>{children}</AuthProvider>
  </BrowserRouter>
);

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

  it("renders shipments page", async () => {
    render(<Shipments />, { wrapper: Wrapper });

    expect(
      screen.getByText(/shipments/i)
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });

  it("loads shipment data", async () => {
    render(<Shipments />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(screen.getByText(/SHIP-001/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/Hyderabad/i)).toBeInTheDocument();
  });

  it("calls shipments API", async () => {
    render(<Shipments />, { wrapper: Wrapper });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});