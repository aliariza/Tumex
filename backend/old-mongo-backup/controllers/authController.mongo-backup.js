const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const {
  createRegisterPayload,
  normalizeEmail,
  sendInternalServerError
} = require('../utils/http')

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
        const notified = await accessRequestNotifier(newUser)
        if (notified) {
          console.info(`[/register notify] access request email sent for ${newUser.email}`)
        } else {
          console.info(`[/register notify] email skipped for ${newUser.email}`)
        }
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

module.exports = {
  createLoginHandler,
  createRegisterHandler
}
