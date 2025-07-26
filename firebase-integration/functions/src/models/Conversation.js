const mongoose = require('mongoose');

const conversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  portal: {
    type: String,
    enum: ["wellness", "assist", "patient_assist"],
    required: true
  },
  title: {
    type: String,
    default: 'New Conversation'
  },
  messages: [{
    role: {
      type: String,
      enum: ['user', 'assistant', 'system'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    metadata: {
      confidence: Number,
      sources: [String],
      processingTime: Number,
      tokens: Number,
      model: String
    }
  }],
  context: {
    medicalHistory: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MedicalRecord'
    }],
    currentSymptoms: [String],
    urgencyLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'emergency'],
      default: 'low'
    },
    patientAge: Number,
    patientGender: String,
    relevantConditions: [String]
  },
  summary: String,
  recommendations: [String],
  followUpActions: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  feedback: String,
  tags: [String],
  language: {
    type: String,
    enum: ['ar', 'en'],
    default: 'ar'
  }
}, {
  timestamps: true
});

// Indexes for better query performance
conversationSchema.index({ userId: 1, createdAt: -1 });
conversationSchema.index({ sessionId: 1 });
conversationSchema.index({ portal: 1 });
conversationSchema.index({ isActive: 1 });
conversationSchema.index({ 'context.urgencyLevel': 1 });

// Virtual for message count
conversationSchema.virtual('messageCount').get(function() {
  return this.messages.length;
});

// Virtual for last message
conversationSchema.virtual('lastMessage').get(function() {
  return this.messages[this.messages.length - 1];
});

// Method to add message
conversationSchema.methods.addMessage = function(role, content, metadata = {}) {
  this.messages.push({
    role,
    content,
    metadata,
    timestamp: new Date()
  });
  
  // Update title based on first user message
  if (role === 'user' && this.messages.length === 1) {
    this.title = content.substring(0, 50) + (content.length > 50 ? '...' : '');
  }
  
  return this.save();
};

// Method to update context
conversationSchema.methods.updateContext = function(contextUpdate) {
  this.context = { ...this.context, ...contextUpdate };
  return this.save();
};

// Method to end conversation
conversationSchema.methods.endConversation = function(summary, recommendations = []) {
  this.isActive = false;
  this.summary = summary;
  this.recommendations = recommendations;
  return this.save();
};

module.exports = mongoose.model('Conversation', conversationSchema);

