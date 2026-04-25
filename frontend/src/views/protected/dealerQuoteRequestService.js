import api from '@/shared/lib/api'

export function createDealerQuoteRequest(payload) {
  return api.post('/protected/quote-request', payload)
}
