import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const DEFAULT_DROPDOWN_VALUE = 'SEÇİNİZ'

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

function getSelectedDropdownValues(state) {
  const keys = Object.keys(state)

  return {
    primary: state[keys[0]]?.selected,
    secondary: state[keys[1]]?.selected
  }
}

function getSelectedMachine(modelData, selections) {
  if (!modelData) return null

  const { primary, secondary } = selections

  if (!primary || primary === DEFAULT_DROPDOWN_VALUE) return null

  const primaryData = modelData[primary]
  if (!primaryData) return null

  if (!secondary || secondary === DEFAULT_DROPDOWN_VALUE) return null

  const selected = primaryData[secondary]

  if (!selected) return null

  if (Array.isArray(selected)) {
    return {
      specs: selected
    }
  }

  return selected
}
function closeDropdowns(dropdowns) {
  for (const key of Object.keys(dropdowns.value)) {
    dropdowns.value[key].open = false
  }
}

export function useMachineSpecsTable({ tableData, machines, productType }) {
  const isStandart = ref(true)
  const isOption = ref(false)
  const dropdowns = ref({})

  const dropdownRowKeys = computed(() =>
    tableData.value.filter((row) => row.options).map((row) => row.key)
  )

  const primaryRowKey = computed(() => dropdownRowKeys.value[0] || '')
  const secondaryRowKey = computed(() => dropdownRowKeys.value[1] || '')

  const selectedPrimaryValue = computed(
    () =>
      dropdowns.value[primaryRowKey.value]?.selected ?? DEFAULT_DROPDOWN_VALUE
  )

  const resolvedModelData = computed(() => {
    if (!machines.value || typeof machines.value !== 'object') {
      return null
    }

    if (machines.value[productType.value]) {
      return machines.value[productType.value]
    }

    return machines.value
  })

  const selectedMachine = computed(() => {
    const selections = getSelectedDropdownValues(dropdowns.value)
    return getSelectedMachine(resolvedModelData.value, selections)
  })

  const selectedDetails = computed(() => {
    return selectedMachine.value?.specs || []
  })

  function initDropdowns() {
    dropdowns.value = createDropdownState(tableData.value)
  }

  function toggleDropdown(key) {
    for (const currentKey of Object.keys(dropdowns.value)) {
      dropdowns.value[currentKey].open = currentKey === key
        ? !dropdowns.value[currentKey].open
        : false
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

  function getSecondaryOptions() {
    const primary = selectedPrimaryValue.value

    if (
      !resolvedModelData.value ||
      !primary ||
      primary === DEFAULT_DROPDOWN_VALUE
    ) {
      return []
    }

    const primaryData = resolvedModelData.value[primary]
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

  watch(
    tableData,
    () => {
      initDropdowns()
    },
    { immediate: true, deep: true }
  )

  onMounted(() => {
    document.addEventListener('click', handleOutsideClick)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleOutsideClick)
  })

  function handleOutsideClick() {
    closeDropdowns(dropdowns)
  }

  return {
    DEFAULT_DROPDOWN_VALUE,
    dropdowns,
    getOptionsForRow,
    isOption,
    isStandart,
    selectedDetails,
    selectedMachine,
    selectOption,
    showOption,
    showStandard,
    toggleDropdown
  }
}
