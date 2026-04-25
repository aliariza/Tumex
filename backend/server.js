const mongoose = require('mongoose')
const { createApp } = require('./app')
const JobPosition = require('./models/JobPosition')
const { createLoginHandler, createRegisterHandler } = require('./controllers/authController')
const { createDealerQuoteRequestHandler } = require('./controllers/dealerRequestController')
const {
  createAdminDeleteUserHandler,
  createAdminListUsersHandler,
  createAdminUpdateUserRoleHandler
} = require('./controllers/adminUserController')
const { createCorsOriginMatcher } = require('./utils/http')
const { ensureDefaultJobPositions } = require('./services/jobPositionSeed')

require('dotenv').config()

const PORT = process.env.PORT || 4000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tumex'

async function connectToDatabase(uri = MONGO_URI) {
  await mongoose.connect(uri)
  console.log('MongoDB bağlandı')
}

async function startServer(options = {}) {
  const { port = PORT, mongoUri = MONGO_URI } = options
  const app = createApp()

  try {
    await connectToDatabase(mongoUri)
    await ensureDefaultJobPositions({ jobPositionModel: JobPosition })
  } catch (err) {
    console.error('MongoDB bağlantı hatası:', err.message)
    process.exit(1)
  }

  return app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
}

if (require.main === module) {
  startServer().catch((error) => {
    console.error('FATAL:', error.message)
    process.exit(1)
  })
}

module.exports = {
  createApp,
  createAdminDeleteUserHandler,
  createAdminListUsersHandler,
  createAdminUpdateUserRoleHandler,
  createDealerQuoteRequestHandler,
  createCorsOriginMatcher,
  createLoginHandler,
  createRegisterHandler,
  connectToDatabase,
  startServer
}
