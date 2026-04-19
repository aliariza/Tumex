<template>
  <section class="protected-layout">
    <div v-if="isAuthenticated" class="protected-layout__content">
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
    </div>
    <div v-else class="protected-layout__empty">
      <h1>Erisim reddedildi</h1>
      <p>Bu icerigi gormek icin once bayi girisi yapmaniz gerekiyor.</p>
      <AuthActionButton variant="primary" @click="redirectToLogin">Bayi Girisine Don</AuthActionButton>
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

<style scoped>
.protected-layout {
  min-height: 40vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
}

.protected-layout__content,
.protected-layout__empty {
  max-width: 720px;
  text-align: center;
}

h1 {
  margin: 0 0 16px;
  font-size: clamp(3rem, 4vw, 4.6rem);
  line-height: 1.08;
  color: #15314b;
}

p {
  margin: 0;
  font-size: 1.8rem;
  line-height: 1.7;
  color: #4b5563;
}

.protected-layout__empty :deep(.auth-action-button) {
  margin-top: 24px;
}
</style>
