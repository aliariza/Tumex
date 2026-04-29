/**
 * One-time script: sets image paths for DLC, D-DLC and D-DLC-S machines.
 * Run from the backend folder:  node scripts/set-laser-images.js
 */

require('dotenv').config()
const mongoose = require('mongoose')
const Machine = require('../models/Machine')

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tumex'

const SERIES_IMAGES = [
  { series: 'DLC',   image: '/assets/images/DLC.png'   },
  { series: 'D-DLC', image: '/assets/images/D-DLC.png' },
  { series: 'D-DLC-S', image: '/assets/images/D-DLC-S.png' }
]

async function run() {
  await mongoose.connect(MONGO_URI)
  console.log('Connected to MongoDB')

  for (const { series, image } of SERIES_IMAGES) {
    const result = await Machine.updateMany(
      { series },
      { $set: { image } }
    )
    console.log(`${series}: updated ${result.modifiedCount} machine(s) → ${image}`)
  }

  await mongoose.disconnect()
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
