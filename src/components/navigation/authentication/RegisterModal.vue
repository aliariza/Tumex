<template>
  <Modal :visible="showRegisterModal" @close="closeRegisterModal">
    <h2>Kayıt</h2>
    <form autocomplete="off" @submit.prevent="handleRegister">
      <div class="form-group" :class="{ 'has-error': form.errors.username }">
        <label for="username" class="sr-only">Kullanıcı adı</label>
        <input
          id="username"
          v-model="form.username"
          type="text"
          name="register-username"
          autocomplete="off"
          placeholder="Kullanıcı adı"
        />
        <span v-if="form.errors.username" class="error-message">{{ form.errors.username }}</span>
      </div>
      <div class="form-group" :class="{ 'has-error': form.errors.email }">
        <label for="email" class="sr-only">E-posta</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          name="register-email"
          autocomplete="off"
          placeholder="E-posta"
        />
        <span v-if="form.errors.email" class="error-message">{{ form.errors.email }}</span>
      </div>
      <div class="form-group" :class="{ 'has-error': form.errors.companyname }">
        <label for="companyname" class="sr-only">Şirket adı</label>
        <input
          id="companyname"
          v-model="form.companyname"
          type="text"
          name="register-company"
          autocomplete="organization"
          placeholder="Şirket adı"
        />
        <span v-if="form.errors.companyname" class="error-message">{{ form.errors.companyname }}</span>
      </div>
      <div class="form-group" :class="{ 'has-error': form.errors.password }">
        <label for="password" class="sr-only">Şifre</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          name="register-password"
          autocomplete="new-password"
          placeholder="Şifre"
        />
        <span v-if="form.errors.password" class="error-message">{{ form.errors.password }}</span>
      </div>
      <div class="form-group" :class="{ 'has-error': form.errors.telephone }">
        <label for="telephone" class="sr-only">Telefon</label>
        <input
          id="telephone"
          v-model="form.telephone"
          type="text"
          name="register-telephone"
          autocomplete="tel"
          placeholder="Telefon"
        />
        <span v-if="form.errors.telephone" class="error-message">{{ form.errors.telephone }}</span>
      </div>
      <div class="form-group" :class="{ 'has-error': form.errors.address }">
        <label for="address" class="sr-only">Adres</label>
        <input
          id="address"
          v-model="form.address"
          type="text"
          name="register-address"
          autocomplete="street-address"
          placeholder="Adres"
        />
        <span v-if="form.errors.address" class="error-message">{{ form.errors.address }}</span>
      </div>
      <button type="submit">Kayıt</button>
    </form>
  </Modal>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import Modal from './Modal.vue'
import { useToast } from 'vue-toastification'
import api from '@/lib/api'
import { isValidEmail, showRequestErrorToast, TOAST_OPTIONS } from './authHelpers'
import { useAuthForm } from './useAuthForm'

const createRegisterForm = () => ({
  username: '',
  email: '',
  companyname: '',
  password: '',
  telephone: '',
  address: '',
  errors: {}
})

const store = useStore()
const toast = useToast()
const showRegisterModal = computed(() => store.getters.showRegisterModal)
const { form, submitForm } = useAuthForm(createRegisterForm, showRegisterModal)
const closeRegisterModal = () => store.dispatch('closeRegisterModal')

function validateForm() {
  form.errors = {}

  if (!form.username) {
    form.errors.username = 'Kullanıcı adı gerekli'
  }

  if (!form.email) {
    form.errors.email = 'E-posta gerekli'
  } else if (!isValidEmail(form.email)) {
    form.errors.email = 'Geçerli e-posta gerekli'
  }

  if (!form.companyname) {
    form.errors.companyname = 'Şirket adı gerekli'
  }

  if (!form.password) {
    form.errors.password = 'Şifre gerekli'
  } else if (form.password.length < 6) {
    form.errors.password = 'Şifre minimum 6 hane olmalıdır'
  }

  if (!form.telephone) {
    form.errors.telephone = 'Telefon no. gerekli'
  }

  if (!form.address) {
    form.errors.address = 'Adres gerekli'
  }

  return Object.keys(form.errors).length === 0
}

async function handleRegister() {
  await submitForm(validateForm, async () => {
    try {
      const response = await api.post('/register', {
        username: form.username,
        email: form.email,
        companyname: form.companyname,
        password: form.password,
        telephone: form.telephone,
        address: form.address
      })

      if (response.status === 201) {
        toast.success(response.data.message, TOAST_OPTIONS)
        await closeRegisterModal()
      }
    } catch (error) {
      showRequestErrorToast(toast, error, {
        400: error.response?.data.message || 'Gecersiz kayit bilgileri',
        500: 'Sunucu hatasi, lutfen daha sonra tekrar deneyin'
      })
    }
  })
}
</script>
<style scoped src="./auth-form.css"></style>
