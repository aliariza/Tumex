<template>
  <section class="admin-machines-page">
    <div class="admin-machines-page__glow admin-machines-page__glow--left" aria-hidden="true"></div>
    <div class="admin-machines-page__glow admin-machines-page__glow--right" aria-hidden="true"></div>

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
import AdminMachinesTable from '../../components/admin/AdminMachinesTable.vue'
import AdminMachineForm from '../../components/admin/AdminMachineForm.vue'
import AdminPanelNav from '../../components/admin/AdminPanelNav.vue'
import AppToast from '../../components/ui/AppToast.vue'
import AppSelect from '../../components/ui/AppSelect.vue'
import ConfirmDialog from '../../components/ui/ConfirmDialog.vue'
import { useAdminMachines } from '../../composables/useAdminMachines'

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
.admin-machines-page {
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

.admin-machines-page__glow {
  position: absolute;
  width: 32rem;
  height: 32rem;
  border-radius: 50%;
  filter: blur(24px);
  opacity: 0.55;
  pointer-events: none;
}

.admin-machines-page__glow--left {
  top: 8rem;
  left: -12rem;
  background: rgba(0, 83, 156, 0.16);
}

.admin-machines-page__glow--right {
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

.toolbar {
  display: flex;
  gap: 1.2rem;
  margin-bottom: 1.6rem;
  flex-wrap: wrap;
}

.search-input {
  min-height: 4.8rem;
  padding: 1.2rem 1.4rem;
  border: 1px solid #7da6d8;
  border-radius: 0;
  font-size: 1.4rem;
  background: #fff;
  color: #102a43;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: #00539c;
  background: #fff;
  box-shadow: inset 0 0 0 1px rgba(0, 83, 156, 0.18);
}

.search-input {
  flex: 1;
  min-width: 22rem;
}

.filter-select {
  min-width: 18rem;
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
  .admin-machines-page {
    min-height: calc(100vh - 16rem);
    margin-top: 1.6rem;
    padding-inline: 1.6rem;
  }

  .page-header {
    flex-direction: column;
  }

  .page-header__meta {
    width: 100%;
    justify-items: stretch;
  }

  .card {
    padding: 2rem;
  }

  .category-tabs {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .pagination {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
