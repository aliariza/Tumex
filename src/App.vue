<template>
  <div class="navigation desktop">
    <top-navigation :activeMenu="activeMenu" />
    <solutions-navigation v-if="activeMenu === 'solutions'" />
    <company-navigation v-if="activeMenu === 'company'" />
    <iletisim-navigation v-if="activeMenu === 'iletisim'" />
    <carrier-navigation v-if="activeMenu === 'carrier'" />
    <login-modal />
    <logout-modal />
  </div>
  <div class="mobile">
    <mobile-navigation />
  </div>
  <a
    href="https://wa.me/905303927259"
    id="whatsapp-button"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="WhatsApp ile iletişime geçin"
  >
    <div class="whatsapp-icon" aria-hidden="true"><the-whatsapp /></div>
  </a>
  <div class="router-view">
    <router-view :key="$route.fullPath"></router-view>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import TopNavigation from './components/navigation/Desktop/TopNavigation.vue'
import MobileNavigation from './components/navigation/Mobile/MobileNavigation.vue'
import SolutionsNavigation from './components/navigation/SolutionsNavigation.vue'
import CompanyNavigation from './components/navigation/CompanyNavigation.vue'
import IletisimNavigation from './components/navigation/IletisimNavigation.vue'
import CarrierNavigation from './components/navigation/CarrierNavigation.vue'
import TheWhatsapp from './components/icons/TheWhatsapp.vue'
import LoginModal from './components/navigation/authentication/LoginModal.vue'
import LogoutModal from './components/navigation/authentication/LogoutModal.vue'

defineOptions({ name: 'App' })

const route = useRoute()

const activeMenu = computed(() => {
  const path = route.path
  if (path.startsWith('/kariyer')) return 'carrier'
  if (path.startsWith('/iletisim')) return 'iletisim'
  if (path === '/company' || path === '/hakkinda' || path === '/durmark-tarihce') return 'company'
  return 'solutions'
})
</script>

<style scoped lang="scss">
#whatsapp-button {
  position: fixed;
  height: 10rem;
  width: 10rem;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
}
.desktop {
  display: block;
  @media only screen and (max-width: 1040px) {
    display: none;
  }
}
.mobile {
  display: none;
  @media only screen and (max-width: 1040px) {
    display: block;
  }
}
</style>
