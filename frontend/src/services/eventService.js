import api from "./api";

export const eventService = {
  // Get audit events
  async getEvents(params = {}) {
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
      `/events${
        queryString
          ? `?${queryString}`
          : ""
      }`
    );
  },

  // Get one event
  async getEvent(id) {
    if (!id) {
      throw new Error(
        "Event ID is required."
      );
    }

    return api.get(
      `/events/${id}`
    );
  },

  // Get events for one shipment
  async getShipmentEvents(
    shipmentId,
    params = {}
  ) {
    if (!shipmentId) {
      throw new Error(
        "Shipment ID is required."
      );
    }

    const query =
      new URLSearchParams(
        params
      );

    const queryString =
      query.toString();

    return api.get(
      `/shipments/${shipmentId}/events${
        queryString
          ? `?${queryString}`
          : ""
      }`
    );
  },

  // Submit a command/event
  async submitCommand(
    command
  ) {
    return api.post(
      "/events/command",
      command
    );
  },

  // Submit sensor data
  async submitSensorData(
    sensorData
  ) {
    return api.post(
      "/events/sensor",
      sensorData
    );
  },

  // Get event statistics
  async getStats() {
    return api.get(
      "/events/stats"
    );
  },

  // Get events with pagination
  async getPaginatedEvents({
    page = 1,
    limit = 20,
    sort = "createdAt",
    order = "desc",
    type,
    search,
  } = {}) {
    return this.getEvents({
      page,
      limit,
      sort,
      order,
      type,
      search,
    });
  },
};

export default eventService;