<!-- src/components/LogoutModal.vue -->
<template>
  <Modal :visible="showLogoutModal" @close="closeLogoutModal">
    <h2>Çıkış yapmak istediğinize emin misiniz?</h2>
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
  </Modal>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import Modal from './Modal.vue'
import AuthActionButton from './AuthActionButton.vue'

const store = useStore()
const router = useRouter()

const showLogoutModal = computed(() => store.getters.showLogoutModal)
const closeLogoutModal = () => store.dispatch('closeLogoutModal')
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
h2 {
  margin: 0 0 24px;
  font-size: 24px;
  line-height: 1.3;
  color: #1f2933;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
