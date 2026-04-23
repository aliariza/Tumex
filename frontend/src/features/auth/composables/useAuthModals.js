import { computed } from 'vue'
import { useStore } from 'vuex'
import { AUTH_MODAL_NAMES } from '@/features/auth/components/authModalNames'

export function useAuthModals() {
  const store = useStore()

  const activeAuthModal = computed(() => store.getters.activeAuthModal)
  const showLoginModal = computed(() => store.getters.showLoginModal)
  const showLogoutModal = computed(() => store.getters.showLogoutModal)
  const showRegisterModal = computed(() => store.getters.showRegisterModal)

  function openAuthModal(modalName) {
    return store.dispatch('openAuthModal', modalName)
  }

  function closeAuthModal() {
    return store.dispatch('closeAuthModal')
  }

  function openLoginModal() {
    return openAuthModal(AUTH_MODAL_NAMES.login)
  }

  function closeLoginModal() {
    return closeAuthModal()
  }

  function openLogoutModal() {
    return openAuthModal(AUTH_MODAL_NAMES.logout)
  }

  function closeLogoutModal() {
    return closeAuthModal()
  }

  function openRegisterModal() {
    return openAuthModal(AUTH_MODAL_NAMES.register)
  }

  function closeRegisterModal() {
    return closeAuthModal()
  }

  return {
    activeAuthModal,
    closeAuthModal,
    closeLoginModal,
    closeLogoutModal,
    closeRegisterModal,
    openAuthModal,
    openLoginModal,
    openLogoutModal,
    openRegisterModal,
    showLoginModal,
    showLogoutModal,
    showRegisterModal
  }
}
