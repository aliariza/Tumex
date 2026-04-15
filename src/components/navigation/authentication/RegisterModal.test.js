import { flushPromises, mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import RegisterModal from './RegisterModal.vue'

const { success, apiPost } = vi.hoisted(() => ({
  success: vi.fn(),
  apiPost: vi.fn()
}))

vi.mock('vue-toastification', () => ({
  useToast: () => ({
    success
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
})
