<template>
  <section class="admin-users-page">
    <div class="admin-users-page__glow admin-users-page__glow--left" aria-hidden="true"></div>
    <div class="admin-users-page__glow admin-users-page__glow--right" aria-hidden="true"></div>

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
        <p class="page-header__eyebrow">Yönetim Paneli • Kullanıcı Yönetimi</p>
        <h1>Kullanıcı Yönetimi</h1>
        <p>Public, bayi ve admin erişimlerini buradan yönetebilirsiniz.</p>
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
        @delete="handleDelete"
        @set-role="setUserRole"
      />
    </section>
  </section>
</template>

<script setup>
import { onMounted } from 'vue'
import AdminPanelNav from '../../components/admin/AdminPanelNav.vue'
import AdminUsersTable from '../../components/admin/AdminUsersTable.vue'
import AppToast from '../../components/ui/AppToast.vue'
import ConfirmDialog from '../../components/ui/ConfirmDialog.vue'
import { useAdminUsers } from '../../composables/useAdminUsers'

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

onMounted(() => {
  fetchUsers()
})
</script>

<style scoped lang="scss">
.admin-users-page {
  position: relative;
  max-width: 1280px;
  margin: 2.4rem auto 0;
  padding: 0 2rem 8rem;
  display: grid;
  gap: 2rem;
  overflow: hidden;
  background:
    linear-gradient(180deg, rgba(240, 247, 255, 0.95) 0%, rgba(255, 255, 255, 1) 58%),
    repeating-linear-gradient(
      -45deg,
      rgba(0, 83, 156, 0.035) 0,
      rgba(0, 83, 156, 0.035) 14px,
      rgba(255, 255, 255, 0.82) 14px,
      rgba(255, 255, 255, 0.82) 28px
    );
}

.admin-users-page__glow {
  position: absolute;
  width: 32rem;
  height: 32rem;
  border-radius: 50%;
  filter: blur(24px);
  opacity: 0.55;
  pointer-events: none;
}

.admin-users-page__glow--left {
  top: 8rem;
  left: -12rem;
  background: rgba(0, 83, 156, 0.16);
}

.admin-users-page__glow--right {
  right: -10rem;
  bottom: 4rem;
  background: rgba(231, 76, 60, 0.12);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.page-header__copy {
  max-width: 62rem;
}

.page-header__eyebrow {
  margin: 0 0 1.2rem;
  color: #00539c;
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.page-header h1 {
  margin: 0;
  color: #102a43;
  font-size: clamp(3.8rem, 7vw, 5.8rem);
  line-height: 0.98;
  letter-spacing: -0.04em;
}

.page-header p {
  margin: 1.8rem 0 0;
  color: #486581;
  font-size: 1.7rem;
  line-height: 1.7;
}

.page-header__summary {
  display: grid;
  gap: 0.4rem;
  min-width: 16rem;
  padding: 1.4rem 1.6rem;
  border: 1px dashed rgba(0, 83, 156, 0.26);
  background: rgba(255, 255, 255, 0.72);
}

.page-header__summary-label {
  color: #829ab1;
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.page-header__summary strong {
  color: #102a43;
  font-size: 2.4rem;
  line-height: 1;
}

.card {
  position: relative;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(247, 250, 252, 0.94));
  border: 1px solid rgba(17, 24, 39, 0.08);
  border-radius: 0;
  padding: 2.4rem;
  box-shadow: 0 2.4rem 6rem rgba(15, 23, 42, 0.08);
}

.card::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 0.8rem;
  background: linear-gradient(180deg, #00539c 0%, #2f79bb 100%);
}

.card--hero {
  padding-right: clamp(2rem, 4vw, 4rem);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 1.2rem;
}

.section-title {
  margin: 0;
  color: #102a43;
  font-size: 2.2rem;
}

.section-description {
  margin: 0.8rem 0 0;
  color: #627d98;
  font-size: 1.5rem;
  line-height: 1.6;
}

.count-badge {
  min-width: 3.6rem;
  height: 3.6rem;
  background: #102a43;
  color: white;
  display: inline-grid;
  place-items: center;
  font-size: 1.3rem;
  font-weight: 700;
}

.toolbar {
  display: flex;
  gap: 1.2rem;
  margin-bottom: 1.6rem;
  flex-wrap: wrap;
}

.search-input,
.filter-select {
  min-height: 4.8rem;
  padding: 1.2rem 1.4rem;
  border: 1px solid #cbd5e1;
  border-radius: 0;
  font-size: 1.4rem;
  background: rgba(244, 247, 251, 0.95);
  color: #102a43;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

.search-input:focus,
.filter-select:focus {
  outline: none;
  border-color: #00539c;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(0, 83, 156, 0.12);
}

.search-input {
  flex: 1;
  min-width: 22rem;
}

.filter-select {
  min-width: 18rem;
}

.info-text {
  color: #627d98;
}

.error {
  background: #fff1f2;
  color: #9b1c1c;
  border: 1px solid rgba(185, 28, 28, 0.12);
  border-radius: 0;
  padding: 1.2rem 1.4rem;
  margin-bottom: 1.2rem;
  font-size: 1.4rem;
  font-weight: 600;
}

@media (max-width: 700px) {
  .admin-users-page {
    min-height: calc(100vh - 16rem);
    margin-top: 1.6rem;
    padding-inline: 1.6rem;
  }

  .page-header {
    flex-direction: column;
  }

  .page-header__summary {
    width: 100%;
  }

  .card {
    padding: 2rem;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
