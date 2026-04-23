<template>
  <section>
    <table>
      <colgroup>
        <col style="width: 50%" />
        <col style="width: 50%" />
      </colgroup>

      <tbody @click="showStandard">
        <tr :style="headerStyle">
          <td>Standart</td>
          <td>
            <div class="felan" style="justify-content: flex-end">
              <span v-if="!isStandart" class="chevron"><ChevronRight /></span>
              <span v-else class="chevron"><ChevronDown /></span>
            </div>
          </td>
        </tr>

        <tr
          v-for="(row, index) in tableData"
          :key="index"
          v-show="isStandart"
        >
          <td>{{ row.key }}</td>
          <td v-if="row.options">
            <DropdownCell
              :options="getOptionsForRow(row.key, row.options)"
              :selected="dropdowns[row.key]?.selected ?? DEFAULT_DROPDOWN_VALUE"
              :open="dropdowns[row.key]?.open ?? false"
              @toggle="toggleDropdown(row.key)"
              @select="(val) => selectOption(row.key, val)"
            />
          </td>
          <td v-else>{{ row.value }}</td>
        </tr>

        <tr
          v-for="detail in selectedDetails"
          :key="detail.key"
          v-show="isStandart"
        >
          <td>{{ detail.label || detail.key }}</td>
          <td>{{ getDetailValue(detail) }}</td>
        </tr>
      </tbody>

      <tbody @click="showOption">
        <tr :style="headerStyle">
          <td>Opsiyonlar</td>
          <td>
            <div class="felan" style="justify-content: flex-end">
              <span v-if="!isOption" class="chevron"><ChevronRight /></span>
              <span v-else class="chevron"><ChevronDown /></span>
            </div>
          </td>
        </tr>
        <tr v-show="isOption">
          <td colspan="2">Henüz hazır değil.</td>
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script setup>
import { toRef } from 'vue'
import { useRoute } from 'vue-router'
import ChevronDown from '@/shared/components/icons/ChevronDown.vue'
import ChevronRight from '@/shared/components/icons/ChevronRight.vue'
import DropdownCell from './DropdownCell.vue'
import { useMachineSpecsTable } from '@/features/machines/composables/useMachineSpecsTable.js'

defineOptions({ name: 'TheTable' })

const props = defineProps({
  tableData: {
    type: Array,
    required: true
  },
  machines: {
    type: Object,
    required: true
  }
})

const route = useRoute()
const productType = toRef(route.params, 'productType')

const {
  DEFAULT_DROPDOWN_VALUE,
  dropdowns,
  getOptionsForRow,
  isOption,
  isStandart,
  selectedDetails,
  selectOption,
  showOption,
  showStandard,
  toggleDropdown
} = useMachineSpecsTable({
  tableData: toRef(props, 'tableData'),
  machines: toRef(props, 'machines'),
  productType
})

function getDetailValue(detail) {
  if (!detail || typeof detail !== 'object') return ''

  if ('value' in detail) {
    return detail.value ?? ''
  }

  for (const key in detail) {
    if (key !== 'key' && detail[key]) return detail[key]
  }

  return ''
}
const headerStyle = {
  backgroundColor: 'var(--c-background-table-header)',
  borderTop: '1px solid var(--c-main)'
}
</script>

<style lang="scss" scoped>
section {
  max-width: 1050px;
  margin: 2rem 0;
}

table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  font-size: 1.8rem;

  tr {
    &:nth-child(odd) {
      background: none;
    }

    &:nth-child(even) {
      background-color: var(--c-background-table);

      & > td {
        border-top: 1px solid var(--c-main);
        border-bottom: 1px solid var(--c-main);
      }
    }

    td {
      padding: 0.8rem;

      .felan {
        display: flex;
        justify-content: space-between;
        align-items: center;

        span.chevron {
          width: 2rem;
          height: 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
}
</style>
