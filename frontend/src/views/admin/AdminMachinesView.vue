<template>
  <div class="admin-machines-page">
    <AppToast
      :show="toast.show"
      :message="toast.message"
      :type="toast.type"
    />
    <ConfirmDialog
      :show="confirmDialog.show"
      title="Makineyi Sil"
      message="Bu makineyi silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
      @confirm="confirmDelete"
      @cancel="closeDeleteDialog"
    />
    <header class="page-header">
      <div>
        <h1>Makine Yönetimi</h1>
        <p>Makine ekleme, güncelleme ve silme işlemleri</p>
      </div>
      <div v-if="editingId" class="editing-badge">
        Düzenleme Modu
      </div>
    </header>

    <AdminPanelNav />

    <section class="card">
      <h2 class="section-title">
        {{ editingId ? 'Makine Düzenle' : 'Yeni Makine Ekle' }}
      </h2>

      <AdminMachineForm
        :form="form"
        :editing-id="editingId"
        :saving="saving"
        :errors="formErrors"
        @update:form="handleFormUpdate"
        @clear-error="clearFieldError"
        @submit="handleCreate"
        @cancel="resetForm"
      />
    </section>

    <section class="card">
      <div class="section-header">
        <h2 class="section-title">Makine Listesi</h2>
        <span class="count-badge">{{ filteredMachines.length }}</span>
      </div>

      <div class="toolbar">
        <input
          v-model="searchTerm"
          class="search-input"
          type="text"
          placeholder="Makine ara..."
        />

        <select v-model="selectedCategory" class="filter-select">
          <option value="all">Tüm Kategoriler</option>
          <option value="abkant">Abkant</option>
          <option value="laser-cutting">Lazer Kesim</option>
          <option value="laser-welding">Lazer Kaynak</option>
        </select>

          <select v-model="selectedStatus" class="filter-select">
            <option value="all">Tüm Durumlar</option>
            <option value="published">Yayında</option>
            <option value="passive">Pasif</option>
          </select>
      </div>
      <p v-if="loading" class="info-text">Yükleniyor...</p>
      <p v-if="error" class="error">{{ error }}</p>

      <AdminMachinesTable
        v-if="!loading"
        :machines="filteredMachines"
        :sort-key="sortKey"
        :sort-direction="sortDirection"
        @edit="startEdit"
        @delete="handleDelete"
        @sort="setSort"
        @toggle-publish="togglePublish"
      />
    </section>
  </div>
</template>

<script setup>
import AdminMachinesTable from '../../components/admin/AdminMachinesTable.vue'
import AdminMachineForm from '../../components/admin/AdminMachineForm.vue'
import AdminPanelNav from '../../components/admin/AdminPanelNav.vue'
import AppToast from '../../components/ui/AppToast.vue'
import ConfirmDialog from '../../components/ui/ConfirmDialog.vue'
import { useAdminMachines } from '../../composables/useAdminMachines'

defineOptions({ name: 'AdminMachinesView' })

const {
  confirmDelete,
  confirmDialog,
  clearFieldError,
  closeDeleteDialog,
  editingId,
  error,
  filteredMachines,
  form,
  formErrors,
  handleCreate,
  handleDelete,
  handleFormUpdate,
  loading,
  resetForm,
  saving,
  searchTerm,
  selectedCategory,
  selectedStatus,
  setSort,
  sortDirection,
  sortKey,
  startEdit,
  toast,
  togglePublish
} = useAdminMachines()
</script>

<style scoped>
.admin-machines-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 28px 20px 40px;
  display: grid;
  gap: 20px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
}

.page-header h1 {
  margin: 0;
  font-size: 30px;
}

.page-header p {
  margin: 6px 0 0;
  color: #6b7280;
}

.editing-badge {
  background: #fef3c7;
  color: #92400e;
  border-radius: 999px;
  padding: 8px 12px;
  font-size: 13px;
  white-space: nowrap;
}

.card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 0px;
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

.info-text {
  color: #6b7280;
}

.error {
  background: #fee2e2;
  color: #991b1b;
  border-radius: 0px;
  padding: 12px 14px;
  margin-bottom: 12px;
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
  border-radius: 0px;
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

@media (max-width: 700px) {
  .page-header {
    flex-direction: column;
  }
}
</style>
