<template>
  <section class="app-mobile-menu">
    <!-- Top bar with hamburger icon and logo -->
    <div class="top-bar">
      <button
        class="menu-icon"
        @click="toggleMenu"
        :aria-expanded="isMenuOpen"
        aria-controls="mobile-menu"
        :aria-label="isMenuOpen ? 'Menüyü kapat' : 'Menüyü aç'"
      >
        <div :class="{ bar: !isMenuOpen, cross: isMenuOpen }"></div>
        <div :class="{ bar: !isMenuOpen, none: isMenuOpen }"></div>
        <div :class="{ bar: !isMenuOpen, none: isMenuOpen }"></div>
      </button>
      <router-link to="/" @click="closeMenu">
        <div class="logo">
          <tumex-blue></tumex-blue>
        </div>
      </router-link>
    </div>

    <!-- Accordion-style mobile menu -->
    <nav id="mobile-menu" class="mobile-menu" :class="{ open: isMenuOpen }" aria-label="Ana menü">
      <mobile-menu-section
        title="Çözümler"
        :open="openSection === 'solutions'"
        :links="[
          { to: '/abkant', label: 'Abkant Tezgahları' },
          { to: '/laser-cutting', label: 'Lazer Kesim Tezgahları' }
        ]"
        @toggle="toggleSection('solutions')"
        @close-menu="closeMenu"
      />

      <mobile-menu-section
        title="Hakkımızda"
        :open="openSection === 'company'"
        :links="[
          { to: '/hakkinda', label: 'Tumex Hakkında' },
          { to: '/durmark-tarihce', label: 'Durmark Tarihçe' }
        ]"
        @toggle="toggleSection('company')"
        @close-menu="closeMenu"
      />

      <mobile-menu-section
        title="İletişim"
        :open="openSection === 'iletisim'"
        :links="[
          { to: '/iletisim/merkez-ofis', label: 'Merkez Ofis' }
        ]"
        @toggle="toggleSection('iletisim')"
        @close-menu="closeMenu"
      />
    </nav>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import TumexBlue from '../../../components/icons/TumexBlue.vue'
import MobileMenuSection from './MobileMenuSection.vue'

const isMenuOpen = ref(false)
const openSection = ref(null)

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value
  openSection.value = null
}

function closeMenu() {
  isMenuOpen.value = false
  openSection.value = null
}

function toggleSection(name) {
  openSection.value = openSection.value === name ? null : name
}
</script>

<style lang="scss">
.app-mobile-menu {
  text-align: center;
  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--c-background-nav);
    padding: 10px;
    .menu-icon {
      cursor: pointer;
      .bar {
        width: 2.5rem;
        height: 0.3rem;
        background-color: var(--c-main);
        margin: 0.6rem 0;
        transition: 0.4s;
      }
      .cross {
        position: relative;
        transform: rotate(-45deg);
        transition: 0.4s;
        &::before,
        &::after {
          content: '';
          position: absolute;
          width: 3rem;
          height: 0.3rem;
          background-color: var(--c-main);
          transition: 0.4s;
          top: 1rem;
        }
        &::after {
          transform: rotate(90deg);
        }
      }
      .none {
        display: none;
      }
    }
    .logo {
    }
  }
}

.mobile-menu {
  display: none;
  background-color: var(--c-background-nav-top);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
}
.alt-menu {
  display: none;
  color: var(--c-grey-dark);
  font-size: 2rem;
  background-color: var(--c-background-nav);
  text-align: start;
  padding-left: 1.75rem;
}

.mobile-menu.open,
.alt-menu.open {
  display: block;
}

.menu-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  height: 5rem;
}

.menu-header span {
  margin-right: 0.8rem;
  color: var(--c-grey-dark);
  transition: color 0.3s;
}

.mobile-menu.open .menu-header span {
  color: var(--c-main);
}

.menu-text {
  font-size: 2.5rem;
  color: var(--c-grey-dark);
  margin-left: 0.8rem;
}
.menu-item {
  height: 5rem;
  display: flex;
  align-items: center;
}
</style>
