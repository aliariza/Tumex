const mongoose = require('mongoose')

const jobPositionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    department: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    locationType: {
      type: String,
      default: 'Ofis içi',
      trim: true
    },
    employmentType: {
      type: String,
      default: 'Tam zamanlı',
      trim: true
    },
    summary: {
      type: String,
      required: true,
      trim: true
    },
    highlights: {
      type: [String],
      default: []
    },
    applicationEmail: {
      type: String,
      default: 'info@tum-ex.com',
      trim: true
    },
    applicationSubject: {
      type: String,
      default: '',
      trim: true
    },
    sortOrder: {
      type: Number,
      default: 0,
      index: true
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('JobPosition', jobPositionSchema)
