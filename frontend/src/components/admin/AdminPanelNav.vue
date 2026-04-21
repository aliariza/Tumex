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
  { label: 'Kullanıcı Yönetimi', to: '/admin/users' }
]
</script>

<style scoped>
.admin-panel-nav {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 14px;
  border: 1px solid #d8dbe2;
  color: #1f2937;
  background: #fff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
}

.nav-link.is-active {
  background: #111827;
  border-color: #111827;
  color: #fff;
}
</style>
