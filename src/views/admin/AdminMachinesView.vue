<template>
  <div class="admin-machines-page">
    <AppToast
      :show="toast.show"
      :message="toast.message"
      :type="toast.type"
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
        @update:form="form = $event"
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
      />
    </section>
  </div>
</template>

<script>
import AdminMachinesTable from '../../components/admin/AdminMachinesTable.vue'
import AdminMachineForm from '../../components/admin/AdminMachineForm.vue'
import AppToast from '../../components/ui/AppToast.vue'
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
    AppToast
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
      sortKey: 'name',
      sortDirection: 'asc',
      toastTimeout: null,
      form: {
        name: '',
        brand: '',
        category: 'abkant',
        model: '',
        description: '',
        price: 0,
        image: '',
        isPublished: true
      },
      toast: {
        show: false,
        message: '',
        type: 'success'
      },
    }
  },
  computed: {
    filteredMachines() {
      const filtered = this.machines.filter((machine) => {
        const matchesCategory =
          this.selectedCategory === 'all' ||
          machine.category === this.selectedCategory

        const keyword = this.searchTerm.trim().toLowerCase()
        const matchesSearch =
          !keyword ||
          machine.name?.toLowerCase().includes(keyword) ||
          machine.brand?.toLowerCase().includes(keyword) ||
          machine.model?.toLowerCase().includes(keyword)

        return matchesCategory && matchesSearch
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
      this.editingId = machine._id
      this.form = {
        name: machine.name || '',
        brand: machine.brand || '',
        category: machine.category || 'abkant',
        model: machine.model || '',
        description: machine.description || '',
        price: machine.price || 0,
        image: machine.image || '',
        isPublished: Boolean(machine.isPublished)
      }
    },

    async handleCreate() {
      this.error = ''
      this.saving = true

      try {
        const payload = {
          ...this.form,
          specs: {}
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

    async handleDelete(id) {
      const confirmed = window.confirm('Bu makineyi silmek istediğinize emin misiniz?')
      if (!confirmed) return

      this.error = ''

      try {
        await deleteAdminMachine(id)

        if (this.editingId === id) {
          this.resetForm()
        }

        this.showToast('Makine silindi.', 'success')
        await this.fetchMachines()
      } catch (error) {
          const message = error.response?.data?.message || 'Makine silinemedi'
          this.error = message
          this.showToast(message, 'error')
      }
    },

    resetForm() {
      this.editingId = null
      this.error = ''
      this.form = {
        name: '',
        brand: '',
        category: 'abkant',
        model: '',
        description: '',
        price: 0,
        image: '',
        isPublished: true
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
    }
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