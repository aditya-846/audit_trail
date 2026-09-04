require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./src/config/db');
const Event = require('./src/models/EventStore');
const ShipmentReadModel = require('./src/models/ShipmentReadModel');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

const legacyUsers = [
  { email: "admin@auditflow.com", password: "Admin@123", role: "DISPATCHER" },
  { email: "manager@auditflow.com", password: "Manager@123", role: "DISPATCHER" },
  { email: "siri@gmail.com", password: "siri@2004", role: "TELEMETRY_BOT" },
  { email: "luthradeepali94@gmail.com", password: "39LE-.MNtZvRjGW", role: "AUDITOR" }
];

const seedData = async () => {
  try {
    // Connect to database
    await connectDB();

    console.log('Seeding past user accounts...');
    for (const u of legacyUsers) {
      const existing = await User.findOne({ email: u.email.toLowerCase() });
      if (!existing) {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(u.password, salt);
        await User.create({
          email: u.email.toLowerCase(),
          passwordHash,
          role: u.role
        });
        console.log(`Seeded user: ${u.email}`);
      }
    }

    console.log('Clearing database event_store and shipments_read_model collections...');
    
    // We cannot use standard mongoose model deletes directly if we blocked deleteMany pre-hook!
    // Let's drop the collections via the native MongoDB driver collection interface, 
    // which bypasses Mongoose schema-level middleware and ensures the seed script works perfectly.
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    if (collections.some(c => c.name === 'event_store')) {
      await db.collection('event_store').deleteMany({});
      console.log('Cleared event_store');
    }
    if (collections.some(c => c.name === 'shipments_read_model')) {
      await db.collection('shipments_read_model').deleteMany({});
      console.log('Cleared shipments_read_model');
    }

    console.log('Seeding SHIP-001 (Smart Cold-Chain Container #101)...');

    const baseDate = new Date();
    // Helper to get relative dates
    const daysAgo = (num) => new Date(baseDate.getTime() - num * 24 * 60 * 60 * 1000);

    const ship1Events = [
      {
        aggregateId: 'SHIP-001',
        eventType: 'CONTAINER_CREATED',
        payload: {
          origin: 'Port of Chennai',
          name: 'Smart Cold-Chain Container #101',
          temperature: 4.2,
          notes: 'Sensors calibrated and active'
        },
        timestamp: daysAgo(5),
        version: 1
      },
      {
        aggregateId: 'SHIP-001',
        eventType: 'LOADED_ON_SHIP',
        payload: {
          newLocation: 'Indian Ocean (Vessel: Ocean Explorer)',
          vesselName: 'Ocean Explorer',
          status: 'IN_TRANSIT'
        },
        timestamp: daysAgo(4),
        version: 2
      },
      {
        aggregateId: 'SHIP-001',
        eventType: 'TEMPERATURE_UPDATE',
        payload: {
          temperature: 4.5
        },
        timestamp: daysAgo(3),
        version: 3
      },
      {
        aggregateId: 'SHIP-001',
        eventType: 'TEMPERATURE_SPIKE',
        payload: {
          temperature: 9.8,
          threshold: 8.0,
          notes: 'Reefer power fluctuation warning'
        },
        timestamp: daysAgo(2),
        version: 4
      },
      {
        aggregateId: 'SHIP-001',
        eventType: 'TEMPERATURE_UPDATE',
        payload: {
          temperature: 5.1
        },
        timestamp: daysAgo(1),
        version: 5
      },
      {
        aggregateId: 'SHIP-001',
        eventType: 'ARRIVED_AT_PORT',
        payload: {
          newLocation: 'Port of Hamburg',
          status: 'ARRIVED_AT_PORT'
        },
        timestamp: baseDate,
        version: 6
      }
    ];

    // Bulk save via Mongoose (which bypasses pre('save') updates check since these are new documents with isNew = true)
    await Event.insertMany(ship1Events);
    console.log('Saved events for SHIP-001');

    console.log('Seeding SHIP-002 (Standard Cargo Container #204)...');
    const ship2Events = [
      {
        aggregateId: 'SHIP-002',
        eventType: 'CONTAINER_CREATED',
        payload: {
          origin: 'Shanghai Port',
          name: 'Standard Cargo Container #204',
          temperature: 18.2,
          notes: 'Standard dry van container check completed'
        },
        timestamp: daysAgo(3),
        version: 1
      },
      {
        aggregateId: 'SHIP-002',
        eventType: 'LOADED_ON_SHIP',
        payload: {
          newLocation: 'East China Sea (Vessel: Star Express)',
          vesselName: 'Star Express',
          status: 'IN_TRANSIT'
        },
        timestamp: daysAgo(2),
        version: 2
      }
    ];

    await Event.insertMany(ship2Events);
    console.log('Saved events for SHIP-002');

    // Run projections to initialize Read Models
    console.log('Running projection worker...');
    await updateProjection('SHIP-001');
    await updateProjection('SHIP-002');

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
