import { computed, toValue } from 'vue'
import machinesData from '@/data/machinesData.js'

function getCatalogEntry(machineType) {
  return machinesData[machineType] || {}
}

export function useMachineCatalog(machineTypeSource) {
  const machineType = computed(() => toValue(machineTypeSource))
  const catalogEntry = computed(() => getCatalogEntry(machineType.value))

  const heroItem = computed(() => catalogEntry.value.item || {})
  const machineItems = computed(() => catalogEntry.value.items || [])
  const altBolumler = computed(() => catalogEntry.value.altBolumler || {})

  return {
    catalogEntry,
    heroItem,
    machineItems,
    altBolumler
  }
}
