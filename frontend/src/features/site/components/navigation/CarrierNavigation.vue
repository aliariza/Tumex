<template>
  <section class="carrier-nav">
    <ul>
      <li :class="{ active: activeMenu === 'tumex-calisma' }">
        <router-link to="/kariyer/tumex-calisma">
          <h4>Tumex'de çalışmak</h4>
        </router-link>
      </li>
      <li :class="{ active: activeMenu === 'acik-pozisyonlar' }">
        <router-link to="/kariyer/acik-pozisyonlar">
          <h4>Açık pozisyonlar</h4>
        </router-link>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({ name: 'CarrierNavigation' })

const route = useRoute()
const activeMenu = computed(() =>
  route.path === '/kariyer/acik-pozisyonlar' ? 'acik-pozisyonlar' : 'tumex-calisma'
)
</script>

<style lang="scss" scoped>
.carrier-nav {
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
