const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('./models/User')
const authenticateToken = require('./middleware/authMiddleware')
require('dotenv').config()

const app = express()

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())

// ─── Env guards ───────────────────────────────────────────────────────────────
if (!process.env.TOKEN_SECRET) {
  console.error('FATAL: TOKEN_SECRET environment variable is not set. Exiting.')
  process.exit(1)
}

// ─── DB ───────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tumex'

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB bağlandı'))
  .catch((err) => {
    console.error('MongoDB bağlantı hatası:', err.message)
    process.exit(1)
  })

// ─── Routes ───────────────────────────────────────────────────────────────────

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ message: 'E-posta ve şifre gerekli' })
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() })
    if (!user) {
      return res.status(401).json({ message: 'Yanlış bilgi' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Yanlış bilgi' })
    }

    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: '1h' })
    res.status(200).json({ message: 'Hoşgeldiniz', token })
  } catch (error) {
    console.error('[/login]', error.message)
    res.status(500).json({ message: 'Sunucu hatası' })
  }
})

app.post('/register', async (req, res) => {
  try {
    const { username, email, password, companyname, telephone, address } = req.body

    if (!username || !email || !password || !companyname || !telephone || !address) {
      return res.status(400).json({ message: 'Lütfen tüm alanları doldurun' })
    }

    const normalizedEmail = email.toLowerCase().trim()

    const existingUser = await User.findOne({ email: normalizedEmail })
    if (existingUser) {
      return res.status(400).json({ message: 'Bu e-posta zaten kayıtlı' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      username: username.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      companyname: companyname.trim(),
      telephone: telephone.trim(),
      address: address.trim()
    })

    await newUser.save()
    res.status(201).json({ message: 'Başarıyla kayıt yapıldı' })
  } catch (error) {
    console.error('[/register]', error.message)
    res.status(500).json({ message: 'Sunucu hatası' })
  }
})

app.get('/protected', authenticateToken, (_req, res) => {
  res.json({ message: 'Korunaklı bölgeye erişildi' })
})

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ message: 'Sayfa bulunamadı' })
})

// ─── Global error handler ─────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[unhandled]', err.message)
  res.status(500).json({ message: 'Sunucu hatası' })
})

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`Sunucu http://localhost:${PORT} adresinde çalışıyor`)
})
