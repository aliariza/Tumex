<template>
  <section class="admin-page admin-machines-page">
    <div class="admin-page__glow admin-page__glow--left" aria-hidden="true"></div>
    <div class="admin-page__glow admin-page__glow--right" aria-hidden="true"></div>

    <Teleport to="body">
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
    </Teleport>
    <header class="page-header card card--hero">
      <div class="page-header__copy">
        <p class="page-header__eyebrow">YÖNETİM PANELİ • MAKİNE YÖNETİMİ</p>
        <h1>Makine Yönetimi</h1>
        <p>{{ activeCategoryDescription }}</p>
      </div>

      <div class="page-header__meta">
        <div v-if="editingId" class="editing-badge">
          Düzenleme Modu
        </div>
        <div class="page-header__summary">
          <span class="page-header__summary-label">Toplam sonuç</span>
          <strong>{{ filteredMachines.length }}</strong>
        </div>
      </div>
    </header>

    <AdminPanelNav />

    <section class="category-switch card">
      <div class="section-header section-header--stacked">
        <div>
          <h2 class="section-title">Makine Grupları</h2>
          <p class="section-description">
            Abkant ve lazer gruplarını ayrı ayrı yönetin; ilgili form alanları ve tablo kolonları
            seçtiğiniz kategoriye göre değişsin.
          </p>
        </div>
      </div>

      <div class="category-tabs" role="tablist" aria-label="Makine kategorileri">
        <button
          v-for="category in categories"
          :key="category.value"
          type="button"
          :class="['category-tab', { 'is-active': selectedCategory === category.value }]"
          @click="setCategory(category.value)"
        >
          <span class="category-tab__label">{{ category.label }}</span>
          <span class="category-tab__meta">
            {{ getMachineCount(category.value) }} kayıt
          </span>
        </button>
      </div>
    </section>

    <section class="card">
      <div class="section-header section-header--stacked">
        <div>
          <h2 class="section-title">
            {{ editingId ? `${activeCategoryLabel} Kaydını Düzenle` : `Yeni ${activeCategoryLabel} Ekle` }}
          </h2>
          <p class="section-description">
            {{ formDescription }}
          </p>
        </div>
      </div>

      <AdminMachineForm
        :active-category="selectedCategory"
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
        <div>
          <h2 class="section-title">{{ activeCategoryLabel }} Listesi</h2>
          <p class="section-description">
            {{ tableDescription }}
          </p>
        </div>
        <span class="count-badge">{{ filteredMachines.length }}</span>
      </div>

      <div class="toolbar">
        <input
          v-model="searchTerm"
          class="search-input"
          type="text"
          :placeholder="`${activeCategoryLabel} ara...`"
        />

        <AppSelect
          v-model="selectedStatus"
          class="filter-select"
          :options="statusOptions"
        />

        <AppSelect
          :model-value="itemsPerPage"
          class="filter-select filter-select--compact"
          compact
          :options="pageSizeOptions"
          @update:model-value="setItemsPerPage"
        />
      </div>
      <p v-if="loading" class="info-text">Yükleniyor...</p>
      <p v-if="error" class="error">{{ error }}</p>

      <AdminMachinesTable
        v-if="!loading"
        :category="selectedCategory"
        :machines="paginatedMachines"
        :sort-key="sortKey"
        :sort-direction="sortDirection"
        @edit="startEdit"
        @delete="handleDelete"
        @sort="setSort"
        @toggle-publish="togglePublish"
      />

      <div v-if="!loading && filteredMachines.length" class="pagination">
        <p class="pagination__summary">
          {{ pageRangeStart }}-{{ pageRangeEnd }} / {{ filteredMachines.length }} kayıt gösteriliyor
        </p>

        <div class="pagination__actions">
          <button type="button" class="pagination__button" :disabled="currentPage === 1" @click="setCurrentPage(currentPage - 1)">
            Önceki
          </button>
          <span class="pagination__page">Sayfa {{ currentPage }} / {{ totalPages }}</span>
          <button type="button" class="pagination__button" :disabled="currentPage === totalPages" @click="setCurrentPage(currentPage + 1)">
            Sonraki
          </button>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import AdminMachinesTable from '../components/AdminMachinesTable.vue'
import AdminMachineForm from '../components/AdminMachineForm.vue'
import AdminPanelNav from '../components/AdminPanelNav.vue'
import AppToast from '@/shared/components/ui/AppToast.vue'
import AppSelect from '@/shared/components/ui/AppSelect.vue'
import ConfirmDialog from '@/shared/components/ui/ConfirmDialog.vue'
import { useAdminMachines } from '../composables/useAdminMachines'

defineOptions({ name: 'AdminMachinesView' })

