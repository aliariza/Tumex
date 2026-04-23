const express = require('express')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('./models/User')
const Machine = require('./models/Machine')
const authenticateToken = require('./middleware/authMiddleware')
const { registerAuthRoutes } = require('./routes/authRoutes')
const { registerAdminRoutes } = require('./routes/adminRoutes')
const { registerMachineRoutes } = require('./routes/machineRoutes')
const { createCorsOriginMatcher } = require('./utils/http')
const {
  createNotifierConfig,
  createAccessRequestNotifier,
  createRoleChangeNotifier
} = require('./services/accessRequestNotifier')

function createApp(options = {}) {
  const notifierConfig = createNotifierConfig({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.SMTP_FROM,
    recipient: process.env.ACCESS_REQUEST_EMAIL || 'artumay@gmail.com'
  })

  const {
    userModel = User,
    machineModel = Machine,
    bcryptLib = bcrypt,
    jwtLib = jwt,
    authMiddleware = authenticateToken,
    corsOrigin = process.env.FRONTEND_URL || 'http://localhost:5173',
    corsOriginRegex = process.env.FRONTEND_URL_REGEX || '',
    tokenSecret = process.env.TOKEN_SECRET,
    accessRequestNotifier = createAccessRequestNotifier(notifierConfig),
    roleChangeNotifier = createRoleChangeNotifier(notifierConfig)
  } = options

  if (!tokenSecret) {
    throw new Error('TOKEN_SECRET environment variable is not set')
  }

  const app = express()

  app.use(cors({
    origin: createCorsOriginMatcher({ corsOrigin, corsOriginRegex }),
    credentials: true
  }))
  app.use(express.json())

  registerAuthRoutes(app, {
    userModel,
    bcryptLib,
    jwtLib,
    tokenSecret,
    authMiddleware,
    accessRequestNotifier
  })

  registerAdminRoutes(app, {
    userModel,
    machineModel,
    authMiddleware,
    roleChangeNotifier
  })

  registerMachineRoutes(app, { machineModel })

  app.get('/health', (_req, res) => {
    res.status(200).json({ ok: true })
  })

  app.use((_req, res) => {
    res.status(404).json({ message: 'Sayfa bulunamadı' })
  })

  app.use((err, _req, res, next) => {
    void next
    console.error('[unhandled]', err.message)
    res.status(500).json({ message: 'Sunucu hatası' })
  })

  return app
}

module.exports = { createApp }
