const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');

// Get transactions
router.get('/', protect, async (req, res) => {
  try {
    const { startDate, endDate, limit = 50 } = req.query;
    const query = { user: req.userId };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const transactions = await Transaction.find(query)
      .sort('-date')
      .limit(parseInt(limit));
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add transaction
router.post('/', protect, async (req, res) => {
  try {
    const transaction = await Transaction.create({
      ...req.body,
      user: req.userId
    });
    res.status(201).json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update transaction
router.put('/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete transaction
router.delete('/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });
    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get summary
router.get('/summary', protect, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const startDate = new Date();
    
    if (period === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (period === 'year') {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }
    
    const transactions = await Transaction.find({
      user: req.userId,
      date: { $gte: startDate }
    });
    
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const byCategory = {};
    transactions.forEach(t => {
      if (t.type === 'expense') {
        byCategory[t.category] = (byCategory[t.category] || 0) + t.amount;
      }
    });
    
    res.json({
      income,
      expenses,
      balance: income - expenses,
      savings: income - expenses,
      byCategory,
      totalTransactions: transactions.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;