const {
  allMachines,
  categories,
  currentPage,
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
  itemsPerPage,
  loading,
  paginatedMachines,
  resetForm,
  saving,
  setCurrentPage,
  searchTerm,
  setCategory,
  setItemsPerPage,
  selectedCategory,
  selectedStatus,
  setSort,
  sortDirection,
  sortKey,
  startEdit,
  toast,
  totalPages,
  togglePublish
} = useAdminMachines()

const categoryCopy = {
  abkant: {
    label: 'Abkant',
    description: 'Abkant makinelerini tonaj ve bükme uzunluğu gibi teknik metriklerle yönetin.',
    form: 'Abkant makinesi için tonaj, bükme uzunluğu ve teknik özellikleri bu alandan düzenleyin.',
    table: 'Abkant kayıtlarını tonaj ve bükme uzunluğuna göre inceleyin, arayın ve yayın durumlarını değiştirin.'
  },
  'laser-cutting': {
    label: 'Lazer Kesim',
    description: 'Lazer kesim makinelerini lazer gücü ve ebat bilgileriyle ayrı bir akış içinde yönetin.',
    form: 'Lazer kesim makinesi için lazer gücü, ebat ve ilgili teknik ozellikleri bu alandan düzenleyin.',
    table: 'Lazer kesim kayıtlarını lazer gücü ve ebat kolonlarıyla daha anlamlı bir şekilde yönetin.'
  }
}

const activeCategory = computed(() => categoryCopy[selectedCategory.value] || categoryCopy.abkant)
const activeCategoryLabel = computed(() => activeCategory.value.label)
const activeCategoryDescription = computed(() => activeCategory.value.description)
const formDescription = computed(() => activeCategory.value.form)
const tableDescription = computed(() => activeCategory.value.table)
const pageRangeStart = computed(() => (filteredMachines.value.length ? (currentPage.value - 1) * itemsPerPage.value + 1 : 0))
const pageRangeEnd = computed(() => Math.min(currentPage.value * itemsPerPage.value, filteredMachines.value.length))
const statusOptions = [
  { value: 'all', label: 'Tüm Durumlar' },
  { value: 'published', label: 'Yayında' },
  { value: 'passive', label: 'Pasif' }
]
const pageSizeOptions = [
  { value: 5, label: '5 / sayfa' },
  { value: 10, label: '10 / sayfa' },
  { value: 20, label: '20 / sayfa' }
]

function getMachineCount(category) {
  return allMachines.value.filter((machine) => machine.category === category).length
}
</script>

<style scoped lang="scss">
@use '@/shared/styles/admin-page-shell.scss' as *;

.page-header__meta {
  display: grid;
  gap: 1rem;
  justify-items: end;
}

.editing-badge {
  background: #fff4d6;
  color: #92400e;
  border: 1px solid rgba(180, 83, 9, 0.12);
  padding: 0.8rem 1.2rem;
  font-size: 1.3rem;
  font-weight: 700;
  white-space: nowrap;
}

.category-switch {
  display: grid;
  gap: 1.8rem;
}

.category-tabs {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.2rem;
}

.category-tab {
  display: grid;
  gap: 0.4rem;
  padding: 1.6rem;
  border: 1px solid rgba(16, 42, 67, 0.12);
  background: rgba(255, 255, 255, 0.84);
  color: #102a43;
  text-align: left;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease,
    background-color 0.2s ease;
}

.category-tab:hover {
  transform: translateY(-1px);
  border-color: rgba(0, 83, 156, 0.22);
  box-shadow: 0 1.2rem 2.6rem rgba(15, 23, 42, 0.08);
}

.category-tab.is-active {
  border-color: #00539c;
  background: linear-gradient(135deg, rgba(0, 83, 156, 0.1), rgba(255, 255, 255, 0.95));
  box-shadow: inset 0 0 0 1px rgba(0, 83, 156, 0.08);
}

.category-tab__label {
  font-size: 1.6rem;
  font-weight: 800;
}

.category-tab__meta {
  color: #627d98;
  font-size: 1.3rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 1.2rem;
}

.section-header--stacked {
  justify-content: flex-start;
}

.filter-select--compact {
  min-width: 12rem;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.6rem;
  margin-top: 1.8rem;
  padding-top: 1.6rem;
  border-top: 1px solid rgba(148, 163, 184, 0.18);
}

.pagination__summary {
  margin: 0;
  color: #627d98;
  font-size: 1.4rem;
}

.pagination__actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.pagination__page {
  color: #102a43;
  font-size: 1.4rem;
  font-weight: 700;
}

.pagination__button {
  min-height: 4rem;
  padding: 0.9rem 1.4rem;
  border: 1px solid rgba(16, 42, 67, 0.12);
  background: rgba(255, 255, 255, 0.9);
  color: #102a43;
  font-size: 1.4rem;
  font-weight: 700;
  cursor: pointer;
}

.pagination__button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

@media (max-width: 700px) {
  .page-header__meta {
    width: 100%;
    justify-items: stretch;
  }

  .category-tabs {
    grid-template-columns: 1fr;
  }

  .pagination {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
