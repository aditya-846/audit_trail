const initialState = (id) => ({
  id: id,
  name: `Container ${id}`,
  currentStatus: 'PENDING',
  location: 'UNKNOWN',
  temperature: null,
  version: 0,
  lastUpdated: null
});

function reducer(state, event) {
  const { eventType, payload, timestamp, version } = event;
  const updatedState = { 
    ...state, 
    version, 
    lastUpdated: timestamp 
  };

  switch (eventType) {
    case 'CONTAINER_CREATED':
      return {
        ...updatedState,
        currentStatus: 'CREATED',
        location: payload.origin || payload.initialLocation || 'UNKNOWN',
        name: payload.name || state.name,
        temperature: payload.temperature !== undefined ? payload.temperature : null
      };

    case 'LOADED_ON_SHIP':
      return {
        ...updatedState,
        currentStatus: 'IN_TRANSIT',
        location: payload.newLocation || state.location,
        vesselName: payload.vesselName || null
      };

    case 'TEMPERATURE_SPIKE':
    case 'TEMPERATURE_UPDATE':
      return {
        ...updatedState,
        temperature: payload.temperature !== undefined ? payload.temperature : state.temperature
      };

    case 'ARRIVED_AT_PORT':
      return {
        ...updatedState,
        currentStatus: 'ARRIVED_AT_PORT',
        location: payload.newLocation || state.location
      };

    default:
      return state; // Ignore unknown event types
  }
}

/**
 * Reconstructs the state of an aggregate from its event history.
 * @param {string} id - The aggregate (shipment/container) ID
 * @param {Array} events - The chronological list of events for the aggregate
 * @param {string|Date} [asOfDate] - Optional cutoff date for time travel
 */
function reconstructState(id, events, asOfDate = null) {
  let filteredEvents = [...events].sort((a, b) => a.version - b.version);
  
  if (asOfDate) {
    const cutoff = new Date(asOfDate);
    if (!isNaN(cutoff.getTime())) {
      filteredEvents = filteredEvents.filter(e => new Date(e.timestamp) <= cutoff);
    }
  }

  return filteredEvents.reduce(reducer, initialState(id));
}

module.exports = { reconstructState };
