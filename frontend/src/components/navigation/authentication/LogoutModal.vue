<!-- src/components/LogoutModal.vue -->
<template>
  <Modal :visible="showLogoutModal" @close="closeLogoutModal">
    <div class="logout-modal">
      <p class="logout-modal__eyebrow">Oturum • Çıkış Onayı</p>
      <h2>Çıkış yapmak istediğinize emin misiniz?</h2>
      <p class="logout-modal__message">
        Bu işlem mevcut bayi oturumunuzu kapatır. Korunaklı sayfalara yeniden erişmek için
        tekrar giriş yapmanız gerekir.
      </p>

      <div class="logout-modal__notice">
        <span class="logout-modal__notice-label">Bilgi</span>
        <p>İsterseniz oturumunuzu açık bırakabilir ve kaldığınız yerden devam edebilirsiniz.</p>
      </div>

      <div class="actions">
      <AuthActionButton
        :active="activeButton === 'cancel'"
        :variant="activeButton === 'cancel' ? 'primary' : 'secondary'"
        @click="closeLogoutModal"
        @focus="setActiveButton('cancel')"
        @mouseenter="setActiveButton('cancel')"
      >
        Hayır
      </AuthActionButton>
      <AuthActionButton
        :active="activeButton === 'confirm'"
        :variant="activeButton === 'confirm' ? 'primary' : 'secondary'"
        @click="confirmLogout"
        @focus="setActiveButton('confirm')"
        @mouseenter="setActiveButton('confirm')"
      >
        Evet
      </AuthActionButton>
      </div>
    </div>
  </Modal>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Modal from './Modal.vue'
import AuthActionButton from './AuthActionButton.vue'
import { useAuthModals } from '@/composables/useAuthModals'

const store = useStore()
const router = useRouter()

const { showLogoutModal, closeLogoutModal } = useAuthModals()
const logout = () => store.dispatch('logout')
const activeButton = ref('cancel')

watch(showLogoutModal, (isVisible) => {
  if (isVisible) {
    activeButton.value = 'cancel'
  }
})

function setActiveButton(buttonName) {
  activeButton.value = buttonName
}

async function confirmLogout() {
  await logout()
  await closeLogoutModal()
  router.push('/')
}
</script>

<style scoped>
.logout-modal__eyebrow {
  margin: 0 0 10px;
  color: #00539c;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

h2 {
  margin: 0;
  font-size: 24px;
  line-height: 1.3;
  color: #1f2933;
}

.logout-modal__message {
  margin: 14px 0 0;
  color: #52606d;
  font-size: 15px;
  line-height: 1.7;
}

.logout-modal__notice {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 24px;
  padding: 14px 16px;
  border: 1px dashed rgba(0, 83, 156, 0.26);
  background: rgba(247, 250, 252, 0.95);
}

.logout-modal__notice-label {
  color: #829ab1;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.logout-modal__notice p {
  margin: 0;
  color: #243b53;
  font-size: 14px;
  line-height: 1.6;
}

.actions {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}

.actions :deep(.auth-action-button) {
  margin: 0;
}

@media (max-width: 640px) {
  .actions {
    flex-direction: column-reverse;
  }

  .actions :deep(.auth-action-button) {
    width: 100%;
  }
}
</style>
