const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('./models/User')
const authenticateToken = require('./middleware/authMiddleware')
const requireRole = require('./middleware/requireRole')
const Machine = require('./models/Machine')
const {
  createAccessRequestNotifier,
  createRoleChangeNotifier
} = require('./services/accessRequestNotifier')

require('dotenv').config()

const PORT = process.env.PORT || 4000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tumex'
const INTERNAL_SERVER_MESSAGE = 'Sunucu hatası'

function parseAllowedOrigins(value = '') {
  return value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean)
}

function createCorsOriginMatcher({
  corsOrigin = process.env.FRONTEND_URL || 'http://localhost:5173',
  corsOriginRegex = process.env.FRONTEND_URL_REGEX || ''
} = {}) {
  const allowedOrigins = parseAllowedOrigins(corsOrigin)
  const allowedOriginPattern = corsOriginRegex ? new RegExp(corsOriginRegex) : null

  return (origin, callback) => {
    if (!origin) {
      callback(null, true)
      return
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true)
      return
    }

    if (allowedOriginPattern?.test(origin)) {
      callback(null, true)
      return
    }

    callback(new Error(`CORS blocked for origin: ${origin}`))
  }
}

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
    address: trimValue(body.address),
    role: 'user'
  }
}

function buildMachinePayload(body = {}) {
  return {
    category: trimValue(body.category || ''),
    brand: trimValue(body.brand || ''),
    family: trimValue(body.family || ''),
    series: trimValue(body.series || ''),
    model: trimValue(body.model || ''),
    title: trimValue(body.title || ''),
    description: trimValue(body.description || ''),
    price: Number(body.price || 0),
    pressForceTon: body.pressForceTon === '' || body.pressForceTon == null
      ? null
      : Number(body.pressForceTon),
    bendingLengthMm: body.bendingLengthMm === '' || body.bendingLengthMm == null
      ? null
      : Number(body.bendingLengthMm),
    image: trimValue(body.image || ''),
    gallery: Array.isArray(body.gallery) ? body.gallery : [],
    specs: Array.isArray(body.specs)
      ? body.specs
          .map((spec, index) => ({
            key: trimValue(spec?.key || ''),
            label: trimValue(spec?.label || ''),
            value: trimValue(spec?.value || ''),
            order: index + 1
          }))
          .filter((spec) => spec.key || spec.label || spec.value)
      : [],
      isPublished: typeof body.isPublished === 'boolean' ? body.isPublished : false
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
    corsOriginRegex = process.env.FRONTEND_URL_REGEX || '',
    tokenSecret = process.env.TOKEN_SECRET,
    accessRequestNotifier = createAccessRequestNotifier({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE,
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
      from: process.env.SMTP_FROM,
      recipient: process.env.ACCESS_REQUEST_EMAIL || 'artumay@gmail.com'
    }),
    roleChangeNotifier = createRoleChangeNotifier({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE,
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
      from: process.env.SMTP_FROM,
      recipient: process.env.ACCESS_REQUEST_EMAIL || 'artumay@gmail.com'
    })
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

  app.post('/login', createLoginHandler({ userModel, bcryptLib, jwtLib, tokenSecret }))
  app.post('/register', createRegisterHandler({ userModel, bcryptLib, accessRequestNotifier }))

  app.get('/me', authMiddleware, async (req, res) => {
    try {
      const user = await userModel.findById(req.user._id).select('-password')
      if (!user) {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı' })
      }

      return res.status(200).json(user)
    } catch (error) {
      return sendInternalServerError(res, '/me', error)
    }
  })

  app.get('/protected', authMiddleware, requireRole('dealer', 'admin'), (_req, res) => {
    res.json({ message: 'Korunaklı bölgeye erişildi' })
  })

  app.get('/admin', authMiddleware, requireRole('admin'), (_req, res) => {
    res.json({ message: 'Admin bölgesine erişildi' })
  })

  app.get('/admin/machines', authMiddleware, requireRole('admin'), async (_req, res) => {
    try {
      const machines = await Machine.find().sort({ createdAt: -1 })
      return res.status(200).json(machines)
    } catch (error) {
      return sendInternalServerError(res, '/admin/machines GET', error)
    }
  })

  app.get('/admin/users', authMiddleware, requireRole('admin'), createAdminListUsersHandler({ userModel }))

  app.patch(
    '/admin/users/:id/role',
    authMiddleware,
    requireRole('admin'),
    createAdminUpdateUserRoleHandler({ userModel, roleChangeNotifier })
  )

  app.post('/admin/machines', authMiddleware, requireRole('admin'), async (req, res) => {
    try {
      const machine = new Machine(buildMachinePayload(req.body))
      await machine.save()
      return res.status(201).json(machine)
    } catch (error) {
      console.error('[/admin/machines POST]', error.message)
      return res.status(400).json({ message: 'Makine kaydı oluşturulamadı' })
    }
  })

  app.put('/admin/machines/:id', authMiddleware, requireRole('admin'), async (req, res) => {
    try {
      const updatedMachine = await Machine.findByIdAndUpdate(
        req.params.id,
        buildMachinePayload(req.body),
        {
          new: true,
          runValidators: true
        }
      )

      if (!updatedMachine) {
        return res.status(404).json({ message: 'Makine bulunamadı' })
      }

      return res.status(200).json(updatedMachine)
    } catch (error) {
      console.error('[/admin/machines/:id PUT]', error.message)
      return res.status(400).json({ message: 'Makine güncellenemedi' })
    }
  })

  app.delete('/admin/machines/:id', authMiddleware, requireRole('admin'), async (req, res) => {
    try {
      const deletedMachine = await Machine.findByIdAndDelete(req.params.id)

      if (!deletedMachine) {
        return res.status(404).json({ message: 'Makine bulunamadı' })
      }

      return res.status(200).json({ message: 'Makine silindi' })
    } catch (error) {
      return sendInternalServerError(res, '/admin/machines/:id DELETE', error)
    }
  })

  app.get('/machines', async (req, res) => {
    try {
      const { category, series, brand } = req.query

      const filter = { isPublished: true }

      if (category) filter.category = category
      if (series) filter.series = series
      if (brand) filter.brand = brand

      const machines = await Machine.find(filter).sort({
        pressForceTon: 1,
        bendingLengthMm: 1,
        title: 1
      })

      return res.status(200).json(machines)
    } catch (error) {
      console.error('[/machines GET]', error)
      return sendInternalServerError(res, '/machines GET', error)
    }
  })
  
  app.get('/machines/model/:model', async (req, res) => {
    try {
      const machine = await Machine.findOne({
        model: req.params.model,
        isPublished: true
      })

      if (!machine) {
        return res.status(404).json({ message: 'Machine not found' })
      }

      return res.status(200).json(machine)
    } catch (error) {
      console.error('[/machines/model/:model GET]', error)
      return sendInternalServerError(res, '/machines/model/:model GET', error)
    }
  })
  app.get('/machines/:id', async (req, res) => {
    try {
      const machine = await Machine.findOne({
        _id: req.params.id,
        isPublished: true
      })

      if (!machine) {
        return res.status(404).json({ message: 'Makine bulunamadı' })
      }

      return res.status(200).json(machine)
    } catch (error) {
      return sendInternalServerError(res, '/machines/:id GET', error)
    }
  })

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

function createLoginHandler({
  userModel = User,
  bcryptLib = bcrypt,
  jwtLib = jwt,
  tokenSecret = process.env.TOKEN_SECRET
} = {}) {
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

      if (user.role === 'user') {
        return res.status(403).json({
          message: 'Erişim talebiniz alındı. Onay sonrası bayi sayfalarını kullanabilirsiniz.'
        })
      }

      const token = jwtLib.sign(
        {
          _id: user._id,
          role: user.role
        },
        tokenSecret,
        { expiresIn: '1h' }
      )

      return res.status(200).json({
        message: 'Hoşgeldiniz',
        token,
        role: user.role
      })
    } catch (error) {
      return sendInternalServerError(res, '/login', error)
    }
  }
}

