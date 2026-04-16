const mongoose = require('mongoose')

const machineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    brand: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: ['abkant', 'laser-cutting', 'laser-welding'],
      required: true
    },
    model: {
      type: String,
      required: true,
      trim: true
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
    specs: {
      type: Object,
      default: {}
    },
    isPublished: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Machine', machineSchema)