const Event = require('../models/EventStore');
const { reconstructState } = require('./replayEngine');

/**
 * Handle incoming command, validate version, and append event.
 * @param {string} id - Aggregate ID (shipment ID)
 * @param {string} type - Command type
 * @param {object} payload - Event payload
 * @param {number} expectedVersion - Client-asserted version
 */
async function handleCommand(id, type, payload, expectedVersion) {
  // 1. Fetch all existing events for this aggregate
  const events = await Event.find({ aggregateId: id }).sort({ version: 1 });
  
  // 2. Reconstruct state to find current version
  const currentState = reconstructState(id, events);
  const currentVersion = currentState.version;

  // 3. Perform OCC validation
  if (expectedVersion !== undefined && expectedVersion !== null && currentVersion !== expectedVersion) {
    const error = new Error('VERSION_CONFLICT');
    error.statusCode = 409;
    error.currentVersion = currentVersion;
    throw error;
  }

  // 4. Map Command Type to Event Type
  let eventType = type;
  if (type === 'MOVE') {
    if (payload.status === 'ARRIVED_AT_PORT' || payload.status === 'ARRIVED') {
      eventType = 'ARRIVED_AT_PORT';
    } else {
      eventType = 'LOADED_ON_SHIP';
    }
  } else if (type === 'TEMPERATURE_UPDATE') {
    // If temperature is high (e.g. > 8.0°C), record as a spike event
    if (payload.temperature !== undefined && payload.temperature > 8.0) {
      eventType = 'TEMPERATURE_SPIKE';
    } else {
      eventType = 'TEMPERATURE_UPDATE';
    }
  }

  // 5. Build and save new event
  const newEvent = new Event({
    aggregateId: id,
    eventType,
    payload,
    timestamp: payload.timestamp ? new Date(payload.timestamp) : new Date(),
    version: currentVersion + 1
  });

  try {
    const savedEvent = await newEvent.save();
    return savedEvent;
  } catch (err) {
    // Catch MongoDB duplicate key error for unique compound index (aggregateId + version)
    if (err.code === 11000) {
      // Fetch current version again to report accurately
      const refreshedEvents = await Event.find({ aggregateId: id }).sort({ version: 1 });
      const refreshedState = reconstructState(id, refreshedEvents);
      
      const error = new Error('VERSION_CONFLICT');
      error.statusCode = 409;
      error.currentVersion = refreshedState.version;
      throw error;
    }
    throw err;
  }
}

module.exports = { handleCommand };
