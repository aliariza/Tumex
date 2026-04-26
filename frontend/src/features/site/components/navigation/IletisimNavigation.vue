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
          <h4>Bayi Giriş</h4>
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
  width: 100vw;
  position: relative;
  z-index: 40;
  background-color: var(--c-background-nav);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.22);

  ul {
    display: flex;
    align-items: stretch;
    gap: 2.6rem;
    margin: 0;
    padding: 0 2rem 0 24.6rem;
    list-style: none;

    li {
      height: 6rem;
      position: relative;
      cursor: pointer;
      display: flex;
      align-items: center;
      flex: 0 0 auto;

      a {
        display: flex;
        align-items: center;
        height: 100%;
        text-decoration: none;
      }

      h4 {
        color: var(--c-black);
        line-height: 2rem;
        white-space: nowrap;
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
