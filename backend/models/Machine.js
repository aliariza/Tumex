const mongoose = require('mongoose')

const specSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true
    },
    label: {
      type: String,
      required: true,
      trim: true
    },
    value: {
      type: String,
      default: ''
    },
    order: {
      type: Number,
      default: 0
    }
  },
  { _id: false }
)

const machineSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['abkant', 'laser-cutting', 'laser-welding'],
      required: true,
      index: true
    },
    brand: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    family: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    series: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    model: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },

    pressForceTon: {
      type: Number,
      default: null,
      index: true
    },
    bendingLengthMm: {
      type: Number,
      default: null,
      index: true
    },

    description: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
      default: 0
    },

    image: {
      type: String,
      default: ''
    },
    gallery: {
      type: [String],
      default: []
    },

    specs: {
      type: [specSchema],
      default: []
    },

    isPublished: {
      type: Boolean,
      default: false,
      index: true
    }
  },
  { timestamps: true }
)

machineSchema.index(
  { category: 1, family: 1, pressForceTon: 1, bendingLengthMm: 1 },
  { unique: true }
)

module.exports = mongoose.model('Machine', machineSchema)