import { describe, expect, it, vi } from 'vitest'
import { isValidEmail, showRequestErrorToast, TOAST_OPTIONS } from './authHelpers'

describe('authHelpers', () => {
  it('accepts valid email addresses and rejects invalid ones', () => {
    expect(isValidEmail('dealer@example.com')).toBe(true)
    expect(isValidEmail('Dealer@Example.COM')).toBe(true)
    expect(isValidEmail('invalid-email')).toBe(false)
    expect(isValidEmail('missing-domain@')).toBe(false)
  })

  it('shows the network error toast when there is no response object', () => {
    const toast = { error: vi.fn() }

    showRequestErrorToast(toast, {}, { network: 'Baglanti hatasi' })

    expect(toast.error).toHaveBeenCalledWith('Baglanti hatasi', TOAST_OPTIONS)
  })

  it('prefers status-specific messages before the default one', () => {
    const toast = { error: vi.fn() }
    const error = { response: { status: 401 } }

    showRequestErrorToast(toast, error, {
      401: 'Yetkisiz giris',
      default: 'Beklenmeyen hata'
    })

    expect(toast.error).toHaveBeenCalledWith('Yetkisiz giris', TOAST_OPTIONS)
  })
})
