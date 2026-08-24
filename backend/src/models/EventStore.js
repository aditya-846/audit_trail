const mongoose = require('mongoose');

const EventStoreSchema = new mongoose.Schema({
  aggregateId: {
    type: String,
    required: true,
    index: true,
  },
  eventType: {
    type: String,
    required: true,
    enum: [
      'CONTAINER_CREATED',
      'LOADED_ON_SHIP',
      'TEMPERATURE_SPIKE',
      'TEMPERATURE_UPDATE',
      'ARRIVED_AT_PORT'
    ]
  },
  payload: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
    index: true,
  },
  version: {
    type: Number,
    required: true,
  }
});

// OCC uniqueness check: unique constraint on aggregateId + version
// Each aggregate can only have a single event per version number.
EventStoreSchema.index({ aggregateId: 1, version: 1 }, { unique: true });

// Strict immutability hooks
const blockMutations = function(next) {
  next(new Error('EventStore is immutable. Update and delete operations are forbidden.'));
};

// Hook into all query-based update, replace, and delete middlewares
EventStoreSchema.pre('updateOne', blockMutations);
EventStoreSchema.pre('updateMany', blockMutations);
EventStoreSchema.pre('deleteOne', blockMutations);
EventStoreSchema.pre('deleteMany', blockMutations);
EventStoreSchema.pre('findOneAndDelete', blockMutations);
EventStoreSchema.pre('findOneAndUpdate', blockMutations);
EventStoreSchema.pre('replaceOne', blockMutations);
EventStoreSchema.pre('findOneAndReplace', blockMutations);
EventStoreSchema.pre('remove', blockMutations);

// Prevent updating existing documents through .save()
EventStoreSchema.pre('save', function(next) {
  if (!this.isNew) {
    return next(new Error('EventStore is immutable. Update operations are forbidden.'));
  }
  next();
});

module.exports = mongoose.model('Event', EventStoreSchema, 'event_store');
