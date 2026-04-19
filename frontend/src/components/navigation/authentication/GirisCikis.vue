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
import { AUTH_MODAL_NAMES } from './authModalNames'
import AuthActionButton from './AuthActionButton.vue'

defineEmits(['focus-login'])
defineProps({
  active: {
    type: Boolean,
    default: false
  }
})

const store = useStore()
const isAuthenticated = computed(() => store.getters.isAuthenticated)
const buttonLabel = computed(() => (isAuthenticated.value ? 'ÇIKIŞ' : 'GİRİŞ'))

function handleButtonClick() {
  const modalName = isAuthenticated.value ? AUTH_MODAL_NAMES.logout : AUTH_MODAL_NAMES.login
  store.dispatch('openAuthModal', modalName)
}
</script>
