<template>
  <div
    class="navigation desktop"
    :class="[
      `active-menu-${activeMenu}`,
      {
        'is-scrolled': isScrolled,
        'has-compact-logo': hasCompactLogo
      }
    ]"
  >
    <top-navigation :activeMenu="activeMenu" />
    <solutions-navigation v-if="activeMenu === 'solutions'" :compact="compactSolutionsNav" />
    <company-navigation v-if="activeMenu === 'company'" />
    <iletisim-navigation v-if="activeMenu === 'iletisim'" />
    <carrier-navigation v-if="activeMenu === 'carrier'" />
    <login-modal />
    <register-modal />
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
    <router-view v-slot="{ Component, route }">
      <transition name="page-transition" mode="out-in">
        <component :is="Component" :key="route.fullPath" />
      </transition>
    </router-view>
  </div>
  <site-footer v-if="showPublicFooter" />
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import TopNavigation from '@/features/site/components/navigation/Desktop/TopNavigation.vue'
import MobileNavigation from '@/features/site/components/navigation/Mobile/MobileNavigation.vue'
import SolutionsNavigation from '@/features/site/components/navigation/SolutionsNavigation.vue'
import CompanyNavigation from '@/features/site/components/navigation/CompanyNavigation.vue'
import IletisimNavigation from '@/features/site/components/navigation/IletisimNavigation.vue'
import CarrierNavigation from '@/features/site/components/navigation/CarrierNavigation.vue'
import TheWhatsapp from '@/shared/components/icons/TheWhatsapp.vue'
import LoginModal from '@/features/auth/components/LoginModal.vue'
import RegisterModal from '@/features/auth/components/RegisterModal.vue'
import LogoutModal from '@/features/auth/components/LogoutModal.vue'
import SiteFooter from '@/features/site/components/footer/SiteFooter.vue'

defineOptions({ name: 'App' })

const route = useRoute()
const isScrolled = ref(false)
let touchStartY = 0
const inputDirectionThreshold = 8

const activeMenu = computed(() => {
  const path = route.path
  if (path.startsWith('/protected')) return 'dealer'
  if (path.startsWith('/kariyer')) return 'carrier'
  if (path.startsWith('/iletisim')) return 'iletisim'
  if (path === '/company' || path === '/hakkinda' || path === '/durmark-tarihce') return 'company'
  return 'solutions'
})

const showPublicFooter = computed(() => {
  const path = route.path
  return !path.startsWith('/admin') && !path.startsWith('/protected')
})

const hasSelectedMachineGroup = computed(
  () => route.path.startsWith('/abkant') || route.path.startsWith('/laser-cutting')
)

const compactSolutionsNav = computed(() => isScrolled.value && hasSelectedMachineGroup.value)
const hasCompactLogo = computed(() => {
  if (!isScrolled.value) return false
  return activeMenu.value !== 'solutions' || hasSelectedMachineGroup.value
})

function resetAtPageTop() {
  if (window.scrollY <= 0) {
    isScrolled.value = false
  }
}

function applyInputDirection(deltaY) {
  if (Math.abs(deltaY) < inputDirectionThreshold) {
    return
  }

  if (deltaY > 0 && window.scrollY > 0) {
    isScrolled.value = true
  } else if (deltaY < 0) {
    isScrolled.value = false
  }
}

function handleWheel(event) {
  applyInputDirection(event.deltaY)
}

function handleTouchStart(event) {
  touchStartY = event.touches?.[0]?.clientY || 0
}

function handleTouchMove(event) {
  const currentTouchY = event.touches?.[0]?.clientY || touchStartY
  applyInputDirection(touchStartY - currentTouchY)
  touchStartY = currentTouchY
}

function handleKeydown(event) {
  const scrollDownKeys = ['ArrowDown', 'PageDown', ' ', 'Spacebar', 'End']
  const scrollUpKeys = ['ArrowUp', 'PageUp', 'Home']

  if (scrollDownKeys.includes(event.key)) {
    applyInputDirection(inputDirectionThreshold + 1)
  } else if (scrollUpKeys.includes(event.key)) {
    applyInputDirection(-(inputDirectionThreshold + 1))
  }
}

