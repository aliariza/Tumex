import { computed, ref, toValue, watch } from 'vue'
import machinesData from '@/data/machinesData.js'
import { fetchMachines } from '@/api/machines.js'

function getCatalogEntry(machineType) {
  return machinesData[machineType] || {}
}

function buildSeriesSummary(machineType, series, seriesMachines) {
  const machineWithDescription = seriesMachines.find(
    (machine) => String(machine?.description || '').trim()
  )

  if (machineWithDescription?.description) {
    return machineWithDescription.description
  }

  if (machineType === 'abkant') {
    const tonValues = seriesMachines
      .map((machine) => machine.pressForceTon)
      .filter((value) => value != null)
      .sort((a, b) => a - b)

    const lengthValues = seriesMachines
      .map((machine) => machine.bendingLengthMm)
      .filter((value) => value != null)
      .sort((a, b) => a - b)

    const minTon = tonValues[0]
    const maxTon = tonValues[tonValues.length - 1]
    const minLength = lengthValues[0]
    const maxLength = lengthValues[lengthValues.length - 1]

    if (minTon != null && maxTon != null && minLength != null && maxLength != null) {
      return `${series} serisi ${minTon}T - ${maxTon}T ve ${minLength}mm - ${maxLength}mm aralığında abkant tezgahları.`
    }

    return `${series} serisi abkant tezgahları.`
  }

  if (machineType === 'laser-cutting') {
    const powerValues = seriesMachines
      .map((machine) => machine.powerKw)
      .filter((value) => value != null)
      .sort((a, b) => a - b)

    const areaValues = seriesMachines
      .map((machine) => String(machine.workingAreaCode || '').trim())
      .filter(Boolean)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))

    const minPower = powerValues[0]
    const maxPower = powerValues[powerValues.length - 1]
    const minArea = areaValues[0]
    const maxArea = areaValues[areaValues.length - 1]

    if (minPower != null && maxPower != null && minArea && maxArea) {
      return `${series} serisi ${minPower}KW - ${maxPower}KW ve ${minArea} - ${maxArea} ebat aralığında lazer tezgahları.`
    }

    return `${series} serisi lazer tezgahları.`
  }

  return `${series} serisi`
}

function buildSeriesCards(machineType, machines) {
  const grouped = new Map()

  for (const machine of machines) {
    const series = String(machine?.series || '').trim()
    if (!series) continue

    if (!grouped.has(series)) {
      grouped.set(series, [])
    }

    grouped.get(series).push(machine)
  }

  return Array.from(grouped.entries())
    .sort(([a], [b]) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
    )
    .map(([series, seriesMachines]) => {
      const firstWithImage = seriesMachines.find((machine) =>
        String(machine?.image || '').trim()
      )

      return {
        title: `${series} - serisi`,
        text: buildSeriesSummary(machineType, series, seriesMachines),
        href: `/${machineType}/${series}`,
        image: firstWithImage?.image || '/assets/images/no-image.png',
        altText: `${series} serisi görseli`
      }
    })
}

export function useMachineCatalog(machineTypeSource) {
  const machineType = computed(() => toValue(machineTypeSource))
  const catalogEntry = computed(() => getCatalogEntry(machineType.value))

  const machineItems = ref([])
  const loading = ref(false)
  const error = ref('')

  const heroItem = computed(() => catalogEntry.value.item || {})
  const altBolumler = computed(() => catalogEntry.value.altBolumler || {})

  async function loadMachineCatalog() {
    loading.value = true
    error.value = ''

    try {
      const machines = await fetchMachines({
        category: machineType.value
      })

      machineItems.value = buildSeriesCards(machineType.value, machines)
    } catch (requestError) {
      console.error(requestError)
      machineItems.value = []
      error.value = 'Makine listesi alınamadı.'
    } finally {
      loading.value = false
    }
  }

  watch(
    machineType,
    () => {
      loadMachineCatalog()
    },
    { immediate: true }
  )

  return {
    catalogEntry,
    heroItem,
    machineItems,
    altBolumler,
    loading,
    error
  }
}