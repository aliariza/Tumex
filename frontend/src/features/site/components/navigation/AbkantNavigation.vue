<template>
  <section class="abkant-nav">
    <ul>
      <li v-for="(item, index) in items" :key="index" :class="{ active: isActiveItem(item) }">
        <router-link :to="item.href">
          <h5>{{ item.title }}<br />Abkant</h5>
        </router-link>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useMachineCatalog } from '@/features/machines/composables/useMachineCatalog.js'

defineOptions({ name: 'AbkantNavigation' })

const route = useRoute()
const { machineItems: items } = useMachineCatalog('abkant')

function isActiveItem(item) {
  return route.path === item.href || route.params.productType === item.title
}
</script>

<style lang="scss" scoped>
.abkant-nav {
  width: 100vw;
  position: relative;
  z-index: 40;
  background-color: var(--c-white-mute);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.22);
  overflow-x: hidden;

  ul {
    width: 100vw;
    padding-inline: 1rem;
    height: 5rem;
    li {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding-right: 7%;

      h5 {
        line-height: 2rem;
        color: var(--c-grey);
        &:hover {
          color: var(--c-main);
        }
      }

      &.active {
        h5 {
          color: var(--c-main);
        }
      }
    }
  }
}
</style>