onMounted(() => {
  resetAtPageTop()
  window.addEventListener('scroll', resetAtPageTop, { passive: true })
  window.addEventListener('wheel', handleWheel, { passive: true })
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('touchstart', handleTouchStart, { passive: true })
  window.addEventListener('touchmove', handleTouchMove, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', resetAtPageTop)
  window.removeEventListener('wheel', handleWheel)
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('touchstart', handleTouchStart)
  window.removeEventListener('touchmove', handleTouchMove)
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
  position: sticky;
  top: 0;
  z-index: 1000;
  background: var(--c-background-nav-top);
  transition: box-shadow 0.7s ease;

  @media only screen and (max-width: 1040px) {
    display: none;
  }
}

.desktop.is-scrolled {
  box-shadow: 0 0.8rem 1.6rem rgba(0, 0, 0, 0.12);
}

.desktop :deep(.top-nav),
.desktop :deep(.top-nav li),
.desktop :deep(.solutions-nav li),
.desktop :deep(.company-nav li),
.desktop :deep(.contact-nav li),
.desktop :deep(.carrier-nav li),
.desktop :deep(.abkant-nav ul),
.desktop :deep(.laser-cutting-nav ul),
.desktop :deep(.abkant-nav li),
.desktop :deep(.laser-cutting-nav li),
.desktop :deep(.abkant-nav),
.desktop :deep(.laser-cutting-nav),
.desktop :deep(.company-nav),
.desktop :deep(.contact-nav),
.desktop :deep(.carrier-nav) {
  transition:
    box-shadow 0.7s ease,
    background-color 0.7s ease;
}

.desktop :deep(.top-nav .logo) {
  transform-origin: center right;
  transition:
    width 0.65s ease,
    height 0.65s ease,
    padding 0.65s ease;
}

.desktop :deep(.top-nav .logo svg) {
  transition: height 0.65s ease;
}

.desktop.has-compact-logo :deep(.top-nav .logo) {
  width: 20.5rem;
  height: 8.2rem;
  justify-content: center;
  padding: 1.1rem 2.4rem;
  transform: none;
}

.desktop.has-compact-logo :deep(.top-nav .logo svg) {
  height: 5.9rem;
}

.desktop.active-menu-company :deep(.top-nav .logo),
.desktop.active-menu-iletisim :deep(.top-nav .logo),
.desktop.active-menu-carrier :deep(.top-nav .logo) {
  width: 20.5rem;
  height: 10rem;
  justify-content: center;
  padding: 1.6rem 2.4rem;
}

.desktop.active-menu-company :deep(.top-nav .logo svg),
.desktop.active-menu-iletisim :deep(.top-nav .logo svg),
.desktop.active-menu-carrier :deep(.top-nav .logo svg) {
  height: 6.4rem;
}

.desktop.is-scrolled :deep(.company-nav),
.desktop.is-scrolled :deep(.contact-nav),
.desktop.is-scrolled :deep(.carrier-nav),
.desktop.is-scrolled :deep(.abkant-nav),
.desktop.is-scrolled :deep(.laser-cutting-nav) {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.16);
}

.mobile {
  display: none;
  @media only screen and (max-width: 1040px) {
    display: block;
  }
}

.router-view {
  overflow-x: hidden;
}

.page-transition-enter-active,
.page-transition-leave-active {
  transition:
    opacity 0.45s ease,
    transform 0.45s ease;
}

.page-transition-enter-from {
  opacity: 0;
  transform: translateY(1.2rem);
}

.page-transition-leave-to {
  opacity: 0;
  transform: translateY(-0.8rem);
}

@media (prefers-reduced-motion: reduce) {
  .page-transition-enter-active,
  .page-transition-leave-active {
    transition: none;
  }

  .page-transition-enter-from,
  .page-transition-leave-to {
    transform: none;
  }
}
</style>
