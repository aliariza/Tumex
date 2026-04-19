import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AUTH_MODAL_NAMES } from '@/components/navigation/authentication/authModalNames'
import { createAppStore } from './index'

describe('store', () => {
  let apiClient

  beforeEach(() => {
    sessionStorage.clear()
    apiClient = {
      post: vi.fn()
    }
  })

  it('hydrates authentication state from session storage', () => {
    sessionStorage.setItem('isAuthenticated', 'true')
    sessionStorage.setItem('token', 'persisted-token')

    const store = createAppStore(apiClient)

    expect(store.getters.isAuthenticated).toBe(true)
    expect(store.state.token).toBe('persisted-token')
  })

  it('stores credentials after a successful login', async () => {
    apiClient.post.mockResolvedValue({
      status: 200,
      data: { token: 'fresh-token' }
    })

    const store = createAppStore(apiClient)
    await store.dispatch('login', { email: 'dealer@example.com', password: 'secret' })

    expect(apiClient.post).toHaveBeenCalledWith('/login', {
      email: 'dealer@example.com',
      password: 'secret'
    })
    expect(store.getters.isAuthenticated).toBe(true)
    expect(store.state.token).toBe('fresh-token')
    expect(sessionStorage.getItem('token')).toBe('fresh-token')
  })

  it('clears authentication state when login fails', async () => {
    apiClient.post.mockRejectedValue(new Error('bad credentials'))
    const store = createAppStore(apiClient)
    store.commit('setAuthentication', { isAuthenticated: true, token: 'stale-token' })

    await expect(store.dispatch('login', { email: 'dealer@example.com', password: 'bad' })).rejects.toThrow('bad credentials')

    expect(store.getters.isAuthenticated).toBe(false)
    expect(sessionStorage.getItem('token')).toBeNull()
  })

  it('opens the register modal through the helper action', async () => {
    const store = createAppStore(apiClient)

    await store.dispatch('openRegisterModal')

    expect(store.state.activeAuthModal).toBe(AUTH_MODAL_NAMES.register)
    expect(store.getters.showRegisterModal).toBe(true)
  })
})
