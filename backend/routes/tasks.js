const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect } = require('../middleware/auth');

// Get all tasks
router.get('/', protect, async (req, res) => {
  try {
    const { status, priority, category } = req.query;
    const query = { user: req.userId };
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    
    const tasks = await Task.find(query).sort('-createdAt');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create task
router.post('/', protect, async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      user: req.userId
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update task
router.put('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete task
router.delete('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Toggle task completion
router.patch('/:id/toggle', protect, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    task.status = task.status === 'completed' ? 'pending' : 'completed';
    if (task.status === 'completed') {
      task.completedAt = new Date();
    } else {
      task.completedAt = null;
    }
    
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;