function createRegisterHandler({
  userModel = User,
  bcryptLib = bcrypt,
  accessRequestNotifier = async () => false
} = {}) {
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
      try {
        await accessRequestNotifier(newUser)
      } catch (notificationError) {
        console.error('[/register notify]', notificationError.message)
      }

      return res.status(201).json({
        message: 'Talebiniz alındı. Onay sonrası bayi sayfalarına erişebilirsiniz.'
      })
    } catch (error) {
      return sendInternalServerError(res, '/register', error)
    }
  }
}

function createAdminListUsersHandler({ userModel = User } = {}) {
  return async (_req, res) => {
    try {
      const users = await userModel.find({}, '-password').sort({ createdAt: -1 })
      return res.status(200).json(users)
    } catch (error) {
      return sendInternalServerError(res, '/admin/users GET', error)
    }
  }
}

function createAdminUpdateUserRoleHandler({
  userModel = User,
  roleChangeNotifier = async () => false
} = {}) {
  return async (req, res) => {
    try {
      const nextRole = trimValue(req.body?.role || '')
      const allowedRoles = ['user', 'dealer', 'admin']

      if (!allowedRoles.includes(nextRole)) {
        return res.status(400).json({ message: 'Geçersiz rol' })
      }

      if (String(req.user?._id) === String(req.params.id) && nextRole !== 'admin') {
        return res.status(400).json({ message: 'Kendi admin yetkinizi kaldıramazsınız' })
      }

      const existingUser = await userModel.findById(req.params.id)
      if (!existingUser) {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı' })
      }

      const updatedUser = await userModel.findByIdAndUpdate(
        req.params.id,
        { role: nextRole },
        {
          new: true,
          runValidators: true
        }
      )

      if (!updatedUser) {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı' })
      }

      if (existingUser.role !== nextRole) {
        try {
          await roleChangeNotifier(updatedUser, existingUser.role, nextRole)
        } catch (notificationError) {
          console.error('[/admin/users/:id/role notify]', notificationError.message)
        }
      }

      const safeUser = typeof updatedUser.toObject === 'function'
        ? updatedUser.toObject()
        : { ...updatedUser }

      delete safeUser.password

      return res.status(200).json(safeUser)
    } catch (error) {
      return sendInternalServerError(res, '/admin/users/:id/role PATCH', error)
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
  createAdminListUsersHandler,
  createAdminUpdateUserRoleHandler,
  createCorsOriginMatcher,
  createLoginHandler,
  createRegisterHandler,
  connectToDatabase,
  startServer
}
