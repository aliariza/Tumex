<template>
  <section class="admin-login">
    <div class="admin-login__glow admin-login__glow--left" aria-hidden="true"></div>
    <div class="admin-login__glow admin-login__glow--right" aria-hidden="true"></div>

    <div class="login-card">
      <p class="login-card__eyebrow">Yönetim Paneli • Güvenli Giriş</p>
      <h1>Admin Girişi</h1>
      <p class="login-card__message">Yönetim paneline erişmek için giriş yapın.</p>

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

      <div class="login-card__notice">
        <span class="login-card__notice-label">Yetkilendirme</span>
        <p>Sadece admin rolüne sahip kullanıcılar yönetim alanına erişebilir.</p>
      </div>

      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </section>
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

<style scoped lang="scss">
.admin-login {
  position: relative;
  min-height: calc(100vh - 22rem);
  display: grid;
  place-items: center;
  padding: 6rem 2rem 8rem;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(240, 247, 255, 0.95) 0%, rgba(255, 255, 255, 1) 58%),
    repeating-linear-gradient(
      -45deg,
      rgba(0, 83, 156, 0.035) 0,
      rgba(0, 83, 156, 0.035) 14px,
      rgba(255, 255, 255, 0.82) 14px,
      rgba(255, 255, 255, 0.82) 28px
    );
}

.admin-login__glow {
  position: absolute;
  width: 32rem;
  height: 32rem;
  border-radius: 50%;
  filter: blur(24px);
  opacity: 0.55;
}

.admin-login__glow--left {
  top: 8rem;
  left: -12rem;
  background: rgba(0, 83, 156, 0.16);
}

.admin-login__glow--right {
  right: -10rem;
  bottom: 4rem;
  background: rgba(231, 76, 60, 0.12);
}

.login-card {
  position: relative;
  width: 100%;
  max-width: 52rem;
  padding: 4rem clamp(2rem, 4vw, 4.8rem);
  border: 1px solid rgba(17, 24, 39, 0.08);
  border-radius: 0;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(247, 250, 252, 0.94));
  box-shadow: 0 2.4rem 6rem rgba(15, 23, 42, 0.12);
}

.login-card::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 1rem;
  background: linear-gradient(180deg, #00539c 0%, #2f79bb 100%);
}

.login-card__eyebrow {
  margin: 0 0 1.2rem;
  color: #00539c;
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  color: #102a43;
  font-size: clamp(3.8rem, 7vw, 5.8rem);
  line-height: 0.98;
  letter-spacing: -0.04em;
}

.login-card__message {
  margin: 1.8rem 0 0;
  max-width: 44rem;
  color: #486581;
  font-size: 1.7rem;
  line-height: 1.7;
}

form {
  display: grid;
  gap: 1.2rem;
  margin-top: 2.8rem;
}

input,
button {
  width: 100%;
  min-height: 5.6rem;
  padding: 1.4rem 1.5rem;
  font-size: 1.6rem;
  border-radius: 0;
  box-sizing: border-box;
}

input {
  border: 1px solid #cbd5e1;
  background: rgba(244, 247, 251, 0.95);
  color: #102a43;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

input::placeholder {
  color: #7b8794;
}

input:focus {
  outline: none;
  border-color: #00539c;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(0, 83, 156, 0.12);
}

button {
  margin-top: 0.2rem;
  border: 1px solid transparent;
  background: #00539c;
  color: #fff;
  font-weight: 800;
  letter-spacing: 0.02em;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease,
    opacity 0.2s ease;
}

button:hover:not(:disabled) {
  transform: translateY(-1px);
  background: #00437e;
  box-shadow: 0 1.2rem 2.6rem rgba(0, 83, 156, 0.2);
}

button:disabled {
  opacity: 0.78;
  cursor: wait;
}

.login-card__notice {
  display: inline-flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-top: 2.4rem;
  padding: 1.4rem 1.6rem;
  border: 1px dashed rgba(0, 83, 156, 0.26);
  background: rgba(255, 255, 255, 0.72);
}

.login-card__notice-label {
  color: #829ab1;
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.login-card__notice p {
  margin: 0;
  color: #243b53;
  font-size: 1.5rem;
  line-height: 1.6;
}

.error {
  margin: 1.6rem 0 0;
  color: #c53030;
  font-size: 1.4rem;
  font-weight: 700;
}

@media (max-width: 700px) {
  .admin-login {
    min-height: calc(100vh - 16rem);
    padding-inline: 1.6rem;
  }

  .login-card {
    padding: 3rem 2rem 2.4rem;
  }
}
</style>
