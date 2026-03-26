const express = require('express');
const router = express.Router();
const Relationship = require('../models/Relationship');
const { protect } = require('../middleware/auth');

// Get all relationships
router.get('/', protect, async (req, res) => {
  try {
    const relationships = await Relationship.find({ user: req.userId })
      .sort('-relationshipStrength');
    res.json(relationships);
  } catch (error) {
    console.error('Error fetching relationships:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add relationship
router.post('/', protect, async (req, res) => {
  try {
    console.log('Creating relationship for user:', req.userId);
    console.log('Request body:', req.body);

    const { name, type, email, phone, birthday, anniversary, notes } = req.body;

    // Validate required fields
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    if (!type) {
      return res.status(400).json({ message: 'Relationship type is required' });
    }

    // Prepare data
    const relationshipData = {
      user: req.userId,
      name: name.trim(),
      type: type,
      email: email || '',
      phone: phone || '',
      notes: notes || '',
      interactions: [],
      importantDates: [],
      tags: [],
      relationshipStrength: 5,
      lastContact: null
    };

    // Add birthday if provided
    if (birthday) {
      relationshipData.birthday = new Date(birthday);
    }

    // Add anniversary if provided
    if (anniversary) {
      relationshipData.anniversary = new Date(anniversary);
    }

    console.log('Creating relationship with data:', relationshipData);

    const relationship = await Relationship.create(relationshipData);
    console.log('Relationship created successfully:', relationship._id);
    
    res.status(201).json(relationship);
  } catch (error) {
    console.error('Error creating relationship:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      message: error.message || 'Failed to create relationship'
    });
  }
});

// Update relationship
router.put('/:id', protect, async (req, res) => {
  try {
    const relationship = await Relationship.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!relationship) {
      return res.status(404).json({ message: 'Relationship not found' });
    }
    
    res.json(relationship);
  } catch (error) {
    console.error('Error updating relationship:', error);
    res.status(500).json({ message: error.message });
  }
});

// Delete relationship
router.delete('/:id', protect, async (req, res) => {
  try {
    const relationship = await Relationship.findOneAndDelete({
      _id: req.params.id,
      user: req.userId
    });
    
    if (!relationship) {
      return res.status(404).json({ message: 'Relationship not found' });
    }
    
    res.json({ message: 'Relationship deleted successfully' });
  } catch (error) {
    console.error('Error deleting relationship:', error);
    res.status(500).json({ message: error.message });
  }
});

// Add interaction - FIXED with lastContact update
router.post('/:id/interactions', protect, async (req, res) => {
  try {
    console.log('Adding interaction for relationship:', req.params.id);
    console.log('Interaction data:', req.body);
    
    const relationship = await Relationship.findOne({
      _id: req.params.id,
      user: req.userId
    });
    
    if (!relationship) {
      return res.status(404).json({ message: 'Relationship not found' });
    }
    
    const interactionData = {
      date: new Date(),
      type: req.body.type || 'other',
      notes: req.body.notes || '',
      mood: req.body.mood ? parseInt(req.body.mood) : 5
    };
    
    relationship.interactions.push(interactionData);
    
    // Update lastContact
    relationship.lastContact = interactionData.date;
    
    // Update relationship strength based on interactions
    const interactionCount = relationship.interactions.length;
    if (interactionCount > 10) {
      relationship.relationshipStrength = Math.min(10, relationship.relationshipStrength + 1);
    } else if (interactionCount > 5) {
      relationship.relationshipStrength = Math.min(10, relationship.relationshipStrength + 0.5);
    }
    
    await relationship.save();
    console.log('Interaction added successfully');
    res.json(relationship);
  } catch (error) {
    console.error('Error adding interaction:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get upcoming important dates
router.get('/upcoming', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const next30Days = new Date(today);
    next30Days.setDate(today.getDate() + 30);
    
    const relationships = await Relationship.find({ user: req.userId });
    const upcoming = [];
    
    relationships.forEach(rel => {
      // Check birthday
      if (rel.birthday) {
        const birthdayDate = new Date(rel.birthday);
        const birthdayThisYear = new Date(today.getFullYear(), birthdayDate.getMonth(), birthdayDate.getDate());
        
        if (birthdayThisYear >= today && birthdayThisYear <= next30Days) {
          upcoming.push({
            type: 'birthday',
            person: rel.name,
            date: birthdayThisYear,
            daysUntil: Math.ceil((birthdayThisYear - today) / (1000 * 60 * 60 * 24))
          });
        }
      }
      
      // Check anniversary
      if (rel.anniversary) {
        const anniversaryDate = new Date(rel.anniversary);
        const anniversaryThisYear = new Date(today.getFullYear(), anniversaryDate.getMonth(), anniversaryDate.getDate());
        
        if (anniversaryThisYear >= today && anniversaryThisYear <= next30Days) {
          upcoming.push({
            type: 'anniversary',
            person: rel.name,
            date: anniversaryThisYear,
            daysUntil: Math.ceil((anniversaryThisYear - today) / (1000 * 60 * 60 * 24))
          });
        }
      }
      
      // Check important dates
      if (rel.importantDates && rel.importantDates.length > 0) {
        rel.importantDates.forEach(date => {
          const importantDate = new Date(date.date);
          const dateThisYear = new Date(today.getFullYear(), importantDate.getMonth(), importantDate.getDate());
          
          if (dateThisYear >= today && dateThisYear <= next30Days) {
            upcoming.push({
              type: 'custom',
              title: date.title,
              person: rel.name,
              date: dateThisYear,
              daysUntil: Math.ceil((dateThisYear - today) / (1000 * 60 * 60 * 24))
            });
          }
        });
      }
    });
    
    // Sort by date
    upcoming.sort((a, b) => a.date - b.date);
    res.json(upcoming);
  } catch (error) {
    console.error('Error getting upcoming dates:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;