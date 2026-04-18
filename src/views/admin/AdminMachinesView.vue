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

<script>
import AdminMachinesTable from '../../components/admin/AdminMachinesTable.vue'
import AdminMachineForm from '../../components/admin/AdminMachineForm.vue'
import AppToast from '../../components/ui/AppToast.vue'
import ConfirmDialog from '../../components/ui/ConfirmDialog.vue'
import {
  getAdminMachines,
  createAdminMachine,
  updateAdminMachine,
  deleteAdminMachine
} from '../../services/adminMachineService'

export default {
  name: 'AdminMachinesView',
  components: {
    AdminMachinesTable,
    AdminMachineForm,
    AppToast,
    ConfirmDialog
  },
  data() {
    return {
      machines: [],
      loading: false,
      saving: false,
      error: '',
      editingId: null,
      searchTerm: '',
      selectedCategory: 'all',
      selectedStatus: 'all',
      sortKey: 'title',
      sortDirection: 'asc',
      toastTimeout: null,
      form: {
        category: 'abkant',
        brand: '',
        family: '',
        series: '',
        model: '',
        title: '',
        description: '',
        price: 0,
        pressForceTon: null,
        bendingLengthMm: null,
        image: '',
        gallery: [],
        specs: [],
        isPublished: false
      },
      toast: {
        show: false,
        message: '',
        type: 'success'
      },
      confirmDialog: {
        show: false,
        machineId: null
      },
      formErrors: {}
    }
  },
  computed: {
    filteredMachines() {
      const filtered = this.machines.filter((machine) => {
        const matchesCategory =
          this.selectedCategory === 'all' ||
          machine.category === this.selectedCategory

        const matchesStatus =
          this.selectedStatus === 'all' ||
          (this.selectedStatus === 'published' && machine.isPublished) ||
          (this.selectedStatus === 'passive' && !machine.isPublished)

        const keyword = this.searchTerm.trim().toLowerCase()
        const matchesSearch =
          !keyword ||
            machine.title?.toLowerCase().includes(keyword) ||
            machine.brand?.toLowerCase().includes(keyword) ||
            machine.family?.toLowerCase().includes(keyword) ||
            machine.series?.toLowerCase().includes(keyword) ||
            machine.model?.toLowerCase().includes(keyword) ||
            machine.category?.toLowerCase().includes(keyword) ||
            machine.description?.toLowerCase().includes(keyword) 
         return matchesCategory && matchesStatus && matchesSearch
      })

      const sorted = [...filtered].sort((a, b) => {
        const aValue = a[this.sortKey]
        const bValue = b[this.sortKey]

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return this.sortDirection === 'asc' ? aValue - bValue : bValue - aValue
        }

        const aText = String(aValue || '').toLowerCase()
        const bText = String(bValue || '').toLowerCase()

        if (aText < bText) return this.sortDirection === 'asc' ? -1 : 1
        if (aText > bText) return this.sortDirection === 'asc' ? 1 : -1
        return 0
      })

      return sorted
    }
  },
  async mounted() {
    await this.fetchMachines()
  },
  beforeUnmount() {
    clearTimeout(this.toastTimeout)
  },
  methods: {
    async fetchMachines() {
      this.loading = true
      this.error = ''

      try {
        const { data } = await getAdminMachines()
        this.machines = data
      } catch (error) {
        this.error = error.response?.data?.message || 'Makine listesi alınamadı'
      } finally {
        this.loading = false
      }
    },

    startEdit(machine) {
      this.error = ''
      this.formErrors = {}
      this.editingId = machine._id
      this.form = {
        category: machine.category || 'abkant',
        brand: machine.brand || '',
        family: machine.family || '',
        series: machine.series || '',
        model: machine.model || '',
        title: machine.title || '',
        description: machine.description || '',
        price: machine.price || 0,
        pressForceTon: machine.pressForceTon ?? null,
        bendingLengthMm: machine.bendingLengthMm ?? null,
        image: machine.image || '',
        gallery: Array.isArray(machine.gallery) ? machine.gallery : [],
        specs: Array.isArray(machine.specs) ? machine.specs : [],
        isPublished: Boolean(machine.isPublished)
      }
    },

    async handleCreate() {
      this.error = ''
      this.formErrors = {}

      if (!this.validateForm()) {
        this.showToast('Lütfen form hatalarını düzeltin.', 'error')
        return
      }

      this.saving = true

      try {

        const cleanedSpecs = (Array.isArray(this.form.specs) ? this.form.specs : [])
          .map((spec, index) => ({
            key: spec?.key?.trim() || '',
            label: spec?.label?.trim() || '',
            value: spec?.value?.trim() || '',
            order: index + 1
          }))
          .filter((spec) => spec.key || spec.label || spec.value)
          
        const payload = {
          ...this.form,
          specs: cleanedSpecs,
          gallery: Array.isArray(this.form.gallery) ? this.form.gallery : []
        }

        if (this.editingId) {
          await updateAdminMachine(this.editingId, payload)
          this.showToast('Makine başarıyla güncellendi.', 'success')
        } else {
          await createAdminMachine(payload)
          this.showToast('Makine başarıyla eklendi.', 'success')
        }

        this.resetForm()
        await this.fetchMachines()
      } catch (error) {
        const message = error.response?.data?.message || (
          this.editingId ? 'Makine güncellenemedi' : 'Makine oluşturulamadı'
        )
        this.error = message
        this.showToast(message, 'error')
      } finally {
        this.saving = false
      }
    },

    handleDelete(id) {
      this.confirmDialog = {
        show: true,
        machineId: id
      }
    },
    closeDeleteDialog() {
      this.confirmDialog = {
        show: false,
        machineId: null
      }
    },

    async confirmDelete() {
      const id = this.confirmDialog.machineId
      if (!id) return

      this.error = ''

      try {
        await deleteAdminMachine(id)

        if (this.editingId === id) {
          this.resetForm()
        }

        this.showToast('Makine silindi.', 'success')
        this.closeDeleteDialog()
        await this.fetchMachines()
      } catch (error) {
        const message = error.response?.data?.message || 'Makine silinemedi'
        this.error = message
        this.showToast(message, 'error')
        this.closeDeleteDialog()
      }
    },
    resetForm() {
      this.editingId = null
      this.error = ''
      this.formErrors = {}
      this.form = {
      category: 'abkant',
      brand: '',
      family: '',
      series: '',
      model: '',
      title: '',
      description: '',
      price: 0,
      pressForceTon: null,
      bendingLengthMm: null,
      image: '',
      gallery: [],
      specs: [],
      isPublished: false
      }
    },

    setSort(key) {
      if (this.sortKey === key) {
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc'
      } else {
        this.sortKey = key
        this.sortDirection = 'asc'
      }
    },
    showToast(message, type = 'success') {
      this.toast = {
        show: true,
        message,
        type
      }

      clearTimeout(this.toastTimeout)
      this.toastTimeout = setTimeout(() => {
        this.toast.show = false
      }, 2500)
    },
    async togglePublish(machine) {
      this.error = ''

      try {
        const payload = {
          category: machine.category || 'abkant',
          brand: machine.brand || '',
          family: machine.family || '',
          series: machine.series || '',
          model: machine.model || '',
          title: machine.title || '',
          description: machine.description || '',
          price: machine.price || 0,
          pressForceTon: machine.pressForceTon ?? null,
          bendingLengthMm: machine.bendingLengthMm ?? null,
          image: machine.image || '',
          gallery: Array.isArray(machine.gallery) ? machine.gallery : [],
          specs: Array.isArray(machine.specs) ? machine.specs : [],
          isPublished: !machine.isPublished
        }

        await updateAdminMachine(machine._id, payload)

        this.showToast(
          payload.isPublished ? 'Makine yayına alındı.' : 'Makine pasife alındı.',
          'success'
        )

        if (this.editingId === machine._id) {
          this.form.isPublished = payload.isPublished
        }

        await this.fetchMachines()
      } catch (error) {
        const message = error.response?.data?.message || 'Makine durumu güncellenemedi'
        this.error = message
        this.showToast(message, 'error')
      }
    },

    validateForm() {
      const errors = {}

      if (!this.form.category?.trim()) {
        errors.category = 'Kategori zorunludur.'
      }

      if (!this.form.brand?.trim()) {
        errors.brand = 'Marka zorunludur.'
      }

      if (!this.form.family?.trim()) {
        errors.family = 'Aile / Family zorunludur.'
      }

      if (!this.form.series?.trim()) {
        errors.series = 'Seri zorunludur.'
      }

      if (!this.form.model?.trim()) {
        errors.model = 'Model zorunludur.'
      }

      if (!this.form.title?.trim()) {
        errors.title = 'Başlık zorunludur.'
      }

      if (this.form.price < 0) {
        errors.price = 'Fiyat 0 veya daha büyük olmalıdır.'
      }

      if (this.form.pressForceTon != null && this.form.pressForceTon < 0) {
        errors.pressForceTon = 'Tonaj 0 veya daha büyük olmalıdır.'
      }

      if (this.form.bendingLengthMm != null && this.form.bendingLengthMm < 0) {
        errors.bendingLengthMm = 'Bükme uzunluğu 0 veya daha büyük olmalıdır.'
      }

      if (this.form.image?.trim()) {
        const looksLikeUrl = /^(https?:\/\/|\/).+/i.test(this.form.image.trim())
        if (!looksLikeUrl) {
          errors.image = 'Görsel URL geçerli görünmüyor.'
        }
      }

      if (Array.isArray(this.form.specs)) {
        this.form.specs.forEach((spec, index) => {
          const hasAnyValue =
            spec?.label?.trim() ||
            spec?.key?.trim() ||
            spec?.value?.trim()

          if (!hasAnyValue) return

          if (!spec?.label?.trim()) {
            errors[`specs.${index}.label`] = `Özellik ${index + 1} için etiket zorunludur.`
          }

          if (!spec?.key?.trim()) {
            errors[`specs.${index}.key`] = `Özellik ${index + 1} için key zorunludur.`
          }
        })
      }

      this.formErrors = errors
      return Object.keys(errors).length === 0
    },
    clearFieldError(field) {
      if (!this.formErrors[field]) return

      const nextErrors = { ...this.formErrors }
      delete nextErrors[field]
      this.formErrors = nextErrors
    },
    buildMachineTitle() {
      const parts = []

      if (this.form.family?.trim()) {
        parts.push(this.form.family.trim())
      }

      if (this.form.pressForceTon != null && this.form.pressForceTon !== '') {
        parts.push(`${this.form.pressForceTon} Ton`)
      }

      if (this.form.bendingLengthMm != null && this.form.bendingLengthMm !== '') {
        parts.push(`${this.form.bendingLengthMm} mm`)
      }

      return parts.join(' ').trim()
    },
    syncAutoTitle() {
      this.form = {
        ...this.form,
        title: this.buildMachineTitle()
      }
    },
    handleFormUpdate(nextForm) {
      const watchedFieldsChanged =
        nextForm.family !== this.form.family ||
        nextForm.pressForceTon !== this.form.pressForceTon ||
        nextForm.bendingLengthMm !== this.form.bendingLengthMm

      this.form = nextForm

      if (watchedFieldsChanged) {
        this.syncAutoTitle()
      }
    },
  }
}
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