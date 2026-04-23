<template>
  <div class="table-wrapper">
    <table v-if="machines.length" class="machines-table">
      <thead>
        <tr>
          <th>GÖRSEL</th>
          <th>
            <button :class="['sort-btn', { 'is-active': isSorted('title') }]" type="button" @click="$emit('sort', 'title')">
              <span>BAŞLIK</span>
              <span v-if="isSorted('title')" class="sort-indicator">{{ sortArrow }}</span>
            </button>
          </th>
          <th>
            <button :class="['sort-btn', { 'is-active': isSorted('brand') }]" type="button" @click="$emit('sort', 'brand')">
              <span>MARKA</span>
              <span v-if="isSorted('brand')" class="sort-indicator">{{ sortArrow }}</span>
            </button>
          </th>
          <th>
            <button :class="['sort-btn', { 'is-active': isSorted('family') }]" type="button" @click="$emit('sort', 'family')">
              <span>AİLE</span>
              <span v-if="isSorted('family')" class="sort-indicator">{{ sortArrow }}</span>
            </button>
          </th>
          <th>
            <button :class="['sort-btn', { 'is-active': isSorted('series') }]" type="button" @click="$emit('sort', 'series')">
              <span>SERİ</span>
              <span v-if="isSorted('series')" class="sort-indicator">{{ sortArrow }}</span>
            </button>
          </th>
          <th>
            <button :class="['sort-btn', { 'is-active': isSorted('model') }]" type="button" @click="$emit('sort', 'model')">
              <span>MODEL</span>
              <span v-if="isSorted('model')" class="sort-indicator">{{ sortArrow }}</span>
            </button>
          </th>
          <th>
            <button :class="['sort-btn', { 'is-active': isSorted(primaryMetricKey) }]" type="button" @click="$emit('sort', primaryMetricKey)">
              <span>{{ primaryMetricLabel }}</span>
              <span v-if="isSorted(primaryMetricKey)" class="sort-indicator">{{ sortArrow }}</span>
            </button>
          </th>
          <th>
            <button :class="['sort-btn', { 'is-active': isSorted(secondaryMetricKey) }]" type="button" @click="$emit('sort', secondaryMetricKey)">
              <span class="sort-btn__multiline">
                <span>{{ secondaryMetricLabelLine1 }}</span>
                <span>{{ secondaryMetricLabelLine2 }}</span>
              </span>
              <span v-if="isSorted(secondaryMetricKey)" class="sort-indicator">{{ sortArrow }}</span>
            </button>
          </th>
          <th>DURUM</th>
          <th class="actions-header">İŞLEMLER</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="machine in machines" :key="machine._id">
          <td>
            <img
              v-if="machine.image"
              :src="machine.image"
              :alt="machine.title || machine.model"
              class="thumb"
            />
            <span v-else class="no-image">Yok</span>
          </td>

          <td>{{ displayTitle(machine) }}</td>
          <td>{{ machine.brand || '-' }}</td>
          <td>{{ machine.family || '-' }}</td>
          <td>{{ machine.series || '-' }}</td>
          <td>{{ machine.model || '-' }}</td>
          <td>{{ formatMetric(machine, primaryMetricKey, primaryMetricSuffix) }}</td>
          <td>{{ formatMetric(machine, secondaryMetricKey, secondaryMetricSuffix) }}</td>

          <td>
            <span :class="['status-badge', machine.isPublished ? 'published' : 'draft']">
              {{ machine.isPublished ? 'Yayında' : 'Pasif' }}
            </span>
          </td>

          <td>
            <div class="actions">
              <button class="secondary-btn" type="button" @click="$emit('edit', machine)">
                <Pencil class="btn-icon" :size="16" />
              </button>

              <button
                :class="['status-btn', machine.isPublished ? 'status-btn--published' : 'status-btn--draft']"
                type="button"
                @click="$emit('toggle-publish', machine)"
                :title="machine.isPublished ? 'Pasife al' : 'Yayına al'"
              >
                <Eye v-if="machine.isPublished" class="btn-icon" :size="16" />
                <EyeOff v-else class="btn-icon" :size="16" />
              </button>

              <button class="danger-btn" type="button" @click="$emit('delete', machine._id)">
                <Trash2 class="btn-icon" :size="16" />
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-else class="empty-state">Henüz makine kaydı yok.</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Eye, EyeOff, Pencil, Trash2 } from 'lucide-vue-next'
import { buildMachineTitle, resolveMachineMetricValue } from '@/features/admin/services/adminMachineHelpers'

