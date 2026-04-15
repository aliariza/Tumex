import { flushPromises, mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import LoginModal from './LoginModal.vue'

const { push, success, error, apiPost } = vi.hoisted(() => ({
  push: vi.fn(),
  success: vi.fn(),
  error: vi.fn(),
  apiPost: vi.fn()
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push
  })
}))

vi.mock('vue-toastification', () => ({
  useToast: () => ({
    success,
    error
  })
}))

vi.mock('@/lib/api', () => ({
  default: {
    post: apiPost
  }
}))

function createTestStore({ showLoginModal = true } = {}) {
  const store = createStore({
    getters: {
      showLoginModal: () => showLoginModal
    }
  })

  vi.spyOn(store, 'dispatch').mockResolvedValue(undefined)

  return store
}

describe('LoginModal', () => {
  beforeEach(() => {
    apiPost.mockReset()
    push.mockReset()
    success.mockReset()
    error.mockReset()
  })

  it('shows validation errors when the form is submitted empty', async () => {
    const wrapper = mount(LoginModal, {
      global: {
        plugins: [createTestStore()]
      }
    })

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('E-posta gerekli')
    expect(wrapper.text()).toContain('Şifre gerekli')
    expect(apiPost).not.toHaveBeenCalled()
  })

  it('logs the user in and redirects to the protected area', async () => {
    apiPost.mockResolvedValue({
      status: 200,
      data: {
        message: 'Hosgeldiniz',
        token: 'fresh-token'
      }
    })

    const store = createTestStore()
    const wrapper = mount(LoginModal, {
      global: {
        plugins: [store]
      }
    })

    await wrapper.get('#email').setValue('dealer@example.com')
    await wrapper.get('#password').setValue('secret123')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(apiPost).toHaveBeenCalledWith('/login', {
      email: 'dealer@example.com',
      password: 'secret123'
    })
    expect(success).toHaveBeenCalled()
    expect(store.dispatch).toHaveBeenCalledWith('setAuthentication', {
      isAuthenticated: true,
      token: 'fresh-token'
    })
    expect(store.dispatch).toHaveBeenCalledWith('closeLoginModal')
    expect(push).toHaveBeenCalledWith('/protected')
  })

  it('shows an auth error toast and stays on the modal when login fails', async () => {
    apiPost.mockRejectedValue({
      response: {
        status: 401
      }
    })

    const store = createTestStore()
    const wrapper = mount(LoginModal, {
      global: {
        plugins: [store]
      }
    })

    await wrapper.get('#email').setValue('dealer@example.com')
    await wrapper.get('#password').setValue('wrong-password')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(error).toHaveBeenCalledWith(
      'E-posta veya sifre hatali',
      expect.objectContaining({ timeout: 3000 })
    )
    expect(store.dispatch).not.toHaveBeenCalledWith(
      'setAuthentication',
      expect.anything()
    )
    expect(push).not.toHaveBeenCalled()
  })
})
