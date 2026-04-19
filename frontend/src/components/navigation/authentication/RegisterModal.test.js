import { flushPromises, mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import RegisterModal from './RegisterModal.vue'

const { success, error, apiPost } = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
  apiPost: vi.fn()
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

function createTestStore({ showRegisterModal = true } = {}) {
  const store = createStore({
    getters: {
      showRegisterModal: () => showRegisterModal
    }
  })

  vi.spyOn(store, 'dispatch').mockResolvedValue(undefined)

  return store
}

describe('RegisterModal', () => {
  beforeEach(() => {
    apiPost.mockReset()
    success.mockReset()
    error.mockReset()
  })

  it('shows validation errors when required fields are missing', async () => {
    const wrapper = mount(RegisterModal, {
      global: {
        plugins: [createTestStore()]
      }
    })

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Kullanıcı adı gerekli')
    expect(wrapper.text()).toContain('E-posta gerekli')
    expect(wrapper.text()).toContain('Şirket adı gerekli')
    expect(wrapper.text()).toContain('Şifre gerekli')
    expect(wrapper.text()).toContain('Telefon no. gerekli')
    expect(wrapper.text()).toContain('Adres gerekli')
    expect(apiPost).not.toHaveBeenCalled()
  })

  it('submits registration details and closes the modal on success', async () => {
    apiPost.mockResolvedValue({
      status: 201,
      data: {
        message: 'Kayit tamam'
      }
    })

    const store = createTestStore()
    const wrapper = mount(RegisterModal, {
      global: {
        plugins: [store]
      }
    })

    await wrapper.get('#username').setValue('Dealer Name')
    await wrapper.get('#email').setValue('dealer@example.com')
    await wrapper.get('#companyname').setValue('Tumex')
    await wrapper.get('#password').setValue('secret123')
    await wrapper.get('#telephone').setValue('123456')
    await wrapper.get('#address').setValue('Istanbul')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(apiPost).toHaveBeenCalledWith('/register', {
      username: 'Dealer Name',
      email: 'dealer@example.com',
      companyname: 'Tumex',
      password: 'secret123',
      telephone: '123456',
      address: 'Istanbul'
    })
    expect(success).toHaveBeenCalled()
    expect(store.dispatch).toHaveBeenCalledWith('closeRegisterModal')
  })

  it('shows the backend validation message when registration is rejected', async () => {
    apiPost.mockRejectedValue({
      response: {
        status: 400,
        data: {
          message: 'Bu e-posta zaten kayıtlı'
        }
      }
    })

    const store = createTestStore()
    const wrapper = mount(RegisterModal, {
      global: {
        plugins: [store]
      }
    })

    await wrapper.get('#username').setValue('Dealer Name')
    await wrapper.get('#email').setValue('dealer@example.com')
    await wrapper.get('#companyname').setValue('Tumex')
    await wrapper.get('#password').setValue('secret123')
    await wrapper.get('#telephone').setValue('123456')
    await wrapper.get('#address').setValue('Istanbul')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(error).toHaveBeenCalledWith(
      'Bu e-posta zaten kayıtlı',
      expect.objectContaining({ timeout: 3000 })
    )
    expect(store.dispatch).not.toHaveBeenCalledWith('closeRegisterModal')
  })

  it('shows the generic server error toast on registration failure', async () => {
    apiPost.mockRejectedValue({
      response: {
        status: 500
      }
    })

    const store = createTestStore()
    const wrapper = mount(RegisterModal, {
      global: {
        plugins: [store]
      }
    })

    await wrapper.get('#username').setValue('Dealer Name')
    await wrapper.get('#email').setValue('dealer@example.com')
    await wrapper.get('#companyname').setValue('Tumex')
    await wrapper.get('#password').setValue('secret123')
    await wrapper.get('#telephone').setValue('123456')
    await wrapper.get('#address').setValue('Istanbul')
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    expect(error).toHaveBeenCalledWith(
      'Sunucu hatasi, lutfen daha sonra tekrar deneyin',
      expect.objectContaining({ timeout: 3000 })
    )
  })
})
