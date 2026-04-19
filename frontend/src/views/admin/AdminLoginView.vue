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

<script>
import api from '../../lib/api'

export default {
  name: 'AdminLoginView',
  data() {
    return {
      loading: false,
      error: '',
      form: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    async handleLogin() {
      this.loading = true
      this.error = ''

      sessionStorage.removeItem('token')
      sessionStorage.removeItem('isAuthenticated')
      sessionStorage.removeItem('role')


      const payload = {
        email: this.form.email.trim(),
        password: this.form.password
      }

      try {
        const { data } = await api.post('/login', payload)

        sessionStorage.setItem('token', data.token)
        sessionStorage.setItem('isAuthenticated', 'true')
        sessionStorage.setItem('role', data.role)

        if (data.role !== 'admin') {
          this.error = 'Bu alan sadece admin içindir.'
          sessionStorage.removeItem('token')
          sessionStorage.removeItem('isAuthenticated')
          sessionStorage.removeItem('role')
          return
        }

        this.$router.replace({ name: 'AdminMachines' })
      } catch (error) {
        this.error = error.response?.data?.message || 'Giriş başarısız'
      } finally {
        this.loading = false
      }
    }
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