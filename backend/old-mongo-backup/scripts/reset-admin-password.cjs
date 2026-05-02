require('dotenv').config()

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const User = require('../models/User')

async function main() {
  const newPassword = process.argv[2]

  if (!newPassword) {
    throw new Error('Usage: node scripts/reset-admin-password.cjs NewPassword123')
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI is missing in .env')
  }

  await mongoose.connect(process.env.MONGO_URI)

  const admin = await User.findOne({ role: 'admin' })

  if (!admin) {
    throw new Error('No admin user found with role: admin')
  }

  admin.password = await bcrypt.hash(newPassword, 10)
  await admin.save()

  console.log('Admin password reset successfully')
  console.log('Admin user:', admin.email || admin.username || admin.name || admin._id.toString())

  await mongoose.disconnect()
}

main().catch(async (error) => {
  console.error('Password reset failed:')
  console.error(error.message)

  try {
    await mongoose.disconnect()
  } catch (_) {}

  process.exit(1)
})
