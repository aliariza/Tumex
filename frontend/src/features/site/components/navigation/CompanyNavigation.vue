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
  position: relative;
  z-index: 40;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.22);

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
      width: 13%;
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
