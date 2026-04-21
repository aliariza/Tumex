import { describe, expect, it } from 'vitest'
import { canAccessRoute, getRouteAccess, isPublicRoute, isRestrictedRoute } from './authAccess'

describe('authAccess', () => {
  it('derives route access from meta with a public fallback', () => {
    expect(getRouteAccess({ meta: { access: 'admin' } })).toBe('admin')
    expect(getRouteAccess({ meta: {} })).toBe('public')
  })

  it('recognizes public and restricted routes', () => {
    expect(isPublicRoute({ meta: { access: 'public' } })).toBe(true)
    expect(isRestrictedRoute({ meta: { access: 'protected' } })).toBe(true)
  })

  it('checks user roles against route access', () => {
    expect(canAccessRoute({ role: 'dealer' }, 'protected')).toBe(true)
    expect(canAccessRoute({ role: 'admin' }, 'protected')).toBe(true)
    expect(canAccessRoute({ role: 'dealer' }, 'admin')).toBe(false)
    expect(canAccessRoute({ role: 'admin' }, 'admin')).toBe(true)
  })
})
