import { beforeEach, describe, expect, it } from 'vitest'
import {
  clearAuthSession,
  getSessionToken,
  getStoredAuthState,
  hasSessionToken,
  setAuthSession
} from './authSession'

describe('authSession', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('stores and hydrates the shared auth session shape', () => {
    setAuthSession({
      isAuthenticated: true,
      token: 'session-token',
      role: 'admin'
    })

    expect(getStoredAuthState()).toEqual({
      isAuthenticated: true,
      token: 'session-token',
      role: 'admin'
    })
    expect(getSessionToken()).toBe('session-token')
    expect(hasSessionToken()).toBe(true)
  })

  it('clears all shared auth session values', () => {
    setAuthSession({
      isAuthenticated: true,
      token: 'session-token',
      role: 'admin'
    })

    clearAuthSession()

    expect(getStoredAuthState()).toEqual({
      isAuthenticated: false,
      token: null,
      role: null
    })
    expect(hasSessionToken()).toBe(false)
  })
})
