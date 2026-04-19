<template>
  <Modal :visible="showLoginModal" @close="closeLoginModal">
    <h2>Giriş</h2>
    <form autocomplete="off" @submit.prevent="handleLogin">
      <div class="form-group" :class="{ 'has-error': form.errors.email }">
        <label for="email" class="sr-only">Email</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          name="login-email"
          autocomplete="username"
          placeholder="E-posta"
        />
        <span v-if="form.errors.email" class="error-message">{{ form.errors.email }}</span>
      </div>
      <div class="form-group" :class="{ 'has-error': form.errors.password }">
        <label for="password" class="sr-only">Password</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          name="login-password"
          autocomplete="current-password"
          placeholder="Şifre"
        />
        <span v-if="form.errors.password" class="error-message">{{ form.errors.password }}</span>
      </div>
      <button type="submit">Giriş</button>
    </form>
  </Modal>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Modal from './Modal.vue'
import { useToast } from 'vue-toastification'
import api from '@/lib/api'
import {
  showRequestErrorToast,
  TOAST_OPTIONS,
  validateEmailField,
  validateRequiredField
} from './authHelpers'
import { useAuthForm } from './useAuthForm'

const createLoginForm = () => ({
  email: '',
  password: '',
  errors: {}
})

const store = useStore()
const router = useRouter()
const toast = useToast()
const showLoginModal = computed(() => store.getters.showLoginModal)
const { form, submitForm } = useAuthForm(createLoginForm, showLoginModal)
const closeLoginModal = () => store.dispatch('closeLoginModal')
const setAuthentication = (value) => store.dispatch('setAuthentication', value)

function validateForm() {
  form.errors = {}

  validateEmailField(form.errors, 'email', form.email, 'E-posta gerekli', 'Geçerli e-posta gerekli')
  validateRequiredField(form.errors, 'password', form.password, 'Şifre gerekli')

  return Object.keys(form.errors).length === 0
}

async function handleLogin() {
  await submitForm(validateForm, async () => {
    try {
      const response = await api.post('/login', {
        email: form.email,
        password: form.password
      })

      if (response.status === 200) {
        toast.success(response.data.message, TOAST_OPTIONS)
        await setAuthentication({ isAuthenticated: true, token: response.data.token })
        await closeLoginModal()
        router.push('/protected')
      }
    } catch (error) {
      showRequestErrorToast(toast, error, {
        401: 'E-posta veya sifre hatali',
        500: 'Sunucu hatasi, lutfen daha sonra tekrar deneyin'
      })
    }
  })
}
</script>
<style scoped src="./auth-form.css"></style>
