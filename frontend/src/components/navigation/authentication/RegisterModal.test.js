import { flushPromises, mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import RegisterModal from './RegisterModal.vue'

const { apiPost } = vi.hoisted(() => ({
  apiPost: vi.fn()
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
    expect(wrapper.getComponent({ name: 'AppToast' }).props()).toMatchObject({
      show: true,
      message: 'Kayit tamam',
      type: 'success'
    })
    expect(store.dispatch).toHaveBeenCalledWith('closeAuthModal')
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

    expect(wrapper.getComponent({ name: 'AppToast' }).props()).toMatchObject({
      show: true,
      message: 'Bu e-posta zaten kayıtlı',
      type: 'error'
    })
    expect(store.dispatch).not.toHaveBeenCalledWith('closeAuthModal')
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

    expect(wrapper.getComponent({ name: 'AppToast' }).props()).toMatchObject({
      show: true,
      message: 'Sunucu hatasi, lutfen daha sonra tekrar deneyin',
      type: 'error'
    })
  })
})
