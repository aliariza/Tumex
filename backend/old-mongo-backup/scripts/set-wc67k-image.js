/**
 * One-time script: sets image = '/assets/images/WCK.png' for all WC67K machines.
 * Run from the backend folder:  node scripts/set-wc67k-image.js
 */

require('dotenv').config()
const mongoose = require('mongoose')
const Machine = require('../models/Machine')

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tumex'

async function run() {
  await mongoose.connect(MONGO_URI)
  console.log('Connected to MongoDB')

  const result = await Machine.updateMany(
    { series: 'WC67K' },
    { $set: { image: '/assets/images/WCK.png' } }
  )

  console.log(`Updated ${result.modifiedCount} WC67K machine(s).`)
  await mongoose.disconnect()
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
