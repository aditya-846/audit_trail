import api from "./api";

export const shipmentService = {
  // Get all shipments
  async getShipments(params = {}) {
    const query =
      new URLSearchParams();

    Object.entries(params).forEach(
      ([key, value]) => {
        if (
          value !== undefined &&
          value !== null &&
          value !== ""
        ) {
          query.append(
            key,
            value
          );
        }
      }
    );

    const queryString =
      query.toString();

    return api.get(
      `/shipments${
        queryString
          ? `?${queryString}`
          : ""
      }`
    );
  },

  // Get one shipment
  async getShipment(id) {
    if (!id) {
      throw new Error(
        "Shipment ID is required."
      );
    }

    return api.get(
      `/shipments/${id}`
    );
  },

  // Create container
  async createShipment(
    shipment
  ) {
    return api.post(
      "/shipments",
      shipment
    );
  },

  // Update shipment
  async updateShipment(
    id,
    shipment
  ) {
    if (!id) {
      throw new Error(
        "Shipment ID is required."
      );
    }

    return api.put(
      `/shipments/${id}`,
      shipment
    );
  },

  // Delete shipment
  async deleteShipment(id) {
    if (!id) {
      throw new Error(
        "Shipment ID is required."
      );
    }

    return api.delete(
      `/shipments/${id}`
    );
  },

  // Update shipment status
  async updateStatus(
    id,
    status
  ) {
    return api.patch(
      `/shipments/${id}/status`,
      {
        status,
      }
    );
  },

  // Update current location
  async updateLocation(
    id,
    location
  ) {
    return api.patch(
      `/shipments/${id}/location`,
      location
    );
  },

  // Get shipment statistics
  async getStats() {
    return api.get(
      "/shipments/stats"
    );
  },
};

export default shipmentService;