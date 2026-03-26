const express = require('express');
const router = express.Router();
const Goal = require('../models/Goal');
const HealthMetric = require('../models/HealthMetric');
const Transaction = require('../models/Transaction');
const Task = require('../models/Task');
const Relationship = require('../models/Relationship');
const { protect } = require('../middleware/auth');

router.get('/', protect, async (req, res) => {
  try {
    // Get all data for insights
    const goals = await Goal.find({ user: req.userId });
    const health = await HealthMetric.find({ user: req.userId }).sort('-date').limit(30);
    const tasks = await Task.find({ user: req.userId });
    const relationships = await Relationship.find({ user: req.userId });
    const transactions = await Transaction.find({ user: req.userId }).sort('-date').limit(50);
    
    const insights = [];
    
    // Goal insights
    const activeGoals = goals.filter(g => g.status === 'active');
    const completedGoals = goals.filter(g => g.status === 'completed');
    const stalledGoals = goals.filter(g => 
      g.status === 'active' && 
      g.progress === 0 && 
      (new Date() - new Date(g.createdAt)) > 7 * 24 * 60 * 60 * 1000
    );
    
    if (stalledGoals.length > 0) {
      insights.push({
        type: 'warning',
        category: 'goals',
        title: 'Stalled Goals Detected',
        message: `You have ${stalledGoals.length} goal(s) with no progress for over a week.`,
        action: 'Review your goals and break them down into smaller milestones.',
        icon: '🎯'
      });
    }
    
    if (completedGoals.length > 0) {
      insights.push({
        type: 'success',
        category: 'goals',
        title: 'Goal Achievement',
        message: `Congratulations! You've completed ${completedGoals.length} goal(s).`,
        action: 'Celebrate your wins and set new challenges!',
        icon: '🏆'
      });
    }
    
    // Health insights
    if (health.length >= 7) {
      const lastWeek = health.slice(0, 7);
      const avgMood = lastWeek.reduce((sum, h) => sum + h.mood, 0) / 7;
      const avgSteps = lastWeek.reduce((sum, h) => sum + h.steps, 0) / 7;
      const avgSleep = lastWeek.reduce((sum, h) => sum + (h.sleep?.duration || 0), 0) / 7;
      
      if (avgMood < 5) {
        insights.push({
          type: 'warning',
          category: 'health',
          title: 'Mood Alert',
          message: 'Your average mood has been below 5 this week. Consider activities that boost your wellbeing.',
          action: 'Try meditation, exercise, or talking to someone you trust.',
          icon: '😔'
        });
      }
      
      if (avgSteps < 5000) {
        insights.push({
          type: 'info',
          category: 'health',
          title: 'Low Activity',
          message: 'You\'re averaging less than 5,000 steps per day.',
          action: 'Aim for 7,500-10,000 steps for optimal health benefits.',
          icon: '👟'
        });
      }
    }
    
    // Task insights
    const pendingTasks = tasks.filter(t => t.status === 'pending' && t.dueDate);
    const overdueTasks = pendingTasks.filter(t => new Date(t.dueDate) < new Date());
    
    if (overdueTasks.length > 0) {
      insights.push({
        type: 'urgent',
        category: 'tasks',
        title: 'Overdue Tasks',
        message: `You have ${overdueTasks.length} overdue task(s).`,
        action: 'Review and prioritize your pending tasks.',
        icon: '⏰'
      });
    }
    
    // Relationship insights
    const recentInteractions = relationships.filter(r => {
      if (!r.lastContact) return false;
      const daysSince = (new Date() - new Date(r.lastContact)) / (1000 * 60 * 60 * 24);
      return daysSince > 30;
    });
    
    if (recentInteractions.length > 0) {
      insights.push({
        type: 'info',
        category: 'relationships',
        title: 'Reconnect with People',
        message: `You haven't contacted ${recentInteractions.length} person(s) in over a month.`,
        action: 'Reach out and nurture your important relationships.',
        icon: '💝'
      });
    }
    
    // Financial insights
    const monthlyExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    const monthlyIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    
    if (monthlyExpenses > monthlyIncome) {
      insights.push({
        type: 'warning',
        category: 'finance',
        title: 'Spending Alert',
        message: 'Your expenses exceed your income. Review your spending habits.',
        action: 'Create a budget and track unnecessary expenses.',
        icon: '💰'
      });
    }
    
    // Limit to 5 insights
    insights.slice(0, 5);
    
    res.json(insights);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;