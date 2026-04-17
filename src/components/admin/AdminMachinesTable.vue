<template>
  <div class="table-wrapper">
    <table v-if="machines.length" class="machines-table">
      <thead>
        <tr>
          <th>Görsel</th>
          <th>
            <button class="sort-btn" type="button" @click="$emit('sort', 'name')">
              Ad {{ sortKey === 'name' ? sortArrow : '' }}
            </button>
          </th>
          <th>
            <button class="sort-btn" type="button" @click="$emit('sort', 'brand')">
              Marka {{ sortKey === 'brand' ? sortArrow : '' }}
            </button>
          </th>
          <th>Kategori</th>
          <th>
            <button class="sort-btn" type="button" @click="$emit('sort', 'model')">
              Model {{ sortKey === 'model' ? sortArrow : '' }}
            </button>
          </th>
          <th>
            <button class="sort-btn" type="button" @click="$emit('sort', 'price')">
              Fiyat {{ sortKey === 'price' ? sortArrow : '' }}
            </button>
          </th>
          <th>Durum</th>
          <th>İşlem</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="machine in machines" :key="machine._id">
          <td>
            <img
              v-if="machine.image"
              :src="machine.image"
              :alt="machine.name"
              class="thumb"
            />
            <span v-else class="no-image">Yok</span>
          </td>
          <td>{{ machine.name }}</td>
          <td>{{ machine.brand }}</td>
          <td>
            <span class="category-badge">{{ machine.category }}</span>
          </td>
          <td>{{ machine.model }}</td>
          <td>{{ formatPrice(machine.price) }}</td>
          <td>
            <span :class="['status-badge', machine.isPublished ? 'published' : 'draft']">
              {{ machine.isPublished ? 'Yayında' : 'Pasif' }}
            </span>
          </td>
          <td class="actions">
            <button class="secondary-btn" type="button" @click="$emit('edit', machine)">
              <Pencil class="btn-icon" :size="16" />
            </button>

            <button
              class="status-btn"
              type="button"
              @click="$emit('toggle-publish', machine)"
            >
              {{ machine.isPublished ? 'Pasife Al' : 'Yayına Al' }}
            </button>

            <button class="danger-btn" type="button" @click="$emit('delete', machine._id)">
              <Trash2 class="btn-icon" :size="16" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else class="empty-state">Henüz makine kaydı yok.</p>
  </div>
</template>

<script>
import { Pencil, Trash2 } from 'lucide-vue-next'

export default {
  name: 'AdminMachinesTable',
  components: {
    Pencil,
    Trash2
  },
  props: {
    machines: {
      type: Array,
      required: true
    },
    sortKey: {
      type: String,
      default: 'name'
    },
    sortDirection: {
      type: String,
      default: 'asc'
    }
  },
  emits: ['edit', 'delete', 'sort', 'toggle-publish'],
  computed: {
    sortArrow() {
      return this.sortDirection === 'asc' ? '↑' : '↓'
    }
  },
  methods: {
    formatPrice(price) {
      return new Intl.NumberFormat('tr-TR').format(price || 0)
    }
  }
}
</script>
<style scoped>
.table-wrapper {
  overflow-x: auto;
}

.machines-table {
  width: 100%;
  border-collapse: collapse;
}

.machines-table th,
.machines-table td {
  border-bottom: 1px solid #e5e7eb;
  padding: 14px 12px;
  text-align: left;
  vertical-align: middle;
}

.machines-table th {
  font-size: 13px;
  color: #6b7280;
  font-weight: 600;
}

.sort-btn {
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
}

.thumb {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 0px;
  border: 1px solid #e5e7eb;
}

.no-image {
  color: #9ca3af;
  font-size: 12px;
}

.category-badge,
.status-badge {
  display: inline-block;
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 12px;
}

.category-badge {
  background: #eef2ff;
  color: #3730a3;
}

.status-badge.published {
  background: #ecfdf5;
  color: #065f46;
}

.status-badge.draft {
  background: #f3f4f6;
  color: #374151;
}

.actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.secondary-btn,
.danger-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: none;
  border-radius: 0;
  padding: 8px 12px;
  font-size: 13px;
  cursor: pointer;
}
.btn-icon {
  flex-shrink: 0;
}
.secondary-btn {
  background: #e5e7eb;
  color: #111827;
}

.danger-btn {
  background: #fee2e2;
  color: #991b1b;
}
.status-btn {
  border: none;
  border-radius: 0;
  padding: 8px 12px;
  font-size: 13px;
  cursor: pointer;
  background: #dbeafe;
  color: #1d4ed8;
}

.empty-state {
  color: #6b7280;
  padding: 20px 0;
}
</style>