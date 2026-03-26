const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true
  },
  category: {
    type: String,
    enum: ['food', 'transport', 'entertainment', 'bills', 'salary', 'shopping', 'health', 'education', 'other'],
    required: true
  },
  description: String,
  date: {
    type: Date,
    default: Date.now
  },
  recurring: {
    isRecurring: { type: Boolean, default: false },
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly', 'yearly'] }
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'card', 'upi', 'bank_transfer']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);