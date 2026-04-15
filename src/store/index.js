import { createStore } from 'vuex'
import api from '../lib/api'
import { AUTH_MODAL_NAMES } from '@/components/navigation/authentication/authModalNames'

const SESSION_AUTH_KEY = 'isAuthenticated'
const SESSION_TOKEN_KEY = 'token'

function syncAuthSession(isAuthenticated, token) {
  sessionStorage.setItem(SESSION_AUTH_KEY, isAuthenticated)
  sessionStorage.setItem(SESSION_TOKEN_KEY, token)
}

function clearAuthSession() {
  sessionStorage.removeItem(SESSION_AUTH_KEY)
  sessionStorage.removeItem(SESSION_TOKEN_KEY)
}

const store = createStore({
  state: {
    activeAuthModal: null,
    isAuthenticated: sessionStorage.getItem(SESSION_AUTH_KEY) === 'true',
    token: sessionStorage.getItem(SESSION_TOKEN_KEY) || null
  },
  mutations: {
    setActiveAuthModal(state, modalName) {
      state.activeAuthModal = modalName
    },
    setAuthentication(state, { isAuthenticated, token }) {
      state.isAuthenticated = isAuthenticated
      state.token = token
      syncAuthSession(isAuthenticated, token)
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
        const response = await api.post('/login', credentials)
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
    openLoginModal({ dispatch }) {
      dispatch('openAuthModal', AUTH_MODAL_NAMES.login)
    },
    closeLoginModal({ dispatch }) {
      dispatch('closeAuthModal')
    },
    openLogoutModal({ dispatch }) {
      dispatch('openAuthModal', AUTH_MODAL_NAMES.logout)
    },
    closeLogoutModal({ dispatch }) {
      dispatch('closeAuthModal')
    },
    openRegisterModal({ dispatch }) {
      dispatch('openAuthModal', AUTH_MODAL_NAMES.register)
    },
    closeRegisterModal({ dispatch }) {
      dispatch('closeAuthModal')
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

export default store
