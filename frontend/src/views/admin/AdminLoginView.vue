<template>
  <div class="admin-login">
    <div class="login-card">
      <h1>Admin Girişi</h1>
      <p>Yönetim paneline erişmek için giriş yapın.</p>

      <form @submit.prevent="handleLogin">
        <input
          v-model="form.email"
          type="email"
          placeholder="E-posta"
          required
        />
        <input
          v-model="form.password"
          type="password"
          placeholder="Şifre"
          required
        />

        <button type="submit" :disabled="loading">
          {{ loading ? 'Giriş yapılıyor...' : 'Giriş Yap' }}
        </button>
      </form>

      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../lib/api'
import { clearAuthSession, setAuthSession } from '../../services/authSession'

defineOptions({ name: 'AdminLoginView' })

const router = useRouter()
const loading = ref(false)
const error = ref('')
const form = reactive({
  email: '',
  password: ''
})

async function handleLogin() {
  loading.value = true
  error.value = ''

  clearAuthSession()

  const payload = {
    email: form.email.trim(),
    password: form.password
  }

  try {
    const { data } = await api.post('/login', payload)

    if (data.role !== 'admin') {
      error.value = 'Bu alan sadece admin içindir.'
      clearAuthSession()
      return
    }

    setAuthSession({
      isAuthenticated: true,
      token: data.token,
      role: data.role
    })

    await router.replace({ name: 'AdminMachines' })
  } catch (requestError) {
    error.value = requestError.response?.data?.message || 'Giriş başarısız'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.admin-login {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
}

.login-card {
  width: 100%;
  max-width: 420px;
  padding: 24px;
  border: 1px solid #ddd;
  border-radius: 12px;
  background: white;
}

form {
  display: grid;
  gap: 12px;
  margin-top: 16px;
}

input,
button {
  padding: 12px;
  font-size: 16px;
}

.error {
  color: #c00;
  margin-top: 12px;
}
</style>
