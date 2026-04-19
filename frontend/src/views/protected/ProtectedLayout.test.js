import { mount } from '@vue/test-utils'
import { createStore } from 'vuex'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import ProtectedLayout from './ProtectedLayout.vue'

const push = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push
  })
}))

function createTestStore(isAuthenticated) {
  return createStore({
    getters: {
      isAuthenticated: () => isAuthenticated
    }
  })
}

describe('ProtectedLayout', () => {
  beforeEach(() => {
    push.mockReset()
  })

  it('renders the protected content for authenticated users', () => {
    const wrapper = mount(ProtectedLayout, {
      props: {
        title: 'Protected Title',
        description: 'Protected description'
      },
      global: {
        plugins: [createTestStore(true)]
      }
    })

    expect(wrapper.text()).toContain('Protected Title')
    expect(wrapper.text()).toContain('Protected description')
    expect(wrapper.text()).not.toContain('Erisim reddedildi')
  })

  it('shows the denial state and redirects to login when prompted', async () => {
    const wrapper = mount(ProtectedLayout, {
      props: {
        title: 'Protected Title',
        description: 'Protected description'
      },
      global: {
        plugins: [createTestStore(false)]
      }
    })

    expect(wrapper.text()).toContain('Erisim reddedildi')
    expect(wrapper.text()).toContain('Bayi Girisine Don')

    await wrapper.get('button').trigger('click')

    expect(push).toHaveBeenCalledWith('/iletisim/bayi')
  })
})
