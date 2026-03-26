const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const { protect } = require('../middleware/auth');

// Get all goals
router.get('/', protect, async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.userId }).sort('-createdAt');
    res.json(goals);
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create goal - FIXED VERSION
router.post('/', protect, async (req, res) => {
  try {
    console.log('Creating goal for user:', req.userId);
    console.log('Request body:', req.body);

    const { title, description, category, priority, deadline, milestones, tags } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    if (!category) {
      return res.status(400).json({ message: 'Category is required' });
    }

    // Create goal with only valid fields
    const goalData = {
      user: req.userId,
      title: title,
      description: description || '',
      category: category,
      priority: priority || 'medium',
      deadline: deadline || null,
      milestones: milestones || [],
      tags: tags || [],
      progress: 0,
      status: 'active'
    };

    console.log('Creating goal with data:', goalData);

    const goal = await Goal.create(goalData);
    
    console.log('Goal created successfully:', goal._id);
    res.status(201).json(goal);
  } catch (error) {
    console.error('Error creating goal:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: error.message || 'Failed to create goal',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update goal
router.put('/:id', protect, async (req, res) => {
  try {
    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.json(goal);
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete goal
router.delete('/:id', protect, async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    res.status(500).json({ message: error.message });
  }
});

// Update milestone
router.patch('/:id/milestones/:milestoneId', protect, async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, user: req.userId });
    if (!goal) {
      return res.status(404).json({ message: 'Goal not found' });
    }
    
    const milestone = goal.milestones.id(req.params.milestoneId);
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }
    
    milestone.completed = req.body.completed;
    await goal.save();
    res.json(goal);
  } catch (error) {
    console.error('Error updating milestone:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;