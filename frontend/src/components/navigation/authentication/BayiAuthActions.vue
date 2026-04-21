<template>
  <section class="dealer-auth">
    <p class="dealer-auth__eyebrow">Bayi Alanı</p>
    <h1>Bayi girişine hoş geldiniz</h1>
    <p class="dealer-auth__message">
      Hesabınız onaylandığında bayi fiyatları, korunaklı sayfalar ve özel içeriklere erişebilirsiniz.
    </p>

    <div class="buttons">
      <GirisCikis
        :active="activeButton === 'login'"
        @focus-login="setActiveButton('login')"
      />
      <AuthActionButton
        v-if="!isAuthenticated"
        :active="activeButton === 'register'"
        variant="light"
        @click="handleRegisterClick"
        @focus="setActiveButton('register')"
        @mouseenter="setActiveButton('register')"
      >
        KAYIT
      </AuthActionButton>
    </div>

    <div v-if="showReminder && !isAuthenticated" class="reminder">
      <span class="reminder__label">Erişim Talebi</span>
      <p>
        Erişim talebiniz e-posta ile tarafımıza iletilecektir.
        <br />
        Onaylandıktan sonra bayi sayfalarını kullanabilirsiniz.
      </p>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import GirisCikis from './GirisCikis.vue'
import AuthActionButton from './AuthActionButton.vue'
import { useAuthModals } from '@/composables/useAuthModals'

const store = useStore()
const { openRegisterModal } = useAuthModals()
const showReminder = ref(false)
const activeButton = ref('login')
const isAuthenticated = computed(() => store.getters.isAuthenticated)

function setActiveButton(buttonName) {
  activeButton.value = buttonName
}

function handleRegisterClick() {
  showReminder.value = true
  setActiveButton('register')
  openRegisterModal()
}
</script>

<style scoped lang="scss">
.dealer-auth {
  position: relative;
  z-index: 1;
  width: min(100%, 72rem);
  padding: 4rem clamp(2rem, 4vw, 4.8rem);
  border: 1px solid rgba(17, 24, 39, 0.08);
  border-radius: 0;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(247, 250, 252, 0.94));
  box-shadow: 0 2.4rem 6rem rgba(15, 23, 42, 0.12);
  text-align: left;
}

.dealer-auth::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 1rem;
  background: linear-gradient(180deg, #00539c 0%, #2f79bb 100%);
}

.dealer-auth__eyebrow {
  margin: 0 0 1.2rem;
  color: #00539c;
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  max-width: 11ch;
  color: #102a43;
  font-size: clamp(4rem, 8vw, 6.8rem);
  line-height: 0.95;
  letter-spacing: -0.04em;
}

.dealer-auth__message {
  max-width: 52rem;
  margin: 2rem 0 0;
  color: #486581;
  font-size: 1.8rem;
  line-height: 1.7;
}

.buttons {
  display: flex;
  gap: 1.2rem;
  flex-wrap: wrap;
  margin-top: 3rem;
}

.reminder {
  display: inline-flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-top: 2.8rem;
  padding: 1.4rem 1.6rem;
  border: 1px dashed rgba(0, 83, 156, 0.26);
  background: rgba(255, 255, 255, 0.72);
  color: #102a43;
}

.reminder__label {
  color: #829ab1;
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.reminder p {
  margin: 0;
  color: #486581;
  font-size: 1.6rem;
  line-height: 1.8;
}

@media (max-width: 700px) {
  .dealer-auth {
    padding: 3rem 2rem 2.4rem;
  }

  .buttons {
    flex-direction: column;
  }
}
</style>
