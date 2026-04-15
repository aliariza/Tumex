const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('./models/User')
const authenticateToken = require('./middleware/authMiddleware')
require('dotenv').config()

const PORT = process.env.PORT || 4000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tumex'
const INTERNAL_SERVER_MESSAGE = 'Sunucu hatası'

function normalizeEmail(email = '') {
  return email.toLowerCase().trim()
}

function trimValue(value = '') {
  return value.trim()
}

function createRegisterPayload(body, hashedPassword) {
  return {
    username: trimValue(body.username),
    email: normalizeEmail(body.email),
    password: hashedPassword,
    companyname: trimValue(body.companyname),
    telephone: trimValue(body.telephone),
    address: trimValue(body.address)
  }
}

function sendInternalServerError(res, scope, error) {
  console.error(`[${scope}]`, error.message)
  return res.status(500).json({ message: INTERNAL_SERVER_MESSAGE })
}

function createApp(options = {}) {
  const {
    userModel = User,
    bcryptLib = bcrypt,
    jwtLib = jwt,
    authMiddleware = authenticateToken,
    corsOrigin = process.env.FRONTEND_URL || 'http://localhost:5173',
    tokenSecret = process.env.TOKEN_SECRET
  } = options

  if (!tokenSecret) {
    throw new Error('TOKEN_SECRET environment variable is not set')
  }

  const app = express()

  app.use(cors({
    origin: corsOrigin,
    credentials: true
  }))
  app.use(express.json())

  app.post('/login', createLoginHandler({ userModel, bcryptLib, jwtLib, tokenSecret }))
  app.post('/register', createRegisterHandler({ userModel, bcryptLib }))
  app.get('/protected', authMiddleware, (_req, res) => {
    res.json({ message: 'Korunaklı bölgeye erişildi' })
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

function createLoginHandler({ userModel = User, bcryptLib = bcrypt, jwtLib = jwt, tokenSecret = process.env.TOKEN_SECRET } = {}) {
  return async (req, res) => {
    try {
      const { email, password } = req.body
      if (!email || !password) {
        return res.status(400).json({ message: 'E-posta ve şifre gerekli' })
      }

      const user = await userModel.findOne({ email: normalizeEmail(email) })
      if (!user) {
        return res.status(401).json({ message: 'Yanlış bilgi' })
      }

      const isMatch = await bcryptLib.compare(password, user.password)
      if (!isMatch) {
        return res.status(401).json({ message: 'Yanlış bilgi' })
      }

      const token = jwtLib.sign({ _id: user._id }, tokenSecret, { expiresIn: '1h' })
      return res.status(200).json({ message: 'Hoşgeldiniz', token })
    } catch (error) {
      return sendInternalServerError(res, '/login', error)
    }
  }
}

function createRegisterHandler({ userModel = User, bcryptLib = bcrypt } = {}) {
  return async (req, res) => {
    try {
      const { username, email, password, companyname, telephone, address } = req.body

      if (!username || !email || !password || !companyname || !telephone || !address) {
        return res.status(400).json({ message: 'Lütfen tüm alanları doldurun' })
      }

      const normalizedEmail = normalizeEmail(email)

      const existingUser = await userModel.findOne({ email: normalizedEmail })
      if (existingUser) {
        return res.status(400).json({ message: 'Bu e-posta zaten kayıtlı' })
      }

      const hashedPassword = await bcryptLib.hash(password, 10)
      const newUser = new userModel(createRegisterPayload(req.body, hashedPassword))

      await newUser.save()
      return res.status(201).json({ message: 'Başarıyla kayıt yapıldı' })
    } catch (error) {
      return sendInternalServerError(res, '/register', error)
    }
  }
}

async function connectToDatabase(uri = MONGO_URI) {
  await mongoose.connect(uri)
  console.log('MongoDB bağlandı')
}

async function startServer(options = {}) {
  const { port = PORT, mongoUri = MONGO_URI } = options
  const app = createApp()

  try {
    await connectToDatabase(mongoUri)
  } catch (err) {
    console.error('MongoDB bağlantı hatası:', err.message)
    process.exit(1)
  }

  return app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port} adresinde çalışıyor`)
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
  createLoginHandler,
  createRegisterHandler,
  connectToDatabase,
  startServer
}
