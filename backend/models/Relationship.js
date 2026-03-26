const mongoose = require('mongoose');

const relationshipSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add person name'],
    trim: true
  },
  type: {
    type: String,
    enum: ['family', 'friend', 'colleague', 'partner', 'mentor', 'other'],
    required: true,
    default: 'friend'
  },
  email: {
    type: String,
    default: ''
  },
  phone: {
    type: String,
    default: ''
  },
  birthday: {
    type: Date,
    default: null
  },
  anniversary: {
    type: Date,
    default: null
  },
  notes: {
    type: String,
    default: ''
  },
  importantDates: [{
    title: String,
    date: Date,
    reminder: { type: Boolean, default: false }
  }],
  interactions: [{
    date: { type: Date, default: Date.now },
    type: { type: String, enum: ['call', 'meet', 'message', 'gift', 'other'], default: 'other' },
    notes: { type: String, default: '' },
    mood: { type: Number, min: 1, max: 10, default: 5 }
  }],
  tags: [String],
  relationshipStrength: {
    type: Number,
    min: 1,
    max: 10,
    default: 5
  },
  lastContact: {
    type: Date,
    default: null
  },
  nextReminder: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// NO PRE-SAVE HOOK - Remove the entire pre-save function
// We'll handle lastContact update in the route instead

module.exports = mongoose.model('Relationship', relationshipSchema);