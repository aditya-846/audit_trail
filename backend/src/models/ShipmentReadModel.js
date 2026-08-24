const mongoose = require('mongoose');

const ShipmentReadModelSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  currentStatus: {
    type: String,
    required: true
  },
  location: {
    type: String,
    default: 'UNKNOWN'
  },
  temperature: {
    type: Number,
    default: null
  },
  version: {
    type: Number,
    required: true
  },
  lastUpdated: {
    type: Date,
    required: true
  }
});

// Support searching shipments by id or name
ShipmentReadModelSchema.index({ id: 'text', name: 'text' });

module.exports = mongoose.model('ShipmentReadModel', ShipmentReadModelSchema, 'shipments_read_model');
