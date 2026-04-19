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
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
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
const dropdowns = ref({})

const productType = computed(() => route.params.productType)

const dropdownRowKeys = computed(() =>
  props.tableData.filter(row => row.options).map(row => row.key)
)

const primaryRowKey = computed(() => dropdownRowKeys.value[0] || '')
const secondaryRowKey = computed(() => dropdownRowKeys.value[1] || '')

const selectedPrimaryValue = computed(() =>
  dropdowns.value[primaryRowKey.value]?.selected ?? DEFAULT_DROPDOWN_VALUE
)

function createDropdownState(tableData) {
  const state = {}

  for (const row of tableData) {
    if (row.options) {
      state[row.key] = {
        selected: DEFAULT_DROPDOWN_VALUE,
        open: false
      }
    }
  }

  return state
}

function initDropdowns() {
  dropdowns.value = createDropdownState(props.tableData)
}

watch(
  () => props.tableData,
  () => {
    initDropdowns()
  },
  { immediate: true, deep: true }
)

function toggleDropdown(key) {
  for (const k of Object.keys(dropdowns.value)) {
    dropdowns.value[k].open = k === key ? !dropdowns.value[k].open : false
  }
}

function selectOption(key, value) {
  if (!dropdowns.value[key]) return

  dropdowns.value[key].selected = value
  dropdowns.value[key].open = false

  if (
    key === primaryRowKey.value &&
    secondaryRowKey.value &&
    dropdowns.value[secondaryRowKey.value]
  ) {
    dropdowns.value[secondaryRowKey.value].selected = DEFAULT_DROPDOWN_VALUE
    dropdowns.value[secondaryRowKey.value].open = false
  }
}

function outsideClickListener() {
  for (const k of Object.keys(dropdowns.value)) {
    dropdowns.value[k].open = false
  }
}

onMounted(() => document.addEventListener('click', outsideClickListener))
onBeforeUnmount(() => document.removeEventListener('click', outsideClickListener))

function getSelectedDropdownValues(state) {
  const keys = Object.keys(state)

  return {
    primary: state[keys[0]]?.selected,
    secondary: state[keys[1]]?.selected
  }
}

function resolveModelData() {
  if (!props.machines || typeof props.machines !== 'object') {
    return null
  }

  if (props.machines[productType.value]) {
    return props.machines[productType.value]
  }

  return props.machines
}

function getSelectedModelDetails(modelData, selections) {
  if (!modelData) return []

  const { primary, secondary } = selections

  if (!primary || primary === DEFAULT_DROPDOWN_VALUE) return []

  const primaryData = modelData[primary]
  if (!primaryData) return []

  if (!secondary || secondary === DEFAULT_DROPDOWN_VALUE) return []

  const details = primaryData[secondary]
  return Array.isArray(details) ? details : []
}

const selectedDetails = computed(() => {
  const modelData = resolveModelData()
  const selections = getSelectedDropdownValues(dropdowns.value)
  return getSelectedModelDetails(modelData, selections)
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

function getSecondaryOptions() {
  const modelData = resolveModelData()
  const primary = selectedPrimaryValue.value

  if (!modelData || !primary || primary === DEFAULT_DROPDOWN_VALUE) {
    return []
  }

  const primaryData = modelData[primary]
  if (!primaryData || typeof primaryData !== 'object') {
    return []
  }

  return Object.keys(primaryData)
    .map(Number)
    .filter(Number.isFinite)
    .sort((a, b) => a - b)
    .map(String)
}

function getOptionsForRow(rowKey, fallbackOptions = []) {
  if (rowKey === secondaryRowKey.value) {
    return getSecondaryOptions()
  }

  return fallbackOptions
}

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