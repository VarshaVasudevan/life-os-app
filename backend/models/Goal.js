const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a goal title'],
    trim: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  category: {
    type: String,
    enum: ['career', 'health', 'finance', 'relationships', 'personal', 'education'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  milestones: [{
    title: String,
    completed: { type: Boolean, default: false },
    deadline: Date
  }],
  deadline: {
    type: Date,
    default: null
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'archived', 'failed'],
    default: 'active'
  },
  completedAt: {
    type: Date,
    default: null
  },
  tags: [String]
}, {
  timestamps: true
});

// NO PRE-SAVE HOOK - Remove the entire pre-save function

module.exports = mongoose.model('Goal', goalSchema);