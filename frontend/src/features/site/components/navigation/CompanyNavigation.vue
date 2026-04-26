<template>
  <section class="company-nav">
    <ul>
      <li :class="{ active: activeMenu === 'hakkinda' }">
        <router-link to="/hakkinda">
          <h4>Tumex Hakkında</h4>
        </router-link>
      </li>
      <li :class="{ active: activeMenu === 'tarihce' }">
        <router-link to="/durmark-tarihce">
          <h4>Durmark Tarihçe</h4>
        </router-link>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({ name: 'CompanyNavigation' })

const route = useRoute()
const activeMenu = computed(() =>
  route.path === '/durmark-tarihce' ? 'tarihce' : 'hakkinda'
)
</script>

<style lang="scss" scoped>
.company-nav {
  width: 100vw;
  position: relative;
  z-index: 40;
  background-color: var(--c-background-nav);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.22);

  ul {
    display: flex;
    align-items: stretch;
    gap: 3.2rem;
    margin: 0;
    padding: 0 2rem 0 11.2rem;
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
