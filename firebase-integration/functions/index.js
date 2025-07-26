const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

// Initialize Firebase Admin
admin.initializeApp();

// Create Express app
const app = express();

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration
app.use(cors({
  origin: true, // Allow all origins for Firebase hosting
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Import routes
const authRoutes = require('./src/routes/auth');
const wellnessRoutes = require('./src/routes/wellness');
const assistRoutes = require('./src/routes/assist');
const aiRoutes = require('./src/routes/ai');
const patientAssistRoutes = require('./src/routes/patientAssist');
const videoRoutes = require('./src/routes/video');
const analyticsRoutes = require('./src/routes/analytics');
const audioRoutes = require('./src/routes/audio');

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/wellness', wellnessRoutes);
app.use('/api/assist', assistRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/patient-assist', patientAssistRoutes);
app.use('/api/video', videoRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/audio', audioRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    firebase: true
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// Export the Express app as a Firebase Function
exports.api = functions.https.onRequest(app);

// Background functions for AI processing
exports.processAIResponse = functions.firestore
  .document('conversations/{conversationId}')
  .onWrite(async (change, context) => {
    const conversationId = context.params.conversationId;
    
    if (!change.after.exists) {
      return null; // Document was deleted
    }
    
    const conversation = change.after.data();
    const previousConversation = change.before.exists ? change.before.data() : null;
    
    // Check if new messages were added
    const newMessagesCount = conversation.messages?.length || 0;
    const previousMessagesCount = previousConversation?.messages?.length || 0;
    
    if (newMessagesCount > previousMessagesCount) {
      // Process new messages for analytics
      const newMessages = conversation.messages.slice(previousMessagesCount);
      
      for (const message of newMessages) {
        if (message.role === 'assistant' && message.metadata) {
          // Log AI response metrics
          await admin.firestore().collection('analytics').add({
            type: 'ai_response',
            conversationId,
            portal: conversation.portal,
            confidence: message.metadata.confidence,
            tokens: message.metadata.tokens,
            processingTime: message.metadata.processingTime,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
          });
        }
      }
    }
    
    return null;
  });

// Scheduled function to clean up old conversations
exports.cleanupOldConversations = functions.pubsub
  .schedule('0 2 * * *') // Run daily at 2 AM
  .timeZone('Africa/Cairo')
  .onRun(async (context) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const oldConversations = await admin.firestore()
      .collection('conversations')
      .where('updatedAt', '<', thirtyDaysAgo)
      .where('isActive', '==', false)
      .get();
    
    const batch = admin.firestore().batch();
    
    oldConversations.docs.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    await batch.commit();
    
    console.log(`Cleaned up ${oldConversations.size} old conversations`);
    
    return null;
  });

// Function to generate daily analytics reports
exports.generateDailyAnalytics = functions.pubsub
  .schedule('0 1 * * *') // Run daily at 1 AM
  .timeZone('Africa/Cairo')
  .onRun(async (context) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    
    const today = new Date(yesterday);
    today.setDate(today.getDate() + 1);
    
    // Get analytics data for yesterday
    const analyticsSnapshot = await admin.firestore()
      .collection('analytics')
      .where('timestamp', '>=', yesterday)
      .where('timestamp', '<', today)
      .get();
    
    const analytics = analyticsSnapshot.docs.map(doc => doc.data());
    
    // Calculate metrics
    const aiResponses = analytics.filter(a => a.type === 'ai_response');
    const avgConfidence = aiResponses.reduce((sum, a) => sum + (a.confidence || 0), 0) / aiResponses.length;
    const avgProcessingTime = aiResponses.reduce((sum, a) => sum + (a.processingTime || 0), 0) / aiResponses.length;
    const totalTokens = aiResponses.reduce((sum, a) => sum + (a.tokens || 0), 0);
    
    // Store daily report
    await admin.firestore().collection('daily_reports').add({
      date: yesterday,
      metrics: {
        totalAIResponses: aiResponses.length,
        averageConfidence: avgConfidence || 0,
        averageProcessingTime: avgProcessingTime || 0,
        totalTokensUsed: totalTokens,
        wellnessPortalUsage: aiResponses.filter(a => a.portal === 'wellness').length,
        assistPortalUsage: aiResponses.filter(a => a.portal === 'assist').length
      },
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`Generated daily analytics report for ${yesterday.toDateString()}`);
    
    return null;
  });

// Function to handle user authentication events
exports.onUserCreate = functions.auth.user().onCreate(async (user) => {
  // Create user profile in Firestore
  await admin.firestore().collection('users').doc(user.uid).set({
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    role: 'patient', // Default role
    isActive: true,
    profile: {
      firstName: '',
      lastName: '',
      phone: '',
      dateOfBirth: null,
      gender: '',
      medicalHistory: []
    },
    preferences: {
      language: 'ar',
      notifications: true,
      theme: 'light'
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
  
  console.log(`Created user profile for ${user.email}`);
  
  return null;
});

// Function to handle user deletion
exports.onUserDelete = functions.auth.user().onDelete(async (user) => {
  // Clean up user data
  const batch = admin.firestore().batch();
  
  // Delete user profile
  batch.delete(admin.firestore().collection('users').doc(user.uid));
  
  // Delete user conversations
  const conversations = await admin.firestore()
    .collection('conversations')
    .where('userId', '==', user.uid)
    .get();
  
  conversations.docs.forEach(doc => {
    batch.delete(doc.ref);
  });
  
  await batch.commit();
  
  console.log(`Cleaned up data for deleted user ${user.email}`);
  
  return null;
});

// Function to send notifications
exports.sendNotification = functions.firestore
  .document('notifications/{notificationId}')
  .onCreate(async (snap, context) => {
    const notification = snap.data();
    
    if (notification.type === 'appointment_reminder') {
      // Send appointment reminder (implement push notification logic)
      console.log(`Sending appointment reminder to ${notification.userId}`);
    } else if (notification.type === 'ai_response_ready') {
      // Notify user that AI response is ready
      console.log(`AI response ready for ${notification.userId}`);
    }
    
    return null;
  });

