<template>
  <section class="solutions-nav" :class="{ 'is-hidden': compact }">
    <ul>
      <li :class="{ active: activeMenu === 'abkant' }">
        <router-link to="/abkant">
          <h4>
            Abkant <br />
            Makineleri
          </h4>
        </router-link>
      </li>
      <li :class="{ active: activeMenu === 'laser-cutting' }">
        <router-link to="/laser-cutting">
          <h4>
            Lazer Kesim<br />
            Makineleri
          </h4>
        </router-link>
      </li>
    </ul>
  </section>
  <nav
    class="compact-series-nav"
    :class="{ 'is-visible': compact && activeMenu }"
    aria-label="Aktif makine yolu"
  >
    <router-link :to="activeCategoryPath">{{ activeCategoryLabel }}</router-link>
    <span v-if="activeSeriesLabel" class="compact-series-nav__separator">›</span>
    <span v-if="activeSeriesLabel" class="compact-series-nav__current">{{ activeSeriesLabel }}</span>
  </nav>
  <div class="series-nav-shell" :class="{ 'is-hidden': compact || !activeMenu }">
    <abkant-navigation v-if="activeMenu === 'abkant'" />
    <laser-cutting-navigation v-else-if="activeMenu === 'laser-cutting'" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AbkantNavigation from './AbkantNavigation.vue'
import LaserCuttingNavigation from './LaserCuttingNavigation.vue'

defineProps({
  compact: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()
const activeMenu = computed(() => {
  if (route.path.startsWith('/abkant')) return 'abkant'
  if (route.path.startsWith('/laser-cutting')) return 'laser-cutting'
  return null
})

const activeCategoryLabel = computed(() =>
  activeMenu.value === 'abkant' ? 'Abkant Makineleri' : 'Lazer Kesim Makineleri'
)

const activeCategoryPath = computed(() =>
  activeMenu.value === 'abkant' ? '/abkant' : '/laser-cutting'
)

const activeSeriesLabel = computed(() => {
  const series = route.params.productType
  if (!series) return ''

  return `${String(series)} - serisi`
})
</script>

<style scoped lang="scss">
.solutions-nav {
  width: 100vw;
  background-color: var(--c-main);
  padding-inline: 1rem;
  max-height: 6rem;
  opacity: 1;
  overflow: hidden;
  transition:
    max-height 0.85s ease,
    opacity 0.65s ease;

  &.is-hidden {
    max-height: 0;
    opacity: 0;
    pointer-events: none;
  }

  ul {
    li {
      height: 6rem;
      position: relative;
      cursor: pointer;
      display: flex;
      align-items: center;
      border-right: 2px solid var(--c-white);
      width: 21%;
      h4 {
        color: var(--c-white-mute);
        line-height: 2rem;
      }

      &.active {
        h4 {
          color: var(--c-white);
          font-weight: 700;
        }
      }
      &.active::after {
        content: '';
        position: absolute;
        bottom: 2px;
        left: 50%;
        width: 0;
        height: 0;
        border-left: 0.8rem solid transparent;
        border-right: 0.8rem solid transparent;
        border-bottom: 0.8rem solid var(--c-white);
        transform: translateX(-50%);
      }
    }
  }
}

.compact-series-nav {
  position: relative;
  z-index: 40;
  width: 100vw;
  height: 0;
  display: flex;
  align-items: center;
  gap: 1.4rem;
  padding-left: 2.2rem;
  background-color: var(--c-background-nav);
  color: var(--c-grey);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.22);
  font-size: 1.45rem;
  opacity: 0;
  overflow: hidden;
  pointer-events: none;
  transition:
    height 0.85s ease,
    opacity 0.65s ease;
}

.compact-series-nav.is-visible {
  height: 4.2rem;
  opacity: 1;
  pointer-events: auto;
}

.series-nav-shell {
  max-height: 5rem;
  opacity: 1;
  overflow: hidden;
  transition:
    max-height 0.85s ease,
    opacity 0.65s ease;
}

.series-nav-shell.is-hidden {
  max-height: 0;
  opacity: 0;
  pointer-events: none;
}

.compact-series-nav a {
  color: var(--c-grey);
  text-decoration: none;
}

.compact-series-nav a:hover {
  color: var(--c-main);
}

.compact-series-nav__separator {
  color: #999;
  font-size: 2.2rem;
  line-height: 1;
}

.compact-series-nav__current {
  color: var(--c-main);
}

</style>
