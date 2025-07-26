const express = require('express');
const router = express.Router();
const { authenticateToken: auth } = require('../middleware/auth');
const AIService = require('../services/aiService');

// General AI chat endpoint
router.post('/chat', auth, async (req, res) => {
  try {
    const { messages, portal = 'wellness', context = {} } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ message: 'Messages array is required' });
    }

    const userContext = {
      ...context,
      userId: req.user.id,
      userProfile: req.user.profile
    };

    const response = await AIService.generateChatResponse(messages, portal, userContext);

    res.json({
      response: response.content,
      metadata: response.metadata
    });

  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Health check for AI service
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'AI Service',
    timestamp: new Date().toISOString(),
    apiKeyConfigured: !!process.env.OPENAI_API_KEY
  });
});

module.exports = router;

