<template>
  <div class="admin-users-page">
    <AppToast
      :show="toast.show"
      :message="toast.message"
      :type="toast.type"
    />

    <header class="page-header">
      <div>
        <h1>Kullanıcı Yönetimi</h1>
        <p>Public, bayi ve admin erişimlerini buradan yönetebilirsiniz.</p>
      </div>
    </header>

    <AdminPanelNav />

    <section class="card">
      <div class="section-header">
        <div>
          <h2 class="section-title">Kullanıcı Listesi</h2>
          <p class="section-note">
            Public kullanıcılar kayıt olmuş ama henüz bayi erişimi için onaylanmamış kişilerdir.
          </p>
        </div>
        <span class="count-badge">{{ filteredUsers.length }}</span>
      </div>

      <div class="toolbar">
        <input
          v-model="searchTerm"
          class="search-input"
          type="text"
          placeholder="Kullanıcı ara..."
        />

        <select v-model="selectedRole" class="filter-select">
          <option value="all">Tüm Roller</option>
          <option value="user">Public</option>
          <option value="dealer">Bayi</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      <p v-if="loading" class="info-text">Yükleniyor...</p>
      <p v-if="error" class="error">{{ error }}</p>

      <AdminUsersTable
        v-if="!loading"
        :users="filteredUsers"
        :saving-id="savingId"
        @set-role="setUserRole"
      />
    </section>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import AdminPanelNav from '../../components/admin/AdminPanelNav.vue'
import AdminUsersTable from '../../components/admin/AdminUsersTable.vue'
import AppToast from '../../components/ui/AppToast.vue'
import { useAdminUsers } from '../../composables/useAdminUsers'

defineOptions({ name: 'AdminUsersView' })

const {
  error,
  fetchUsers,
  filteredUsers,
  loading,
  savingId,
  searchTerm,
  selectedRole,
  setUserRole,
  toast
} = useAdminUsers()

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped>
.admin-users-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 28px 20px 40px;
  display: grid;
  gap: 20px;
}

.page-header h1 {
  margin: 0;
  font-size: 30px;
}

.page-header p {
  margin: 6px 0 0;
  color: #6b7280;
}

.card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0;
  padding: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.section-title {
  margin: 0 0 16px;
  font-size: 20px;
}

.section-note {
  margin: -8px 0 0;
  color: #6b7280;
  font-size: 14px;
}

.count-badge {
  min-width: 32px;
  height: 32px;
  border-radius: 999px;
  background: #111827;
  color: white;
  display: inline-grid;
  place-items: center;
  font-size: 13px;
}

.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.search-input,
.filter-select {
  padding: 12px 14px;
  border: 1px solid #d8dbe2;
  border-radius: 0;
  font-size: 14px;
  background: white;
}

.search-input {
  flex: 1;
  min-width: 220px;
}

.filter-select {
  min-width: 180px;
}

.info-text {
  color: #6b7280;
}

.error {
  background: #fee2e2;
  color: #991b1b;
  border-radius: 0;
  padding: 12px 14px;
  margin-bottom: 12px;
}
</style>
