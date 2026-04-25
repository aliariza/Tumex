<template>
  <nav class="dealer-subnav" aria-label="Bayi alt menüsü">
    <RouterLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="dealer-subnav__link"
      active-class="is-active"
    >
      <span class="dealer-subnav__eyebrow">{{ item.eyebrow }}</span>
      <strong>{{ item.label }}</strong>
    </RouterLink>
  </nav>
</template>

<script setup>
import { RouterLink } from 'vue-router'

defineOptions({ name: 'DealerSubnav' })

const items = [
  { to: '/protected', label: 'Bayi Paneli', eyebrow: 'Merkez' },
  { to: '/protected/abkant', label: 'Abkant', eyebrow: 'Ürün Grubu' },
  { to: '/protected/laser', label: 'Lazer Kesim', eyebrow: 'Ürün Grubu' }
]
</script>

<style scoped lang="scss">
.dealer-subnav {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.dealer-subnav__link {
  display: grid;
  gap: 0.5rem;
  padding: 1.4rem 1.6rem;
  border: 1px solid rgba(16, 42, 67, 0.1);
  background: rgba(248, 251, 255, 0.92);
  color: #102a43;
  text-decoration: none;
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;

  strong {
    font-size: 1.7rem;
    line-height: 1.25;
  }

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(0, 83, 156, 0.2);
    box-shadow: 0 1.4rem 2.6rem rgba(15, 23, 42, 0.08);
  }

  &.is-active {
    background: #102a43;
    border-color: #102a43;
    color: #fff;
    box-shadow: 0 1.4rem 2.6rem rgba(16, 42, 67, 0.16);
  }
}

.dealer-subnav__eyebrow {
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #2f79bb;
}

.dealer-subnav__link.is-active .dealer-subnav__eyebrow {
  color: rgba(255, 255, 255, 0.78);
}
</style>
