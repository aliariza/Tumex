const SESSION_AUTH_KEY = 'isAuthenticated'
const SESSION_TOKEN_KEY = 'token'
const SESSION_ROLE_KEY = 'role'

export function getStoredAuthState() {
  return {
    isAuthenticated: sessionStorage.getItem(SESSION_AUTH_KEY) === 'true',
    token: sessionStorage.getItem(SESSION_TOKEN_KEY) || null,
    role: sessionStorage.getItem(SESSION_ROLE_KEY) || null
  }
}

export function setAuthSession({ isAuthenticated, token, role = null }) {
  sessionStorage.setItem(SESSION_AUTH_KEY, String(Boolean(isAuthenticated)))

  if (token) {
    sessionStorage.setItem(SESSION_TOKEN_KEY, token)
  } else {
    sessionStorage.removeItem(SESSION_TOKEN_KEY)
  }

  if (role) {
    sessionStorage.setItem(SESSION_ROLE_KEY, role)
  } else {
    sessionStorage.removeItem(SESSION_ROLE_KEY)
  }
}

export function clearAuthSession() {
  sessionStorage.removeItem(SESSION_AUTH_KEY)
  sessionStorage.removeItem(SESSION_TOKEN_KEY)
  sessionStorage.removeItem(SESSION_ROLE_KEY)
}

export function getSessionToken() {
  return getStoredAuthState().token
}

export function hasSessionToken() {
  return Boolean(getSessionToken())
}