defineOptions({ name: 'AdminMachinesTable' })

defineEmits(['edit', 'delete', 'sort', 'toggle-publish'])

const props = defineProps({
  machines: {
    type: Array,
    required: true
  },
  category: {
    type: String,
    default: 'abkant'
  },
  sortKey: {
    type: String,
    default: 'title'
  },
  sortDirection: {
    type: String,
    default: 'asc'
  }
})

const sortArrow = computed(() => (props.sortDirection === 'asc' ? '↑' : '↓'))
const isAbkantCategory = computed(() => props.category === 'abkant')
const primaryMetricKey = computed(() => (isAbkantCategory.value ? 'pressForceTon' : 'powerKw'))
const secondaryMetricKey = computed(() => (isAbkantCategory.value ? 'bendingLengthMm' : 'workingAreaCode'))
const primaryMetricLabel = computed(() => (isAbkantCategory.value ? 'TONAJ' : 'LAZER GÜCÜ'))
const secondaryMetricLabelLine1 = computed(() => (isAbkantCategory.value ? 'BÜKME' : 'Ebat'))
const secondaryMetricLabelLine2 = computed(() => (isAbkantCategory.value ? 'UZUNLUĞU' : ''))
const primaryMetricSuffix = computed(() => (isAbkantCategory.value ? ' Ton' : ' kW'))
const secondaryMetricSuffix = computed(() => (isAbkantCategory.value ? ' mm' : ''))

function formatMetric(machine, key, suffix = '') {
  const value = resolveMachineMetricValue(machine, key)

  if (value == null || value === '') {
    return '-'
  }

  return `${value}${suffix}`
}

function displayTitle(machine) {
  return buildMachineTitle(machine) || machine?.title || '-'
}

function isSorted(key) {
  return props.sortKey === key
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
  padding: 16px 12px;
  text-align: left;
  vertical-align: middle;
  white-space: nowrap;
}

.machines-table th {
  font-size: 13px;
  color: #6b7280;
  font-weight: 700;
  text-align: center;
}

.sort-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
  width: 100%;
  min-height: 32px;
  border-radius: 8px;
  transition: color 0.2s ease, background-color 0.2s ease;
}

.sort-btn:hover {
  color: #1d4ed8;
}

.sort-btn.is-active {
  color: #1d4ed8;
  background: rgba(37, 99, 235, 0.08);
}

.sort-btn__multiline {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  line-height: 1.1;
}

.sort-indicator {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  border-radius: 999px;
  background: #dbeafe;
  color: #1d4ed8;
  font-size: 12px;
  font-weight: 800;
}

.actions-header {
  text-align: center !important;
}

.machines-table td {
  font-size: 14px;
  color: #243b53;
}

.thumb {
  width: 56px;
  height: 56px;
  object-fit: cover;
  border-radius: 0;
  border: 1px solid #e5e7eb;
}

.no-image {
  color: #9ca3af;
  font-size: 13px;
}

.status-badge {
  display: inline-block;
  border-radius: 999px;
  padding: 7px 12px;
  font-size: 13px;
  font-weight: 700;
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
.status-btn,
.danger-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: none;
  border-radius: 0;
  min-width: 42px;
  min-height: 38px;
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

.status-btn--published {
  background: #ecfdf5;
  color: #15803d;
}

.status-btn--draft {
  background: #fff1f2;
  color: #b91c1c;
}

.empty-state {
  color: #6b7280;
  padding: 20px 0;
}
</style>
