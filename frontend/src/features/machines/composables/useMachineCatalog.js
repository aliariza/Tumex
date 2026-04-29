import { computed, ref, toValue, watch } from 'vue'
import machinesData from '@/data/machinesData.js'
import { fetchMachines } from '@/features/machines/services/machineApi.js'

function isUsablePublicImagePath(value) {
  const image = String(value || '').trim()

  if (!image) return false

  return (
    image.startsWith('http://') ||
    image.startsWith('https://') ||
    image.startsWith('/assets/') ||
    image.startsWith('/images/') ||
    image.startsWith('/')
  )
}

function getCatalogEntry(machineType) {
  return machinesData[machineType] || {}
}

function normalizeRangeNumber(value) {
  const number = Number(value)
  return Number.isFinite(number) && number > 0 ? number : null
}

function resolveLaserPower(machine = {}) {
  const directPower = normalizeRangeNumber(machine.powerKw)
  if (directPower != null) {
    return directPower
  }

  const modelOrTitle = `${machine.model || ''} ${machine.title || ''}`
  const kwMatch = modelOrTitle.match(/(?:^|[-\s])(\d+(?:[.,]\d+)?)\s*KW(?:$|[-\s])/i)
  if (kwMatch) {
    return normalizeRangeNumber(kwMatch[1].replace(',', '.'))
  }

  return null
}

function normalizeAreaCode(value, { strict = false } = {}) {
  const area = String(value || '').trim()

  if (!area || area === '-' || area === '.') {
    return ''
  }

  const compactCode = area.match(/^W?(\d{4})$/i)
  if (compactCode) {
    return compactCode[1]
  }

  const modelCode = area.match(/(?:^|[-\s])W?(\d{4})(?:$|[-\s])/i)
  if (modelCode) {
    return modelCode[1]
  }

  const dimension = area.match(/(\d{4})\s*x\s*(\d{4})/i)
  if (dimension) {
    return `${dimension[1]} x ${dimension[2]}`
  }

  return strict ? '' : area
}

function resolveLaserArea(machine = {}) {
  const directArea = normalizeAreaCode(machine.workingAreaCode)
  if (directArea) {
    return directArea
  }

  const modelArea = normalizeAreaCode(machine.model, { strict: true })
  if (modelArea) {
    return modelArea
  }

  return normalizeAreaCode(machine.title, { strict: true })
}

export function buildSeriesSummary(machineType, series, seriesMachines) {
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
      .map(resolveLaserPower)
      .filter((value) => value != null)
      .sort((a, b) => a - b)

    const areaValues = seriesMachines
      .map(resolveLaserArea)
      .filter(Boolean)
      .filter((value, index, values) => values.indexOf(value) === index)
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

  const machineWithDescription = seriesMachines.find(
    (machine) => String(machine?.description || '').trim()
  )

  if (machineWithDescription?.description) {
    return machineWithDescription.description
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
        isUsablePublicImagePath(machine?.image)
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

function buildStaticNavItems(machineType, series) {
  return series.map((s) => ({
    title: `${s} - serisi`,
    href: `/${machineType}/${s}`,
    image: '/assets/images/no-image.png',
    text: '',
    altText: `${s} serisi görseli`
  }))
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
    // Pre-populate immediately from static data so nav renders at full height
    // before the API response arrives — eliminates the 3-step visual flash
    const staticSeries = catalogEntry.value.series || []
    if (staticSeries.length > 0) {
      machineItems.value = buildStaticNavItems(machineType.value, staticSeries)
    }

    loading.value = true
    error.value = ''

    try {
      const machines = await fetchMachines({
        category: machineType.value
      })

      const cards = buildSeriesCards(machineType.value, machines)

      // Honour the series display order defined in machinesData.js
      const seriesOrder = catalogEntry.value.series || []
      if (seriesOrder.length > 0) {
        cards.sort((a, b) => {
          const aIdx = seriesOrder.findIndex((s) => a.href === `/${machineType.value}/${s}`)
          const bIdx = seriesOrder.findIndex((s) => b.href === `/${machineType.value}/${s}`)
          if (aIdx === -1 && bIdx === -1) return 0
          if (aIdx === -1) return 1
          if (bIdx === -1) return -1
          return aIdx - bIdx
        })
      }

      machineItems.value = cards
    } catch (requestError) {
      console.error(requestError)
      if (machineItems.value.length === 0) machineItems.value = []
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
