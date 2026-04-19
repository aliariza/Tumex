<template>
  <section class="product-view">
    <ProductHero :item="heroItem" />
    <AltBolumler :item="altBolumler" />

    <div class="table-section">
      <h2 class="disp-2">Teknik veriler</h2>
      <h1>{{ productType }} serisi</h1>

      <div
        v-if="isApiDrivenType && loading"
        class="status-message"
      >
        Veriler yükleniyor...
      </div>

      <div
        v-else-if="isApiDrivenType && error"
        class="status-message error"
      >
        {{ error }}
      </div>

      <TheTable
        v-else
        :tableData="currentTableData"
        :machines="machineData"
      />
    </div>

    <HighlightsDownloads :pdfPath="pdfPath" />
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductHero from '../components/hero/ProductHero.vue'
import TheTable from '../components/table/TheTable.vue'
import AltBolumler from '../components/altbolumler/AltBolumler.vue'
import HighlightsDownloads from '../components/highlightsDownloads/HighlightsDownloads.vue'
import { MODEL_DATA } from '../data/modelData.js'
import { fetchMachines } from '../api/machines.js'

defineOptions({ name: 'ProductView' })

const route = useRoute()

const abkantMachines = ref({})
const laserApiMachines = ref({})
const loading = ref(false)
const error = ref('')

const machineType = computed(() => route.params.machineType)
const productType = computed(() => route.params.productType)

const isApiDrivenType = computed(() =>
  machineType.value === 'abkant' || machineType.value === 'laser-cutting'
)

const PDF_BY_MACHINE_TYPE = {
  'laser-cutting': 'Durmark_Laser.pdf',
  abkant: 'DurMarkAbkant.pdf'
}

const laserPowerOptions = computed(() =>
  Object.keys(laserApiMachines.value).sort(
    (a, b) => Number(a.replace('KW', '')) - Number(b.replace('KW', ''))
  )
)

const laserSizeOptions = computed(() => {
  const sizes = new Set()

  Object.values(laserApiMachines.value).forEach(sizeMap => {
    Object.keys(sizeMap || {}).forEach(size => {
      sizes.add(size)
    })
  })

  return Array.from(sizes)
    .map(Number)
    .filter(Number.isFinite)
    .sort((a, b) => a - b)
    .map(String)
})

const tableDataLaser = computed(() => [
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
])

const abkantTonOptions = computed(() =>
  Object.keys(abkantMachines.value)
    .map(Number)
    .filter(Number.isFinite)
    .sort((a, b) => a - b)
    .map(String)
)

const abkantLengthOptions = computed(() => {
  const lengths = new Set()

  Object.values(abkantMachines.value).forEach(lengthMap => {
    Object.keys(lengthMap || {}).forEach(length => {
      lengths.add(length)
    })
  })

  return Array.from(lengths)
    .map(Number)
    .filter(Number.isFinite)
    .sort((a, b) => a - b)
    .map(String)
})

const tableDataAbkant = computed(() => [
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
])

watch(
  () => [machineType.value, productType.value],
  () => {
    loadMachinesForCurrentType()
  },
  { immediate: true }
)

function getModelData(type) {
  return MODEL_DATA[type] || {}
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

async function loadMachinesForCurrentType() {
  loading.value = true
  error.value = ''

  if (machineType.value === 'abkant') {
    abkantMachines.value = {}
  }

  if (machineType.value === 'laser-cutting') {
    laserApiMachines.value = {}
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
      laserApiMachines.value = groupLaserMachinesForTable(machines)
      return
    }
  } catch (err) {
    console.error(err)
    error.value = 'Makine verileri alınamadı.'
  } finally {
    loading.value = false
  }
}

const machineData = computed(() => {
  if (machineType.value === 'abkant') {
    return abkantMachines.value
  }

  if (machineType.value === 'laser-cutting') {
    return laserApiMachines.value
  }

  return {}
})

const pdfPath = computed(() => PDF_BY_MACHINE_TYPE[machineType.value] || '')

const currentTableData = computed(() => {
  if (machineType.value === 'laser-cutting') {
    return tableDataLaser.value
  }

  if (machineType.value === 'abkant') {
    return tableDataAbkant.value
  }

  return []
})

const heroItem = computed(() => {
  const data = getModelData(productType.value)
  return {
    title: data.title || 'Default Title',
    text: data.text || 'Default Text',
    picture: data.picture || 'default-image.jpg',
    altText: data.altText || 'Default Alt Text'
  }
})

const altBolumler = computed(() => {
  const data = getModelData(productType.value)
  return {
    title: data.altTitle || 'Default Alt Title',
    subtitle: data.altSubtitle || 'Default Alt Subtitle',
    paragraph_1: data.paragraph_1 || 'Default Paragraph 1',
    paragraph_2: data.paragraph_2 || 'Default Paragraph 2'
  }
})
</script>

<style lang="scss" scoped>
.product-view {
  width: 100vw;
}

.table-section {
  max-width: 1050px;
  margin: var(--section-gap) auto;
  padding-inline: 3rem;
}

.disp-2 {
  color: var(--c-main);

  @media only screen and (max-width: 800px) {
    font-size: 5rem;
  }
}

h1 {
  padding: 0 1rem;
}

.status-message {
  padding: 1rem;
  margin: 1rem 0;
  font-size: 1.6rem;
}

.status-message.error {
  color: #c0392b;
}
</style>