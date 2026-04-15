<template>
  <section class="dealer-auth">
    <h1>Bayi girişine hoş geldiniz</h1>
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
    <p v-if="showReminder && !isAuthenticated" class="reminder">
      Kayit isleminiz sirketimiz tarafindan incelenecektir.
      <br />
      Eger kabul edilirse sifreniz gonderilecektir.
    </p>
    <RegisterModal />
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useStore } from 'vuex'
import GirisCikis from './GirisCikis.vue'
import RegisterModal from './RegisterModal.vue'
import AuthActionButton from './AuthActionButton.vue'
import { AUTH_MODAL_NAMES } from './authModalNames'

const store = useStore()
const showReminder = ref(false)
const activeButton = ref('login')
const isAuthenticated = computed(() => store.getters.isAuthenticated)

function setActiveButton(buttonName) {
  activeButton.value = buttonName
}

function handleRegisterClick() {
  showReminder.value = true
  setActiveButton('register')
  store.dispatch('openAuthModal', AUTH_MODAL_NAMES.register)
}
</script>

<style scoped>
.dealer-auth {
  text-align: center;
}

h1 {
  margin: 0;
  font-size: clamp(2.8rem, 4vw, 3.8rem);
  line-height: 1.1;
  color: #15314b;
}

.buttons {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.reminder {
  margin-top: 20px;
  color: #b91c1c;
  font-size: 1.6rem;
  line-height: 2.5rem;
}

</style>
