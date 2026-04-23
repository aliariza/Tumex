<template>
  <section class="solutions-nav">
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
  <abkant-navigation v-if="activeMenu === 'abkant'" />
  <laser-cutting-navigation v-if="activeMenu === 'laser-cutting'" />
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AbkantNavigation from './AbkantNavigation.vue'
import LaserCuttingNavigation from './LaserCuttingNavigation.vue'

const route = useRoute()
const activeMenu = computed(() =>
  route.path.startsWith('/abkant') ? 'abkant' : 'laser-cutting'
)
</script>

<style scoped lang="scss">
.solutions-nav {
  width: 100vw;
  background-color: var(--c-main);
  padding-inline: 1rem;

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
</style>
