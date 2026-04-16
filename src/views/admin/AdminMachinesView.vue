<template>
  <div class="admin-machines">
    <h1>Makine Yönetimi</h1>
    <p>Makine ekleme, listeleme ve silme işlemleri</p>
    <p v-if="editingId"><strong>Düzenleme modundasınız</strong></p>

    <form class="machine-form" @submit.prevent="handleCreate">
      <input v-model="form.name" type="text" placeholder="Makine adı" required />
      <input v-model="form.brand" type="text" placeholder="Marka" required />

      <select v-model="form.category" required>
        <option value="abkant">Abkant</option>
        <option value="laser-cutting">Lazer Kesim</option>
        <option value="laser-welding">Lazer Kaynak</option>
      </select>

      <input v-model="form.model" type="text" placeholder="Model" required />
      <input v-model="form.description" type="text" placeholder="Açıklama" />
      <input v-model.number="form.price" type="number" min="0" placeholder="Fiyat" />
      <input v-model="form.image" type="text" placeholder="Görsel URL" />

      <label>
        Yayında mı?
        <input v-model="form.isPublished" type="checkbox" />
      </label>

      <div class="form-actions">
        <button type="submit">
          {{ editingId ? 'Güncelle' : 'Makine Ekle' }}
        </button>
        <button v-if="editingId" type="button" @click="resetForm">
          İptal
        </button>
      </div>
    </form>

    <p v-if="loading">Yükleniyor...</p>
    <p v-if="error" class="error">{{ error }}</p>

    <table v-if="machines.length" class="machines-table">
      <thead>
        <tr>
          <th>Ad</th>
          <th>Marka</th>
          <th>Kategori</th>
          <th>Model</th>
          <th>Fiyat</th>
          <th>Yayında</th>
          <th>İşlem</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="machine in machines" :key="machine._id">
          <td>{{ machine.name }}</td>
          <td>{{ machine.brand }}</td>
          <td>{{ machine.category }}</td>
          <td>{{ machine.model }}</td>
          <td>{{ machine.price }}</td>
          <td>{{ machine.isPublished ? 'Evet' : 'Hayır' }}</td>
          <td>
            <button type="button" @click="handleDelete(machine._id)">Sil</button>
            <button type="button" @click="startEdit(machine)">Düzenle</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else-if="!loading">Henüz makine kaydı yok.</p>
  </div>
</template>

<script>
import api from '../../lib/api'

export default {
  name: 'AdminMachinesView',
  data() {
    return {
      machines: [],
      loading: false,
      error: '',
      editingId: null,
      form: {
        name: '',
        brand: '',
        category: 'abkant',
        model: '',
        description: '',
        price: 0,
        image: '',
        isPublished: true
      }
    }
  },
  async mounted() {
    await this.fetchMachines()
  },
  methods: {
    async fetchMachines() {
      this.loading = true
      this.error = ''

      try {
        const { data } = await api.get('/admin/machines')
        this.machines = data
      } catch (error) {
        this.error = error.response?.data?.message || 'Makine listesi alınamadı'
      } finally {
        this.loading = false
      }
    },

    startEdit(machine) {
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

      try {
        const payload = {
          ...this.form,
          specs: {}
        }

        if (this.editingId) {
          await api.put(`/admin/machines/${this.editingId}`, payload)
        } else {
          await api.post('/admin/machines', payload)
        }

        this.resetForm()
        await this.fetchMachines()
      } catch (error) {
        this.error = error.response?.data?.message || (
          this.editingId ? 'Makine güncellenemedi' : 'Makine oluşturulamadı'
        )
      }
    },

    async handleDelete(id) {
      const confirmed = window.confirm('Bu makineyi silmek istediğinize emin misiniz?')
      if (!confirmed) return

      this.error = ''

      try {
        await api.delete(`/admin/machines/${id}`)
        await this.fetchMachines()
      } catch (error) {
        this.error = error.response?.data?.message || 'Makine silinemedi'
      }
    },

    resetForm() {
      this.editingId = null
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
  }
}
</script>

<style scoped>
.admin-machines {
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px;
}

.machine-form {
  display: grid;
  gap: 12px;
  margin-bottom: 24px;
}

.machines-table {
  width: 100%;
  border-collapse: collapse;
}

.machines-table th,
.machines-table td {
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.error {
  color: #c00;
}

.form-actions {
  display: flex;
  gap: 12px;
}
</style>