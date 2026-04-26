import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { fetchMachines } from '@/features/machines/services/machineApi.js'
import { MODEL_DATA } from '@/data/modelData.js'
import { getProductBrochure } from '@/data/productBrochures.js'

function getModelContent(productType) {
  return MODEL_DATA[productType] || {}
}

function sortNumericKeys(values) {
  return Array.from(values)
    .map(Number)
    .filter(Number.isFinite)
    .sort((a, b) => a - b)
    .map(String)
}

function groupAbkantMachinesForTable(machines) {
  const grouped = {}

  for (const machine of machines) {
    const ton = String(machine.pressForceTon ?? '')
    const length = String(machine.bendingLengthMm ?? '')

    if (!ton || !length) continue

    if (!grouped[ton]) {
      grouped[ton] = {}
    }

    grouped[ton][length] = machine.specs || []
  }

  return grouped
}

function groupLaserMachinesForTable(machines) {
  const grouped = {}

  for (const machine of machines) {
    let power = machine.powerKw != null ? `${machine.powerKw}KW` : ''
    let size = String(machine.workingAreaCode ?? '')

    if ((!power || !size) && machine.model) {
      const match = String(machine.model).match(/-(\d+)KW-(\d+)$/i)
      if (match) {
        power = `${match[1]}KW`
        size = match[2]
      }
    }

    if (!power || !size) continue

    if (!grouped[power]) {
      grouped[power] = {}
    }

    grouped[power][size] = machine.specs || []
  }

  return grouped
}

export function useProductPage() {
  const route = useRoute()
  const abkantMachines = ref({})
  const laserMachines = ref({})
  const loading = ref(false)
  const error = ref('')

  const machineType = computed(() => route.params.machineType)
  const productType = computed(() => route.params.productType)

  const isApiDrivenType = computed(() =>
    machineType.value === 'abkant' || machineType.value === 'laser-cutting'
  )

  const laserPowerOptions = computed(() =>
    Object.keys(laserMachines.value).sort(
      (a, b) => Number(a.replace('KW', '')) - Number(b.replace('KW', ''))
    )
  )

  const laserSizeOptions = computed(() => {
    const sizes = new Set()

    Object.values(laserMachines.value).forEach((sizeMap) => {
      Object.keys(sizeMap || {}).forEach((size) => {
        sizes.add(size)
      })
    })

    return sortNumericKeys(sizes)
  })

  const abkantTonOptions = computed(() =>
    sortNumericKeys(Object.keys(abkantMachines.value))
  )

  const abkantLengthOptions = computed(() => {
    const lengths = new Set()

    Object.values(abkantMachines.value).forEach((lengthMap) => {
      Object.keys(lengthMap || {}).forEach((length) => {
        lengths.add(length)
      })
    })

    return sortNumericKeys(lengths)
  })

  const currentTableData = computed(() => {
    if (machineType.value === 'laser-cutting') {
      return [
        {
          key: 'LAZER GÜCÜ',
          value: 'SEÇİNİZ',
          options: laserPowerOptions.value
        },
        {
          key: 'EBAT SEÇİN (mm)',
          value: 'SEÇİNİZ',
          options: laserSizeOptions.value
        }
      ]
    }

    if (machineType.value === 'abkant') {
      return [
        {
          key: 'TONAJ SEÇİN (ton)',
          value: 'SEÇİNİZ',
          options: abkantTonOptions.value
        },
        {
          key: 'EBAT SEÇİN (mm)',
          value: 'SEÇİNİZ',
          options: abkantLengthOptions.value
        }
      ]
    }

    return []
  })

  const machineData = computed(() => {
    if (machineType.value === 'abkant') {
      return abkantMachines.value
    }

    if (machineType.value === 'laser-cutting') {
      return laserMachines.value
    }

    return {}
  })

  const brochure = computed(() => getProductBrochure(productType.value))
  const pdfPath = computed(() => brochure.value?.fileName || '')
  const productHighlights = computed(() => brochure.value?.highlights || [])
  const productOptions = computed(() => brochure.value?.optionalFeatures || [])

  const heroItem = computed(() => {
    const data = getModelContent(productType.value)

    return {
      title: data.title || 'Default Title',
      text: data.text || 'Default Text',
      picture: data.picture || 'default-image.jpg',
      altText: data.altText || 'Default Alt Text'
    }
  })

  const altBolumler = computed(() => {
    const data = getModelContent(productType.value)

    return {
      title: data.altTitle || 'Default Alt Title',
      subtitle: data.altSubtitle || 'Default Alt Subtitle',
      paragraph_1: data.paragraph_1 || 'Default Paragraph 1',
      paragraph_2: data.paragraph_2 || 'Default Paragraph 2'
    }
  })

  async function loadMachinesForCurrentType() {
    loading.value = true
    error.value = ''

    if (machineType.value === 'abkant') {
      abkantMachines.value = {}
    }

    if (machineType.value === 'laser-cutting') {
      laserMachines.value = {}
    }

    try {
      if (machineType.value === 'abkant') {
        const machines = await fetchMachines({
          category: 'abkant',
          series: productType.value
        })
        abkantMachines.value = groupAbkantMachinesForTable(machines)
        return
      }

      if (machineType.value === 'laser-cutting') {
        const machines = await fetchMachines({
          category: 'laser-cutting',
          series: productType.value
        })
        laserMachines.value = groupLaserMachinesForTable(machines)
      }
    } catch (requestError) {
      console.error(requestError)
      error.value = 'Makine verileri alınamadı.'
    } finally {
      loading.value = false
    }
  }

  watch(
    () => [machineType.value, productType.value],
    () => {
      loadMachinesForCurrentType()
    },
    { immediate: true }
  )

  return {
    altBolumler,
    currentTableData,
    error,
    heroItem,
    isApiDrivenType,
    loading,
    machineData,
    machineType,
    productOptions,
    pdfPath,
    productHighlights,
    productType
  }
}
