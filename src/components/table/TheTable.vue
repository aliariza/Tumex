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
              <span v-if="!isStandart" class="chevron"><chevron-right /></span>
              <span v-else class="chevron"><chevron-down /></span>
            </div>
          </td>
        </tr>

        <tr v-show="isStandart" v-for="(row, index) in tableData" :key="index">
          <td>{{ row.key }}</td>
          <td v-if="row.options">
            <dropdown-cell
              :options="row.options"
              :selected="dropdowns[row.key]?.selected ?? 'SEÇİNİZ'"
              :open="dropdowns[row.key]?.open ?? false"
              @toggle="toggleDropdown(row.key)"
              @select="(val) => selectOption(row.key, val)"
            />
          </td>
          <td v-else>{{ row.value }}</td>
        </tr>

        <tr v-show="isStandart" v-for="detail in selectedDetails" :key="detail.key">
          <td>{{ detail.key }}</td>
          <td>{{ getDetailValue(detail) }}</td>
        </tr>
      </tbody>

      <tbody @click="showOption">
        <tr :style="headerStyle">
          <td>Opsiyonlar</td>
          <td>
            <div class="felan" style="justify-content: flex-end">
              <span v-if="!isOption" class="chevron"><chevron-right /></span>
              <span v-else class="chevron"><chevron-down /></span>
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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRoute } from 'vue-router'
import ChevronDown from '../icons/ChevronDown.vue'
import ChevronRight from '../icons/ChevronRight.vue'
import DropdownCell from './DropdownCell.vue'

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
const isStandart = ref(true)
const isOption = ref(false)
const DEFAULT_DROPDOWN_VALUE = 'SEÇİNİZ'

// Unified dropdown state: { [rowKey]: { selected, open } }
const dropdowns = ref({})

function createDropdownState(tableData) {
  const state = {}
  for (const row of tableData) {
    if (row.options) {
      state[row.key] = { selected: DEFAULT_DROPDOWN_VALUE, open: false }
    }
  }
  return state
}

function initDropdowns() {
  dropdowns.value = createDropdownState(props.tableData)
}

initDropdowns()

function toggleDropdown(key) {
  for (const k of Object.keys(dropdowns.value)) {
    if (k === key) {
      dropdowns.value[k].open = !dropdowns.value[k].open
    } else {
      dropdowns.value[k].open = false
    }
  }
}

function selectOption(key, value) {
  if (dropdowns.value[key]) {
    dropdowns.value[key].selected = value
    dropdowns.value[key].open = false
  }
}

function outsideClickListener() {
  // Close all dropdowns when clicking outside
  for (const k of Object.keys(dropdowns.value)) {
    dropdowns.value[k].open = false
  }
}

onMounted(() => document.addEventListener('click', outsideClickListener))
onBeforeUnmount(() => document.removeEventListener('click', outsideClickListener))

const productType = computed(() => route.params.productType)

function getSelectedDropdownValues(state) {
  const keys = Object.keys(state)
  return {
    primary: state[keys[0]]?.selected,
    secondary: state[keys[1]]?.selected
  }
}

function getSelectedModelDetails(modelData, selections) {
  if (!modelData) return null

  const { primary, secondary } = selections
  if (primary && primary !== DEFAULT_DROPDOWN_VALUE && modelData[primary]) {
    if (secondary && secondary !== DEFAULT_DROPDOWN_VALUE && modelData[primary][secondary]) {
      return modelData[primary][secondary]
    }

    if (!secondary || secondary === DEFAULT_DROPDOWN_VALUE) {
      return modelData[primary]
    }
  }

  return null
}

const selectedDetails = computed(() => {
  const modelData = props.machines[productType.value]
  return getSelectedModelDetails(modelData, getSelectedDropdownValues(dropdowns.value))
})

const headerStyle = {
  backgroundColor: 'var(--c-background-table-header)',
  borderTop: '1px solid var(--c-main)'
}

function showStandard() {
  if (!isStandart.value) {
    isStandart.value = true
    isOption.value = false
  }
}

function showOption() {
  if (!isOption.value) {
    isStandart.value = false
    isOption.value = true
  }
}

function getDetailValue(detail) {
  for (const key in detail) {
    if (key !== 'key' && detail[key]) return detail[key]
  }
  return ''
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
