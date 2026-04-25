const User = require('../models/User')
const { normalizeEmail, sendInternalServerError, trimValue } = require('../utils/http')

function createDealerQuoteRequestHandler({
  userModel = User,
  dealerQuoteRequestNotifier = async () => false
} = {}) {
  return async (req, res) => {
    try {
      const {
        productGroup,
        machineSeries,
        customerName,
        customerCompany,
        contactEmail,
        contactPhone,
        timeline,
        requirementSummary
      } = req.body || {}

      if (!productGroup || !customerName || !customerCompany || !contactEmail || !requirementSummary) {
        return res.status(400).json({ message: 'Lütfen zorunlu alanları doldurun' })
      }

      const dealer = await userModel.findById(req.user._id).select('-password')

      const payload = {
        productGroup: trimValue(productGroup),
        machineSeries: trimValue(machineSeries || ''),
        customerName: trimValue(customerName),
        customerCompany: trimValue(customerCompany),
        contactEmail: normalizeEmail(contactEmail),
        contactPhone: trimValue(contactPhone || ''),
        timeline: trimValue(timeline || ''),
        requirementSummary: trimValue(requirementSummary),
        dealerName: trimValue(dealer?.username || ''),
        dealerEmail: normalizeEmail(dealer?.email || ''),
        dealerCompany: trimValue(dealer?.companyname || ''),
        dealerTelephone: trimValue(dealer?.telephone || '')
      }

      await dealerQuoteRequestNotifier(payload)

      return res.status(201).json({
        message: 'Teklif talebiniz alındı. Tumex ekibi sizinle kısa süre içinde iletişime geçecek.'
      })
    } catch (error) {
      return sendInternalServerError(res, '/protected/quote-request', error)
    }
  }
}

module.exports = {
  createDealerQuoteRequestHandler
}
