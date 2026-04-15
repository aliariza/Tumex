const jwt = require('jsonwebtoken')

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Erişim reddedildi. Token bulunamadı.' })
  }

  const token = authHeader.slice(7) // strip 'Bearer '

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET)
    req.user = verified
    next()
  } catch (error) {
    // 401 for expired/invalid tokens (not 403 which implies authorization, not authentication)
    res.status(401).json({ message: 'Geçersiz veya süresi dolmuş token.' })
  }
}

module.exports = authenticateToken
