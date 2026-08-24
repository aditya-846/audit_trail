const express = require('express');
const router = express.Router();
const { handleCommand } = require('../services/commandHandlers');
const { updateProjection } = require('../services/projectionWorker');

// POST /api/shipments/:id/commands
router.post('/:id/commands', async (req, res) => {
  const { id } = req.params;
  const { type, payload, expectedVersion } = req.body;

  // Basic validation
  if (!type || !payload) {
    return res.status(400).json({ error: 'Command type and payload are required' });
  }

  try {
    // 1. Process command and write new event
    const savedEvent = await handleCommand(id, type, payload, expectedVersion);

    // 2. Refresh Read Model projection synchronously
    await updateProjection(id);

    // 3. Return 201 Created with the saved event
    return res.status(201).json(savedEvent);
  } catch (error) {
    console.error(`Error processing command for ${id}:`, error.message);

    if (error.statusCode === 409) {
      return res.status(409).json({
        error: 'VERSION_CONFLICT',
        currentVersion: error.currentVersion
      });
    }

    return res.status(500).json({
      error: 'INTERNAL_SERVER_ERROR',
      message: error.message
    });
  }
});

module.exports = router;
