export const TOAST_OPTIONS = {
  timeout: 3000
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i

export function isValidEmail(email) {
  return EMAIL_PATTERN.test(email.toLowerCase())
}

export function showRequestErrorToast(toast, error, messages = {}) {
  if (!error.response) {
    toast.error(messages.network || 'Sunucuya baglanilamadi', TOAST_OPTIONS)
    return
  }

  const message =
    messages[error.response.status] || messages.default || 'Beklenmeyen bir hata olustu'

  toast.error(message, TOAST_OPTIONS)
}
