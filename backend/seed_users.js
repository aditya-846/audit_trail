require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./src/config/db');
const User = require('./src/models/User');

const legacyUsers = [
  {
    name: "Admin User",
    email: "admin@auditflow.com",
    password: "Admin@123",
    role: "DISPATCHER"
  },
  {
    name: "Audit Manager",
    email: "manager@auditflow.com",
    password: "Manager@123",
    role: "DISPATCHER"
  },
  {
    name: "Galidinne Venkata Sireesha",
    email: "siri@gmail.com",
    password: "siri@2004",
    role: "TELEMETRY_BOT"
  },
  {
    name: "Deepali Luthra",
    email: "luthradeepali94@gmail.com",
    password: "39LE-.MNtZvRjGW",
    role: "AUDITOR"
  }
];

const seedUsers = async () => {
  try {
    await connectDB();
    console.log('Connected to Atlas. Seeding past user accounts...');

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
        console.log(`Created user: ${u.email} (${u.role})`);
      } else {
        console.log(`User already exists: ${u.email}`);
      }
    }

    console.log('\nAll past user accounts successfully seeded in MongoDB Atlas!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding past user accounts:', error);
    process.exit(1);
  }
};

seedUsers();
