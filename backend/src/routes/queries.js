const express = require('express');
const router = express.Router();
const Event = require('../models/EventStore');
const ShipmentReadModel = require('../models/ShipmentReadModel');
const { reconstructState } = require('../services/replayEngine');

// GET /api/shipments?search=<query>
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};

    if (search) {
      const regex = new RegExp(search, 'i');
      filter = {
        $or: [
          { id: regex },
          { name: regex },
          { currentStatus: regex },
          { location: regex }
        ]
      };
    }

    const shipments = await ShipmentReadModel.find(filter).sort({ lastUpdated: -1 });
    
    // Map list to frontend's expected contract format
    const formattedShipments = shipments.map(s => ({
      id: s.id,
      name: s.name,
      currentStatus: s.currentStatus,
      lastUpdated: s.lastUpdated
    }));

    return res.json({ shipments: formattedShipments });
  } catch (error) {
    console.error('Error fetching shipments list:', error.message);
    return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: error.message });
  }
});

// GET /api/shipments/:id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const { asOf } = req.query;

  try {
    if (asOf) {
      // 1. Time Travel Query: Reconstruct state from events up to the asOf date
      const events = await Event.find({ aggregateId: id }).sort({ version: 1 });
      
      if (events.length === 0) {
        return res.status(404).json({ error: 'SHIPMENT_NOT_FOUND', message: `No events found for shipment ${id}` });
      }

      const reconstructed = reconstructState(id, events, asOf);
      return res.json({
        id: reconstructed.id,
        currentStatus: reconstructed.currentStatus,
        location: reconstructed.location,
        temperature: reconstructed.temperature,
        version: reconstructed.version,
        lastUpdated: reconstructed.lastUpdated
      });
    } else {
      // 2. Standard Query: Get directly from Read Model for speed
      let shipment = await ShipmentReadModel.findOne({ id });

      if (!shipment) {
        // Fallback/Healing: Try to reconstruct state from events if read model is empty
        const events = await Event.find({ aggregateId: id }).sort({ version: 1 });
        if (events.length === 0) {
          return res.status(404).json({ error: 'SHIPMENT_NOT_FOUND', message: `Shipment ${id} does not exist` });
        }

        console.log(`Shipment ${id} missing in Read Model. Reconstructing state and healing...`);
        const reconstructed = reconstructState(id, events);
        
        // Save to Read Model to heal it
        shipment = await ShipmentReadModel.findOneAndUpdate(
          { id },
          {
            id: reconstructed.id,
            name: `Container ${reconstructed.id}`,
            currentStatus: reconstructed.currentStatus,
            location: reconstructed.location,
            temperature: reconstructed.temperature,
            version: reconstructed.version,
            lastUpdated: reconstructed.lastUpdated || new Date()
          },
          { upsert: true, new: true }
        );
      }

      return res.json({
        id: shipment.id,
        currentStatus: shipment.currentStatus,
        location: shipment.location,
        temperature: shipment.temperature,
        version: shipment.version,
        lastUpdated: shipment.lastUpdated
      });
    }
  } catch (error) {
    console.error(`Error fetching shipment details for ${id}:`, error.message);
    return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: error.message });
  }
});

// GET /api/shipments/:id/events
router.get('/:id/events', async (req, res) => {
  const { id } = req.params;

  try {
    const events = await Event.find({ aggregateId: id }).sort({ version: 1 });
    
    // Map to API contract
    const formattedEvents = events.map(e => ({
      eventType: e.eventType,
      payload: e.payload,
      timestamp: e.timestamp,
      version: e.version
    }));

    return res.json({ events: formattedEvents });
  } catch (error) {
    console.error(`Error fetching events for ${id}:`, error.message);
    return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: error.message });
  }
});

module.exports = router;
