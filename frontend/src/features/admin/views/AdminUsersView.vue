<template>
  <section class="admin-page admin-users-page">
    <div class="admin-page__glow admin-page__glow--left" aria-hidden="true"></div>
    <div class="admin-page__glow admin-page__glow--right" aria-hidden="true"></div>

    <AppToast
      :show="toast.show"
      :message="toast.message"
      :type="toast.type"
    />
    <ConfirmDialog
      :show="confirmDialog.show"
      title="Kullanıcıyı Sil"
      :message="`${
        confirmDialog.userEmail || 'Bu kullanıcıyı'
      } silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`"
      @confirm="confirmDelete"
      @cancel="closeDeleteDialog"
    />

    <header class="page-header card card--hero">
      <div class="page-header__copy">
        <p class="page-header__eyebrow">YÖNETİM PANELİ • KULLANICI YÖNETİMİ</p>
        <h1>Kullanıcı Yönetimi</h1>
        <p>Genel, bayi ve admin erişimlerini buradan yönetebilirsiniz.</p>
      </div>

      <div class="page-header__summary">
        <span class="page-header__summary-label">Toplam sonuç</span>
        <strong>{{ filteredUsers.length }}</strong>
      </div>
    </header>

    <AdminPanelNav />

    <section class="card">
      <div class="section-header">
        <div>
          <h2 class="section-title">Kullanıcı Listesi</h2>
          <p class="section-description">
            Genel kullanıcılar kayıt olmuş ama henüz bayi erişimi için onaylanmamış kişilerdir.
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

        <AppSelect
          v-model="selectedRole"
          class="filter-select"
          :options="roleOptions"
        />
      </div>

      <p v-if="loading" class="info-text">Yükleniyor...</p>
      <p v-if="error" class="error">{{ error }}</p>

      <AdminUsersTable
        v-if="!loading"
        :users="filteredUsers"
        :saving-id="savingId"
        @delete="handleDelete"
        @set-role="setUserRole"
      />
    </section>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import AdminPanelNav from '../components/AdminPanelNav.vue'
import AdminUsersTable from '../components/AdminUsersTable.vue'
import AppSelect from '@/shared/components/ui/AppSelect.vue'
import AppToast from '@/shared/components/ui/AppToast.vue'
import ConfirmDialog from '@/shared/components/ui/ConfirmDialog.vue'
import { useAdminUsers } from '../composables/useAdminUsers'

defineOptions({ name: 'AdminUsersView' })

const {
  closeDeleteDialog,
  confirmDelete,
  confirmDialog,
  error,
  fetchUsers,
  filteredUsers,
  handleDelete,
  loading,
  savingId,
  searchTerm,
  selectedRole,
  setUserRole,
  toast
} = useAdminUsers()

const roleOptions = [
  { value: 'all', label: 'Tüm Roller' },
  { value: 'user', label: 'Genel' },
  { value: 'dealer', label: 'Bayi' },
  { value: 'admin', label: 'Admin' }
]

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped lang="scss">
@use '@/shared/styles/admin-page-shell.scss' as *;

@media (max-width: 700px) {
}
</style>
