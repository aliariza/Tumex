/**
 * One-time script: sets image = '/assets/images/DGE.png' for all DGE machines.
 * Run from the backend folder:  node scripts/set-dge-image.js
 */

require('dotenv').config()
const mongoose = require('mongoose')
const Machine = require('../models/Machine')

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tumex'

async function run() {
  await mongoose.connect(MONGO_URI)
  console.log('Connected to MongoDB')

  const result = await Machine.updateMany(
    { series: 'DGE' },
    { $set: { image: '/assets/images/DGE.png' } }
  )

  console.log(`Updated ${result.modifiedCount} DGE machine(s).`)
  await mongoose.disconnect()
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
