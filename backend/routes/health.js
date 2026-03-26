const express = require('express');
const router = express.Router();
const HealthMetric = require('../models/HealthMetric');
const { protect } = require('../middleware/auth');

// Get health metrics
router.get('/', protect, async (req, res) => {
  try {
    const { startDate, endDate, limit = 30 } = req.query;
    const query = { user: req.userId };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const metrics = await HealthMetric.find(query)
      .sort('-date')
      .limit(parseInt(limit));
    res.json(metrics);
  } catch (error) {
    console.error('Error fetching health metrics:', error);
    res.status(500).json({ message: error.message });
  }
});

// Log health metric - FIXED VERSION
router.post('/', protect, async (req, res) => {
  try {
    console.log('Creating health metric for user:', req.userId);
    console.log('Request body:', req.body);

    // Get today's date at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if metric already exists for today
    let metric = await HealthMetric.findOne({
      user: req.userId,
      date: { $gte: today, $lt: tomorrow }
    });
    
    // Prepare data
    const healthData = {
      steps: req.body.steps || 0,
      sleep: {
        duration: req.body.sleep?.duration || 0,
        quality: req.body.sleep?.quality || 5
      },
      mood: req.body.mood || 5,
      water: req.body.water || 0,
      exercise: {
        duration: req.body.exercise?.duration || 0,
        type: req.body.exercise?.type || '',
        calories: req.body.exercise?.calories || 0
      },
      notes: req.body.notes || ''
    };

    if (req.body.weight) healthData.weight = req.body.weight;

    if (metric) {
      // Update existing
      console.log('Updating existing health metric:', metric._id);
      Object.assign(metric, healthData);
      await metric.save();
      console.log('Health metric updated successfully');
    } else {
      // Create new
      console.log('Creating new health metric');
      metric = await HealthMetric.create({
        ...healthData,
        user: req.userId,
        date: new Date()
      });
      console.log('Health metric created successfully:', metric._id);
    }
    
    res.json(metric);
  } catch (error) {
    console.error('Error saving health metric:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: error.message || 'Failed to save health data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get health insights
router.get('/insights', protect, async (req, res) => {
  try {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const metrics = await HealthMetric.find({
      user: req.userId,
      date: { $gte: lastWeek }
    });
    
    if (metrics.length === 0) {
      return res.json({
        averageSteps: 0,
        averageMood: 0,
        averageSleep: 0,
        consistency: 0,
        trend: 'no_data',
        recommendations: ['Start logging your health data to get insights']
      });
    }
    
    const avgSteps = metrics.reduce((sum, m) => sum + (m.steps || 0), 0) / metrics.length;
    const avgMood = metrics.reduce((sum, m) => sum + (m.mood || 0), 0) / metrics.length;
    const avgSleep = metrics.reduce((sum, m) => sum + (m.sleep?.duration || 0), 0) / metrics.length;
    
    res.json({
      averageSteps: Math.round(avgSteps),
      averageMood: Math.round(avgMood * 10) / 10,
      averageSleep: Math.round(avgSleep * 10) / 10,
      consistency: metrics.length,
      trend: metrics.length >= 5 ? 'improving' : 'building',
      recommendations: []
    });
  } catch (error) {
    console.error('Error getting health insights:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;