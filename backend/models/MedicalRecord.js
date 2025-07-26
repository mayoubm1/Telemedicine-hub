const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['consultation', 'lab_result', 'prescription', 'diagnosis', 'symptom_check'],
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  symptoms: [String],
  diagnosis: String,
  treatment: String,
  medications: [{
    name: {
      type: String,
      required: true
    },
    dosage: String,
    frequency: String,
    duration: String,
    instructions: String
  }],
  attachments: [{
    filename: String,
    filepath: String,
    fileType: String,
    fileSize: Number,
    uploadDate: {
      type: Date,
      default: Date.now
    }
  }],
  aiAnalysis: {
    confidence: {
      type: Number,
      min: 0,
      max: 1
    },
    recommendations: [String],
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low'
    },
    followUpRequired: {
      type: Boolean,
      default: false
    },
    aiModel: String,
    processingTime: Number
  },
  vitals: {
    bloodPressure: {
      systolic: Number,
      diastolic: Number
    },
    heartRate: Number,
    temperature: Number,
    weight: Number,
    height: Number,
    bmi: Number
  },
  isPrivate: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'ongoing', 'archived'],
    default: 'active'
  },
  tags: [String],
  notes: String
}, {
  timestamps: true
});

// Indexes for better query performance
medicalRecordSchema.index({ patientId: 1, createdAt: -1 });
medicalRecordSchema.index({ doctorId: 1, createdAt: -1 });
medicalRecordSchema.index({ type: 1 });
medicalRecordSchema.index({ status: 1 });
medicalRecordSchema.index({ 'aiAnalysis.riskLevel': 1 });

// Calculate BMI if height and weight are provided
medicalRecordSchema.pre('save', function(next) {
  if (this.vitals && this.vitals.weight && this.vitals.height) {
    const heightInMeters = this.vitals.height / 100;
    this.vitals.bmi = this.vitals.weight / (heightInMeters * heightInMeters);
  }
  next();
});

// Virtual for formatted date
medicalRecordSchema.virtual('formattedDate').get(function() {
  return this.createdAt.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);

