import { mount, flushPromises } from '@vue/test-utils'
import { RouterView } from 'vue-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createAppRouter, createMemoryHistory } from './index'
import { createAppStore } from '@/store'

describe('app route flow', () => {
  beforeEach(() => {
    sessionStorage.clear()
  })

  it('redirects unauthenticated users from protected pages to the dealer page', async () => {
    const apiClient = {
      get: vi.fn()
    }
    const store = createAppStore({ post: vi.fn() })
    const router = createAppRouter({
      apiClient,
      appStore: store,
      history: createMemoryHistory()
    })

    const wrapper = mount(RouterView, {
      global: {
        plugins: [store, router]
      }
    })

    await router.push('/protected')
    await router.isReady()
    await flushPromises()

    expect(router.currentRoute.value.name).toBe('bayi')
    expect(wrapper.text()).toContain('Bayi girişine hoş geldiniz')
    expect(apiClient.get).not.toHaveBeenCalled()
  })

  it('renders the protected home page when the token is valid', async () => {
    sessionStorage.setItem('token', 'valid-token')
    const apiClient = {
      get: vi.fn().mockResolvedValue({
        data: { role: 'dealer' }
      })
    }
    const store = createAppStore({ post: vi.fn() })
    const router = createAppRouter({
      apiClient,
      appStore: store,
      history: createMemoryHistory()
    })

    store.dispatch('setAuthentication', {
      isAuthenticated: true,
      token: 'valid-token'
    })

    const wrapper = mount(RouterView, {
      global: {
        plugins: [store, router]
      }
    })

    await router.push('/protected')
    await router.isReady()
    await flushPromises()

    expect(apiClient.get).toHaveBeenCalledWith('/me')
    expect(router.currentRoute.value.name).toBe('Protected')
    expect(wrapper.text()).toContain('Tumex bayi alanına hoş geldiniz')
  })
})