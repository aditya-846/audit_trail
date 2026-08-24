const Event = require('../models/EventStore');
const ShipmentReadModel = require('../models/ShipmentReadModel');
const { reconstructState } = require('./replayEngine');

/**
 * Updates the read model for a given aggregate ID.
 * @param {string} id - The aggregate ID (shipment ID)
 */
async function updateProjection(id) {
  // 1. Fetch all events for the shipment
  const events = await Event.find({ aggregateId: id }).sort({ version: 1 });

  if (events.length === 0) {
    // If all events were somehow deleted (shouldn't happen in immutable log, but for completeness)
    await ShipmentReadModel.deleteOne({ id });
    return null;
  }

  // 2. Reconstruct the state by replaying history
  const state = reconstructState(id, events);

  // 3. Update or Insert the read model representation
  const updatedReadModel = await ShipmentReadModel.findOneAndUpdate(
    { id },
    {
      id: state.id,
      name: state.name || `Container ${state.id}`,
      currentStatus: state.currentStatus,
      location: state.location,
      temperature: state.temperature,
      version: state.version,
      lastUpdated: state.lastUpdated || new Date()
    },
    { upsert: true, new: true }
  );

  console.log(`Projection updated for shipment ${id} to version ${state.version}`);
  return updatedReadModel;
}

module.exports = { updateProjection };
