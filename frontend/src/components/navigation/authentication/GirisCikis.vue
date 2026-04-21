<!-- src/components/authentication/GirisCikis.vue -->
<template>
  <div>
    <AuthActionButton
      :active="active"
      :variant="active ? 'primary' : 'light'"
      @click="handleButtonClick"
      @focus="$emit('focus-login')"
      @mouseenter="$emit('focus-login')"
    >
      {{ buttonLabel }}
    </AuthActionButton>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import AuthActionButton from './AuthActionButton.vue'
import { useAuthModals } from '@/composables/useAuthModals'

defineEmits(['focus-login'])
defineProps({
  active: {
    type: Boolean,
    default: false
  }
})

const store = useStore()
const { openLoginModal, openLogoutModal } = useAuthModals()
const isAuthenticated = computed(() => store.getters.isAuthenticated)
const buttonLabel = computed(() => (isAuthenticated.value ? 'ÇIKIŞ' : 'GİRİŞ'))

function handleButtonClick() {
  if (isAuthenticated.value) {
    openLogoutModal()
    return
  }

  openLoginModal()
}
</script>
