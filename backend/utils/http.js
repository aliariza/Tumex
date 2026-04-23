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
    powerKw: body.powerKw === '' || body.powerKw == null
      ? null
      : Number(body.powerKw),
    workingAreaCode: trimValue(body.workingAreaCode || ''),
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

module.exports = {
  INTERNAL_SERVER_MESSAGE,
  buildMachinePayload,
  createCorsOriginMatcher,
  createRegisterPayload,
  normalizeEmail,
  parseAllowedOrigins,
  sendInternalServerError,
  trimValue
}
