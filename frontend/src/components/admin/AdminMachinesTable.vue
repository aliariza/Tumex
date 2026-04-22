<template>
  <div class="table-wrapper">
    <table v-if="machines.length" class="machines-table">
      <thead>
        <tr>
          <th>Görsel</th>
          <th>
            <button class="sort-btn" type="button" @click="$emit('sort', 'title')">
              Başlık {{ sortKey === 'title' ? sortArrow : '' }}
            </button>
          </th>
          <th>
            <button class="sort-btn" type="button" @click="$emit('sort', 'brand')">
              Marka {{ sortKey === 'brand' ? sortArrow : '' }}
            </button>
          </th>
          <th>
            <button class="sort-btn" type="button" @click="$emit('sort', 'family')">
              Aile {{ sortKey === 'family' ? sortArrow : '' }}
            </button>
          </th>
          <th>
            <button class="sort-btn" type="button" @click="$emit('sort', 'series')">
              Seri {{ sortKey === 'series' ? sortArrow : '' }}
            </button>
          </th>
          <th>
            <button class="sort-btn" type="button" @click="$emit('sort', 'model')">
              Model {{ sortKey === 'model' ? sortArrow : '' }}
            </button>
          </th>
          <th>
            <button class="sort-btn" type="button" @click="$emit('sort', primaryMetricKey)">
              {{ primaryMetricLabel }} {{ sortKey === primaryMetricKey ? sortArrow : '' }}
            </button>
          </th>
          <th>
            <button class="sort-btn" type="button" @click="$emit('sort', secondaryMetricKey)">
              <span class="sort-btn__multiline">
                <span>{{ secondaryMetricLabelLine1 }}</span>
                <span>{{ secondaryMetricLabelLine2 }}</span>
              </span>
              {{ sortKey === secondaryMetricKey ? sortArrow : '' }}
            </button>
          </th>
          <th>Durum</th>
          <th class="actions-header">İşlem</th>
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
import { buildMachineTitle } from '@/services/adminMachineHelpers'

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
const primaryMetricLabel = computed(() => (isAbkantCategory.value ? 'Tonaj' : 'Lazer Gücü'))
const secondaryMetricLabelLine1 = computed(() => (isAbkantCategory.value ? 'Bükme' : 'Ebat'))
const secondaryMetricLabelLine2 = computed(() => (isAbkantCategory.value ? 'Uzunluğu' : ''))
const primaryMetricSuffix = computed(() => (isAbkantCategory.value ? ' Ton' : ' kW'))
const secondaryMetricSuffix = computed(() => (isAbkantCategory.value ? ' mm' : ''))

function formatMetric(machine, key, suffix = '') {
  const value = resolveMetricValue(machine, key)

  if (value == null || value === '') {
    return '-'
  }

  return `${value}${suffix}`
}

function resolveMetricValue(machine, key) {
  const directValue = machine?.[key]
  if (directValue != null && directValue !== '') {
    return directValue
  }

  const specs = Array.isArray(machine?.specs) ? machine.specs : []

  if (key === 'powerKw') {
    const specValue = specs.find((spec) =>
      ['power', 'power_kw', 'laser_power', 'powerkw'].includes(String(spec?.key || '').toLowerCase()) ||
      /g[uü]c|power|kw/i.test(String(spec?.label || ''))
    )?.value

    if (specValue) {
      const match = String(specValue).match(/(\d+(?:[.,]\d+)?)\s*(?:KW|W)/i)
      if (match) {
        const parsed = Number(match[1].replace(',', '.'))
        if (Number.isFinite(parsed)) {
          return /W/i.test(String(specValue)) && !/KW/i.test(String(specValue)) ? parsed / 1000 : parsed
        }
      }

      return specValue
    }

    const modelOrTitle = `${machine?.model || ''} ${machine?.title || ''}`
    const match = modelOrTitle.match(/(?:^|[-\s])(\d+(?:[.,]\d+)?)\s*KW(?:$|[-\s])/i)
    if (match) {
      const parsed = Number(match[1].replace(',', '.'))
      return Number.isFinite(parsed) ? parsed : ''
    }

    const wattMatch = modelOrTitle.match(/(?:^|[-\s])(\d{4,5})\s*W(?:$|[-\s])/i)
    if (wattMatch) {
      const parsed = Number(wattMatch[1])
      return Number.isFinite(parsed) ? parsed / 1000 : ''
    }

    return ''
  }

  if (key === 'workingAreaCode') {
    const specValue = specs.find((spec) =>
      ['size', 'working_area', 'working_area_code', 'ebat'].includes(String(spec?.key || '').toLowerCase()) ||
      /ebat|size|area|alan/i.test(String(spec?.label || ''))
    )?.value

    if (specValue) {
      return specValue
    }

    const modelOrTitle = `${machine?.model || ''} ${machine?.title || ''}`
    const match = modelOrTitle.match(/(?:^|[-\s])(\d{4})(?:$|[-\s])/)
    if (match) {
      return match[1]
    }

    return ''
  }

  return directValue
}

function displayTitle(machine) {
  return buildMachineTitle(machine) || machine?.title || '-'
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
}

.sort-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  color: inherit;
  cursor: pointer;
}

.sort-btn__multiline {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.1;
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
