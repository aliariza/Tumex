<template>
  <nav class="admin-panel-nav" aria-label="Admin navigation">
    <RouterLink
      v-for="item in items"
      :key="item.to"
      :to="item.to"
      class="nav-link"
      active-class="is-active"
    >
      {{ item.label }}
    </RouterLink>
  </nav>
</template>

<script setup>
defineOptions({ name: 'AdminPanelNav' })

const items = [
  { label: 'Makine Yönetimi', to: '/admin/machines' },
  { label: 'Pozisyon Yönetimi', to: '/admin/job-positions' },
  { label: 'Kullanıcı Yönetimi', to: '/admin/users' }
]
</script>

<style scoped>
.admin-panel-nav {
  position: relative;
  z-index: 3;
  isolation: isolate;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.nav-link {
  position: relative;
  z-index: 1;
  pointer-events: auto;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 10px 16px;
  border: 1px solid rgba(16, 42, 67, 0.12);
  color: #102a43;
  background: rgba(255, 255, 255, 0.86);
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease,
    box-shadow 0.2s ease;
}

.nav-link:hover {
  transform: translateY(-1px);
  border-color: rgba(0, 83, 156, 0.22);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.08);
}

.nav-link.is-active {
  background: #00539c;
  border-color: #00539c;
  color: #fff;
  box-shadow: 0 12px 26px rgba(0, 83, 156, 0.18);
}
</style>
