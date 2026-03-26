const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a task title'],
    trim: true
  },
  description: String,
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'archived'],
    default: 'pending'
  },
  dueDate: Date,
  category: {
    type: String,
    enum: ['work', 'personal', 'health', 'finance', 'relationships', 'other']
  },
  tags: [String],
  subtasks: [{
    title: String,
    completed: { type: Boolean, default: false }
  }],
  completedAt: Date,
  reminder: {
    enabled: { type: Boolean, default: false },
    time: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);