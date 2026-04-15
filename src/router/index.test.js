import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createAppRouter, createMemoryHistory } from './index'

describe('router auth guard', () => {
  let apiClient
  let appStore

  beforeEach(() => {
    sessionStorage.clear()
    apiClient = {
      get: vi.fn()
    }
    appStore = {
      dispatch: vi.fn()
    }
  })

  it('redirects unauthenticated visitors away from protected routes', async () => {
    const router = createAppRouter({
      apiClient,
      appStore,
      history: createMemoryHistory()
    })

    await router.push('/protected')

    expect(router.currentRoute.value.name).toBe('bayi')
    expect(apiClient.get).not.toHaveBeenCalled()
    expect(appStore.dispatch).toHaveBeenCalledWith('logout')
  })

  it('allows access when the backend validates the token', async () => {
    sessionStorage.setItem('token', 'valid-token')
    apiClient.get.mockResolvedValue({ status: 200 })

    const router = createAppRouter({
      apiClient,
      appStore,
      history: createMemoryHistory()
    })

    await router.push('/protected/laser')

    expect(apiClient.get).toHaveBeenCalledWith('/protected')
    expect(router.currentRoute.value.name).toBe('ProtectedLaser')
    expect(appStore.dispatch).not.toHaveBeenCalled()
  })

  it('logs out and redirects when the backend rejects the token', async () => {
    sessionStorage.setItem('token', 'expired-token')
    apiClient.get.mockRejectedValue(new Error('unauthorized'))

    const router = createAppRouter({
      apiClient,
      appStore,
      history: createMemoryHistory()
    })

    await router.push('/protected/abkant')

    expect(apiClient.get).toHaveBeenCalledWith('/protected')
    expect(appStore.dispatch).toHaveBeenCalledWith('logout')
    expect(router.currentRoute.value.name).toBe('bayi')
  })
})
