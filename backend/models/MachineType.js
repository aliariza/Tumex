// /models/machineType.js
const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Define the Length schema
const lengthSchema = new Schema({
  length: {
    type: Number, // length in mm
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  stroke: {
    type: Number,
    required: true
  }
  // Add other properties as needed
})

// Define the Type schema
const typeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  lengths: {
    type: [lengthSchema],
    required: true
  }
})

// Define the Series schema
const seriesSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  types: {
    type: [typeSchema],
    default: []
  }
})

// Define the MachineType schema
const machineTypeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  series: {
    type: [seriesSchema],
    default: []
  }
})

// Create models
const MachineType = mongoose.model('MachineType', machineTypeSchema)
const Series = mongoose.model('Series', seriesSchema)
const Type = mongoose.model('Type', typeSchema)
const Length = mongoose.model('Length', lengthSchema)

// Export models
module.exports = {
  MachineType,
  Series,
  Type,
  Length
}
