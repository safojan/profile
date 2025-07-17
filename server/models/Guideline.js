const mongoose = require('mongoose');

const guidelineSchema = new mongoose.Schema({
  trustName: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  medicalSpeciality: {
    type: String,
    required: true,
    enum: [
      'cardiology',
      'respiratory',
      'neurology',
      'oncology',
      'pediatrics',
      'emergency',
      'surgery',
      'psychiatry',
      'dermatology',
      'orthopedics',
      'radiology',
      'pathology',
      'anesthesiology',
      'general_medicine',
      'other'
    ],
  },
  url: {
    type: String, // S3 URL for PDFs
    trim: true,
  },
  content: {
    type: String, // For text-based guidelines
  },
  fileType: {
    type: String,
    enum: ['pdf', 'text'],
    required: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
});

// Indexes for better search performance
guidelineSchema.index({ trustName: 1 });
guidelineSchema.index({ medicalSpeciality: 1 });
guidelineSchema.index({ isActive: 1 });
guidelineSchema.index({ createdAt: -1 });
guidelineSchema.index({ updatedAt: -1 });

// Text index for search functionality
guidelineSchema.index({
  title: 'text',
  description: 'text',
  content: 'text',
  tags: 'text',
  trustName: 'text',
});

// Compound indexes for common queries
guidelineSchema.index({ trustName: 1, medicalSpeciality: 1 });
guidelineSchema.index({ isActive: 1, createdAt: -1 });

// Virtual for formatted specialty name
guidelineSchema.virtual('formattedSpeciality').get(function() {
  return this.medicalSpeciality.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
});

// Ensure virtuals are included in JSON output
guidelineSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Guideline', guidelineSchema);

