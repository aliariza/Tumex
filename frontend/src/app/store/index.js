import { createStore } from 'vuex'
import api from '@/shared/lib/api'
import { AUTH_MODAL_NAMES } from '@/features/auth/components/authModalNames'
import { clearAuthSession, getStoredAuthState, setAuthSession } from '@/services/authSession'

export function createAppStore(apiClient = api) {
  const authState = getStoredAuthState()

  return createStore({
    state: {
      activeAuthModal: null,
      isAuthenticated: authState.isAuthenticated,
      token: authState.token
    },
    mutations: {
      setActiveAuthModal(state, modalName) {
        state.activeAuthModal = modalName
      },
      setAuthentication(state, { isAuthenticated, token }) {
        state.isAuthenticated = isAuthenticated
        state.token = token
        setAuthSession({ isAuthenticated, token })
      },
      clearAuthentication(state) {
        state.isAuthenticated = false
        state.token = null
        clearAuthSession()
      }
    },
    actions: {
      async login({ commit }, credentials) {
        try {
          const response = await apiClient.post('/login', credentials)
          if (response.status === 200) {
            const token = response.data.token
            commit('setAuthentication', { isAuthenticated: true, token })
            commit('setActiveAuthModal', null)
          }
        } catch (error) {
          commit('clearAuthentication')
          throw error
        }
      },
      logout({ commit }) {
        commit('clearAuthentication')
        commit('setActiveAuthModal', null)
      },
      openAuthModal({ commit }, modalName) {
        commit('setActiveAuthModal', modalName)
      },
      closeAuthModal({ commit }) {
        commit('setActiveAuthModal', null)
      },
      setAuthentication({ commit }, value) {
        commit('setAuthentication', value)
      }
    },
    getters: {
      activeAuthModal: (state) => state.activeAuthModal,
      showLoginModal: (state) => state.activeAuthModal === AUTH_MODAL_NAMES.login,
      showLogoutModal: (state) => state.activeAuthModal === AUTH_MODAL_NAMES.logout,
      showRegisterModal: (state) => state.activeAuthModal === AUTH_MODAL_NAMES.register,
      isAuthenticated: (state) => state.isAuthenticated
    }
  })
}

const store = createAppStore()

export default store
