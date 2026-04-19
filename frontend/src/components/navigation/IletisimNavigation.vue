<template>
  <section class="contact-nav">
    <ul>
      <li :class="{ active: activeMenu === 'merkez' }">
        <router-link to="/iletisim/merkez-ofis">
          <h4>Merkez ofis</h4>
        </router-link>
      </li>
      <li :class="{ active: activeMenu === 'bayi' }">
        <router-link to="/iletisim/bayi">
          <h4>Bayi Giris</h4>
        </router-link>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({ name: 'IletisimNavigation' })

const route = useRoute()
const activeMenu = computed(() => {
  if (route.path === '/iletisim/bayi') return 'bayi'
  if (route.path === '/iletisim/servisler') return 'servisler'
  return 'merkez'
})
</script>

<style lang="scss" scoped>
.contact-nav {
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
  z-index: 5000;

  ul {
    background-color: var(--c-background-nav);
    padding-left: 2rem;

    li {
      height: 6rem;
      position: relative;
      cursor: pointer;
      display: flex;
      align-items: flex-end;
      padding-bottom: 1rem;
      width: 21%;

      h4 {
        color: var(--c-black);
        line-height: 2rem;
      }

      &:hover {
        cursor: pointer;
        h4 { color: var(--c-main); }
      }

      &.active {
        h4 { color: var(--c-main); font-weight: 600; }
      }
    }
  }
}
</style>
