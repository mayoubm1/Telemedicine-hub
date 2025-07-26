const express = require('express');
const router = express.Router();
const { authenticateToken: auth } = require('../middleware/auth');
const AIService = require('../services/aiService');
const Conversation = require('../models/Conversation');

// Chat with AI assistant
router.post('/chat', auth, async (req, res) => {
  try {
    const { message, conversationId } = req.body;
    const userId = req.user.id;

    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    // Find or create conversation
    let conversation;
    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
      if (!conversation || conversation.userId.toString() !== userId) {
        return res.status(404).json({ message: 'Conversation not found' });
      }
    } else {
      conversation = new Conversation({
        userId,
        sessionId: `wellness-${userId}-${Date.now()}`,
        portal: 'wellness',
        title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        context: {
          patientAge: req.user.profile?.age,
          patientGender: req.user.profile?.gender
        }
      });
      await conversation.save();
    }

    // Add user message
    await conversation.addMessage('user', message);

    // Get AI response
    const messages = conversation.messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const aiResponse = await AIService.generateChatResponse(
      messages,
      'wellness',
      {
        age: req.user.profile?.age,
        gender: req.user.profile?.gender,
        medicalHistory: req.user.profile?.medicalHistory
      }
    );

    // Add AI response
    await conversation.addMessage('assistant', aiResponse.content, aiResponse.metadata);

    res.json({
      response: aiResponse.content,
      conversationId: conversation._id,
      metadata: aiResponse.metadata
    });

  } catch (error) {
    console.error('Wellness chat error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Analyze symptoms
router.post('/analyze-symptoms', auth, async (req, res) => {
  try {
    const { symptoms } = req.body;
    const userId = req.user.id;

    if (!symptoms || !Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ message: 'Symptoms array is required' });
    }

    const patientInfo = {
      age: req.user.profile?.age,
      gender: req.user.profile?.gender,
      medicalHistory: req.user.profile?.medicalHistory
    };

    const analysis = await AIService.analyzeSymptoms(symptoms, patientInfo);

    // Create conversation record
    const conversation = new Conversation({
      userId,
      sessionId: `symptom-analysis-${userId}-${Date.now()}`,
      portal: 'wellness',
      title: `Symptom Analysis: ${symptoms.join(', ')}`,
      context: {
        currentSymptoms: symptoms,
        urgencyLevel: analysis.urgencyLevel,
        patientAge: patientInfo.age,
        patientGender: patientInfo.gender
      }
    });

    await conversation.addMessage('user', `I'm experiencing: ${symptoms.join(', ')}`);
    await conversation.addMessage('assistant', analysis.content, analysis.metadata);

    res.json({
      analysis: analysis.content,
      urgencyLevel: analysis.urgencyLevel,
      recommendations: analysis.recommendations,
      conversationId: conversation._id,
      metadata: analysis.metadata
    });

  } catch (error) {
    console.error('Symptom analysis error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get conversation history
router.get('/conversations', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const conversations = await Conversation.find({
      userId,
      portal: 'wellness'
    })
    .sort({ updatedAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .select('title createdAt updatedAt messageCount isActive context.urgencyLevel');

    const total = await Conversation.countDocuments({
      userId,
      portal: 'wellness'
    });

    res.json({
      conversations,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get specific conversation
router.get('/conversations/:id', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const conversationId = req.params.id;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId,
      portal: 'wellness'
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    res.json(conversation);

  } catch (error) {
    console.error('Get conversation error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Rate conversation
router.post('/conversations/:id/rate', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const conversationId = req.params.id;
    const { rating, feedback } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId,
      portal: 'wellness'
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    conversation.rating = rating;
    if (feedback) {
      conversation.feedback = feedback;
    }

    await conversation.save();

    res.json({ message: 'Rating saved successfully' });

  } catch (error) {
    console.error('Rate conversation error:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

