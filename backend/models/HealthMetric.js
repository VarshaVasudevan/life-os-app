const mongoose = require('mongoose');

const healthMetricSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  steps: { 
    type: Number, 
    min: 0, 
    default: 0 
  },
  sleep: {
    duration: { 
      type: Number, 
      min: 0, 
      default: 0 
    },
    quality: { 
      type: Number, 
      min: 1, 
      max: 10, 
      default: 5 
    }
  },
  mood: { 
    type: Number, 
    min: 1, 
    max: 10, 
    default: 5 
  },
  water: { 
    type: Number, 
    min: 0, 
    default: 0 
  },
  exercise: {
    duration: { 
      type: Number, 
      default: 0 
    },
    type: {
      type: String,
      default: ''
    },
    calories: { 
      type: Number, 
      default: 0 
    }
  },
  weight: {
    type: Number,
    default: null
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Create compound index for user and date to ensure one entry per day
healthMetricSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('HealthMetric', healthMetricSchema);