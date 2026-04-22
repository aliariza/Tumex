<template>
  <section class="protected-layout">
    <div class="protected-layout__glow protected-layout__glow--left" aria-hidden="true"></div>
    <div class="protected-layout__glow protected-layout__glow--right" aria-hidden="true"></div>

    <div class="protected-layout__card">
      <template v-if="isAuthenticated">
        <p class="protected-layout__eyebrow">BAYİ ALANI • ERİŞİM AÇIK</p>
        <div class="protected-layout__copy">
          <h1>{{ title }}</h1>
          <p class="protected-layout__description">{{ description }}</p>
        </div>
      </template>

      <template v-else>
        <p class="protected-layout__eyebrow">Korunaklı Alan • Giriş Gerekli</p>
        <div class="protected-layout__copy">
          <h1>Erişim reddedildi</h1>
          <p class="protected-layout__description">
            Bu içerikleri görüntülemek için önce bayi girişi yapmanız gerekiyor.
            Giriş yaptıktan sonra korunaklı bayi sayfalarına devam edebilirsiniz.
          </p>
        </div>

        <div class="protected-layout__notice">
          <span class="protected-layout__notice-label">Yönlendirme</span>
          <p>Bayi giriş sayfasına dönerek hesabınızla erişim isteğinizi tamamlayabilirsiniz.</p>
        </div>

        <AuthActionButton variant="primary" @click="redirectToLogin">
          Bayi Girişine Dön
        </AuthActionButton>
      </template>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import AuthActionButton from '@/components/navigation/authentication/AuthActionButton.vue'

defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  }
})

const store = useStore()
const router = useRouter()

const isAuthenticated = computed(() => store.getters.isAuthenticated)

function redirectToLogin() {
  router.push('/iletisim/bayi')
}
</script>

<style scoped lang="scss">
.protected-layout {
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

.protected-layout__glow {
  position: absolute;
  width: 32rem;
  height: 32rem;
  border-radius: 50%;
  filter: blur(24px);
  opacity: 0.55;
  pointer-events: none;
}

.protected-layout__glow--left {
  top: 8rem;
  left: -12rem;
  background: rgba(0, 83, 156, 0.16);
}

.protected-layout__glow--right {
  right: -10rem;
  bottom: 4rem;
  background: rgba(46, 134, 171, 0.12);
}

.protected-layout__card {
  position: relative;
  width: min(100%, 78rem);
  padding: 4rem clamp(2rem, 4vw, 4.8rem);
  border: 1px solid rgba(17, 24, 39, 0.08);
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(247, 250, 252, 0.94));
  box-shadow: 0 2.4rem 6rem rgba(15, 23, 42, 0.12);
}

.protected-layout__card::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 1rem;
  background: linear-gradient(180deg, #00539c 0%, #2f79bb 100%);
}

.protected-layout__eyebrow {
  margin: 0 0 1.2rem;
  color: #00539c;
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.protected-layout__copy {
  max-width: 58rem;
}

h1 {
  margin: 0;
  max-width: 11ch;
  color: #102a43;
  font-size: clamp(4rem, 8vw, 6.4rem);
  line-height: 0.96;
  letter-spacing: -0.04em;
}

.protected-layout__description {
  max-width: 52rem;
  margin: 2rem 0 0;
  font-size: 1.8rem;
  line-height: 1.7;
  color: #486581;
}

.protected-layout__notice {
  display: inline-flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-top: 2.8rem;
  padding: 1.4rem 1.6rem;
  border: 1px dashed rgba(0, 83, 156, 0.26);
  background: rgba(255, 255, 255, 0.72);
}

.protected-layout__notice-label {
  color: #829ab1;
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.protected-layout__notice p {
  margin: 0;
  max-width: 48rem;
  color: #243b53;
  font-size: 1.5rem;
  line-height: 1.6;
}

:deep(.auth-action-button) {
  margin-top: 3rem;
  min-width: 22rem;
}

@media (max-width: 700px) {
  .protected-layout {
    min-height: calc(100vh - 16rem);
    padding-inline: 1.6rem;
  }

  .protected-layout__card {
    padding: 3rem 2rem 2.4rem;
  }

  :deep(.auth-action-button) {
    width: 100%;
    min-width: 0;
  }
}
</style>
