require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const Event = require('./src/models/EventStore');
const ShipmentReadModel = require('./src/models/ShipmentReadModel');

// Import server code programmatically for end-to-end testing
const connectDB = require('./src/config/db');
const express = require('express');
const cors = require('cors');
const queryRouter = require('./src/routes/queries');
const commandRouter = require('./src/routes/commands');

const TEST_PORT = 5099;
const BASE_URL = `http://127.0.0.1:${TEST_PORT}`;

// Helper to make HTTP requests using Node.js native fetch (Node 18+)
async function makeRequest(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json();
  return { status: response.status, data };
}

async function runTests() {
  console.log('=== STARTING AUDIT TRAIL BACKEND VERIFICATION ===');
  
  // 1. Setup Express Test Server
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use('/api/shipments', queryRouter);
  app.use('/api/shipments', commandRouter);
  
  let server;
  await new Promise((resolve) => {
    server = app.listen(TEST_PORT, () => {
      console.log(`Test server listening on port ${TEST_PORT}`);
      resolve();
    });
  });

  let testCount = 0;
  let passedCount = 0;

  function assert(condition, message) {
    testCount++;
    if (condition) {
      console.log(`[PASS] ${message}`);
      passedCount++;
    } else {
      console.error(`[FAIL] ${message}`);
    }
  }

  try {
    // -------------------------------------------------------------
    // Test 1: Get Shipment List (GET /api/shipments?search=Smart)
    // -------------------------------------------------------------
    const listRes = await makeRequest(`${BASE_URL}/api/shipments?search=Smart`);
    assert(listRes.status === 200, 'GET /api/shipments returns status 200');
    assert(listRes.data.shipments && listRes.data.shipments.length > 0, 'Returns list of matching shipments');
    assert(listRes.data.shipments[0].id === 'SHIP-001', 'First shipment is SHIP-001');
    assert(listRes.data.shipments[0].name.includes('Smart Cold-Chain'), 'Shipment has correct name');

    // -------------------------------------------------------------
    // Test 2: Get Current Reconstructed State (GET /api/shipments/SHIP-001)
    // -------------------------------------------------------------
    const detailRes = await makeRequest(`${BASE_URL}/api/shipments/SHIP-001`);
    assert(detailRes.status === 200, 'GET /api/shipments/SHIP-001 returns status 200');
    assert(detailRes.data.id === 'SHIP-001', 'Correct shipment ID');
    assert(detailRes.data.currentStatus === 'ARRIVED_AT_PORT', 'Reconstructed status is ARRIVED_AT_PORT');
    assert(detailRes.data.location === 'Port of Hamburg', 'Reconstructed location is Port of Hamburg');
    assert(detailRes.data.temperature === 5.1, 'Reconstructed temperature is 5.1');
    assert(detailRes.data.version === 6, 'Reconstructed version is 6');

    // -------------------------------------------------------------
    // Test 3: State Scrubbing / Time Travel (GET /api/shipments/SHIP-001?asOf=...)
    // We want to query the state as of 3 days ago, which is before the temperature spike at version 4.
    // In our seed, version 3 has a timestamp of 3 days ago (daysAgo(3)).
    // Let's calculate the timestamp between daysAgo(3) and daysAgo(2) (e.g. 2.5 days ago)
    // -------------------------------------------------------------
    const baseDate = new Date();
    const twoAndHalfDaysAgo = new Date(baseDate.getTime() - 2.5 * 24 * 60 * 60 * 1000).toISOString();
    
    const timeTravelRes = await makeRequest(`${BASE_URL}/api/shipments/SHIP-001?asOf=${twoAndHalfDaysAgo}`);
    assert(timeTravelRes.status === 200, 'GET /api/shipments/SHIP-001?asOf=... returns status 200');
    assert(timeTravelRes.data.version === 3, 'Time travel query correctly scrubbed state to version 3');
    assert(timeTravelRes.data.currentStatus === 'IN_TRANSIT', 'State status at version 3 was IN_TRANSIT');
    assert(timeTravelRes.data.location.includes('Indian Ocean'), 'State location at version 3 was Indian Ocean');
    assert(timeTravelRes.data.temperature === 4.5, 'State temperature at version 3 was 4.5°C');

    // -------------------------------------------------------------
    // Test 4: Get Raw Immutable Event Log (GET /api/shipments/SHIP-001/events)
    // -------------------------------------------------------------
    const eventsRes = await makeRequest(`${BASE_URL}/api/shipments/SHIP-001/events`);
    assert(eventsRes.status === 200, 'GET /api/shipments/SHIP-001/events returns status 200');
    assert(eventsRes.data.events && eventsRes.data.events.length === 6, 'Returns exactly 6 events for SHIP-001');
    assert(eventsRes.data.events[0].eventType === 'CONTAINER_CREATED', 'First event type is CONTAINER_CREATED');
    assert(eventsRes.data.events[5].eventType === 'ARRIVED_AT_PORT', 'Last event type is ARRIVED_AT_PORT');

    // -------------------------------------------------------------
    // Test 5: Command with OCC Mismatch (Expect 409 Conflict)
    // Send command with expectedVersion = 5, when the current version is 6
    // -------------------------------------------------------------
    const conflictRes = await makeRequest(`${BASE_URL}/api/shipments/SHIP-001/commands`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'TEMPERATURE_UPDATE',
        payload: { temperature: 5.5 },
        expectedVersion: 5 // Mismatched version
      })
    });
    assert(conflictRes.status === 409, 'OCC mismatch returns status 409 Conflict');
    assert(conflictRes.data.error === 'VERSION_CONFLICT', 'Error message is VERSION_CONFLICT');
    assert(conflictRes.data.currentVersion === 6, 'Error returns the actual currentVersion (6)');

    // -------------------------------------------------------------
    // Test 6: Success Command with Correct OCC (Expect 201 Created)
    // Send command with expectedVersion = 6
    // -------------------------------------------------------------
    const successRes = await makeRequest(`${BASE_URL}/api/shipments/SHIP-001/commands`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'TEMPERATURE_UPDATE',
        payload: { temperature: 5.5 },
        expectedVersion: 6 // Correct version
      })
    });
    assert(successRes.status === 201, 'Correct OCC command returns status 201 Created');
    assert(successRes.data.version === 7, 'Newly created event is version 7');
    assert(successRes.data.eventType === 'TEMPERATURE_UPDATE', 'Event type is mapped and stored');

    // Verify Read Model updated immediately
    const updatedDetailRes = await makeRequest(`${BASE_URL}/api/shipments/SHIP-001`);
    assert(updatedDetailRes.data.version === 7, 'Read model immediately updated to version 7');
    assert(updatedDetailRes.data.temperature === 5.5, 'Read model shows new temperature 5.5');

    // -------------------------------------------------------------
    // Test 7: Immutability Audit (Block Update/Delete at Schema Level)
    // -------------------------------------------------------------
    console.log('Testing write-once EventStore immutability constraint...');
    const sampleEvent = await Event.findOne({ aggregateId: 'SHIP-001', version: 1 });
    
    // Attempt update
    let updateFailed = false;
    try {
      await Event.updateOne({ _id: sampleEvent._id }, { eventType: 'LOADED_ON_SHIP' });
    } catch (err) {
      updateFailed = true;
      assert(err.message.includes('forbidden') || err.message.includes('immutable'), `Direct update blocked: "${err.message}"`);
    }
    if (!updateFailed) {
      assert(false, 'Direct update succeeded on Event! Immutability broken!');
    }

    // Attempt delete
    let deleteFailed = false;
    try {
      await Event.deleteOne({ _id: sampleEvent._id });
    } catch (err) {
      deleteFailed = true;
      assert(err.message.includes('forbidden') || err.message.includes('immutable'), `Direct delete blocked: "${err.message}"`);
    }
    if (!deleteFailed) {
      assert(false, 'Direct delete succeeded on Event! Immutability broken!');
    }

  } catch (error) {
    console.error('Test script crashed:', error);
  } finally {
    // 2. Cleanup and Exit
    console.log('\n=== VERIFICATION RESULTS ===');
    console.log(`Passed: ${passedCount} / ${testCount} tests`);
    
    server.close(() => {
      console.log('Test server closed.');
      if (passedCount === testCount) {
        console.log('Verification completed successfully! All checks passed.');
        process.exit(0);
      } else {
        console.error('Verification failed. Correct implementation issues.');
        process.exit(1);
      }
    });
  }
}

// Ensure database connection is active before running tests
mongoose.connection.readyState === 1 ? runTests() : connectDB().then(runTests);
