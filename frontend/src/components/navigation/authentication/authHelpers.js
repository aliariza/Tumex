export const TOAST_OPTIONS = {
  timeout: 3000
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i

export function isValidEmail(email) {
  return EMAIL_PATTERN.test(email.toLowerCase())
}

export function validateRequiredField(errors, fieldName, value, message) {
  if (!value) {
    errors[fieldName] = message
    return false
  }

  return true
}

export function validateEmailField(errors, fieldName, value, requiredMessage, invalidMessage) {
  if (!validateRequiredField(errors, fieldName, value, requiredMessage)) {
    return false
  }

  if (!isValidEmail(value)) {
    errors[fieldName] = invalidMessage
    return false
  }

  return true
}

export function validateMinLengthField(errors, fieldName, value, requiredMessage, minLength, minLengthMessage) {
  if (!validateRequiredField(errors, fieldName, value, requiredMessage)) {
    return false
  }

  if (value.length < minLength) {
    errors[fieldName] = minLengthMessage
    return false
  }

  return true
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
