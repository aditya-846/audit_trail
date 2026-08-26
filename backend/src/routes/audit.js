const express = require('express');
const router = express.Router();
const Event = require('../models/EventStore');

// GET /api/events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ timestamp: -1 });
    const formattedEvents = events.map(event => ({
      id: event._id,
      type: event.eventType,
      action: event.eventType,
      shipmentId: event.aggregateId,
      createdAt: event.timestamp,
      version: event.version,
      ...event.payload
    }));

    return res.json({ events: formattedEvents });
  } catch (error) {
    console.error('Error fetching audit events:', error.message);
    return res.status(500).json({ error: 'INTERNAL_SERVER_ERROR', message: error.message });
  }
});

module.exports = router;
