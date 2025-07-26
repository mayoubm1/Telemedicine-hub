const express = require('express');
const router = express.Router();
const { authenticateToken: auth } = require('../middleware/auth');
const AIService = require('../services/aiService');
const Conversation = require('../models/Conversation');

// Generate differential diagnosis
router.post('/diagnosis', auth, async (req, res) => {
  try {
    const { caseDescription, patientData } = req.body;
    const userId = req.user.id;

    if (!caseDescription) {
      return res.status(400).json({ message: 'Case description is required' });
    }

    const diagnosis = await AIService.generateDifferentialDiagnosis(caseDescription, patientData);

    // Create conversation record
    const conversation = new Conversation({
      userId,
      sessionId: `diagnosis-${userId}-${Date.now()}`,
      portal: 'assist',
      title: `Differential Diagnosis: ${caseDescription.substring(0, 50)}...`,
      context: {
        patientAge: patientData?.age,
        patientGender: patientData?.gender,
        relevantConditions: diagnosis.diagnoses
      }
    });

    await conversation.addMessage('user', `Case: ${caseDescription}\nPatient Data: ${JSON.stringify(patientData)}`);
    await conversation.addMessage('assistant', diagnosis.content, diagnosis.metadata);

    res.json({
      diagnosis: diagnosis.content,
      diagnoses: diagnosis.diagnoses,
      icdCodes: diagnosis.icdCodes,
      conversationId: conversation._id,
      metadata: diagnosis.metadata
    });

  } catch (error) {
    console.error('Diagnosis error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Search medical knowledge
router.post('/research', auth, async (req, res) => {
  try {
    const { query, specialty } = req.body;
    const userId = req.user.id;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const knowledge = await AIService.searchMedicalKnowledge(query, specialty);

    // Create conversation record
    const conversation = new Conversation({
      userId,
      sessionId: `research-${userId}-${Date.now()}`,
      portal: 'assist',
      title: `Research: ${query}`,
      context: {
        specialty: specialty
      }
    });

    await conversation.addMessage('user', `Research query: ${query}${specialty ? ` (Specialty: ${specialty})` : ''}`);
    await conversation.addMessage('assistant', knowledge.content, knowledge.metadata);

    res.json({
      knowledge: knowledge.content,
      conversationId: conversation._id,
      metadata: knowledge.metadata
    });

  } catch (error) {
    console.error('Research error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Chat with clinical AI
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
        sessionId: `assist-${userId}-${Date.now()}`,
        portal: 'assist',
        title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        context: {
          specialty: req.user.profile?.specialization
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
      'assist',
      {
        specialization: req.user.profile?.specialization,
        experience: req.user.profile?.experience
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
    console.error('Assist chat error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get patient queries for review
router.get('/patient-queries', auth, async (req, res) => {
  try {
    const { status = 'pending_review', page = 1, limit = 10 } = req.query;

    // Get conversations from patient_assist portal that need review
    const conversations = await Conversation.find({
      portal: 'patient_assist',
      'messages.metadata.needsReview': true
    })
    .populate('userId', 'email profile.firstName profile.lastName')
    .sort({ updatedAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await Conversation.countDocuments({
      portal: 'patient_assist',
      'messages.metadata.needsReview': true
    });

    res.json({
      conversations,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get patient queries error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Approve/reject patient AI response
router.post('/patient-queries/:id/review', auth, async (req, res) => {
  try {
    const conversationId = req.params.id;
    const { action, feedback } = req.body; // action: 'approve' or 'reject'

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Action must be approve or reject' });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // Update the last AI message metadata
    const lastMessage = conversation.messages[conversation.messages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant') {
      lastMessage.metadata.reviewStatus = action;
      lastMessage.metadata.reviewedBy = req.user.id;
      lastMessage.metadata.reviewedAt = new Date();
      lastMessage.metadata.reviewFeedback = feedback;
      lastMessage.metadata.needsReview = false;
    }

    await conversation.save();

    res.json({ message: `Response ${action}d successfully` });

  } catch (error) {
    console.error('Review patient query error:', error);
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
      portal: 'assist'
    })
    .sort({ updatedAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit)
    .select('title createdAt updatedAt messageCount isActive context');

    const total = await Conversation.countDocuments({
      userId,
      portal: 'assist'
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
      portal: 'assist'
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

module.exports = router;

