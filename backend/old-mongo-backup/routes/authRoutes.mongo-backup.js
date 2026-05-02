const User = require('../models/User')
const requireRole = require('../middleware/requireRole')
const { createLoginHandler, createRegisterHandler } = require('../controllers/authController')
const { createDealerQuoteRequestHandler } = require('../controllers/dealerRequestController')
const { sendInternalServerError } = require('../utils/http')

function registerAuthRoutes(app, {
  userModel = User,
  bcryptLib,
  jwtLib,
  tokenSecret,
  authMiddleware,
  accessRequestNotifier,
  dealerQuoteRequestNotifier
} = {}) {
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

  app.post(
    '/protected/quote-request',
    authMiddleware,
    requireRole('dealer', 'admin'),
    createDealerQuoteRequestHandler({ userModel, dealerQuoteRequestNotifier })
  )
}

module.exports = { registerAuthRoutes }
