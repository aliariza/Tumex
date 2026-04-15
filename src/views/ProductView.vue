<template>
  <section class="product-view">
    <product-hero :item="heroItem"></product-hero>
    <alt-bolumler :item="altBolumler"></alt-bolumler>
    <div class="table-section">
      <h2 class="disp-2">Teknik veriler</h2>
      <h1>{{ productType }} serisi</h1>
      <TheTable :tableData="currentTableData" :machines="machineData" />
    </div>
    <highlights-downloads :pdfPath="pdfPath"></highlights-downloads>
  </section>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import ProductHero from '../components/hero/ProductHero.vue'
import TheTable from '../components/table/TheTable.vue'
import AltBolumler from '../components/altbolumler/AltBolumler.vue'
import HighlightsDownloads from '../components/highlightsDownloads/HighlightsDownloads.vue'
import { laserMachinesData } from '../data/laserMachineData.js'
import { abkantMachinesData } from '../data/abkant/abkantMachineData.js'
import { laserWeldingMachinesData } from '../data/laserWeldingMachineData.js'
import { MODEL_DATA } from '../data/modelData.js'

defineOptions({ name: 'ProductView' })

const route = useRoute()

const machineType = computed(() => route.params.machineType)
const productType = computed(() => route.params.productType)

const TABLE_DATA_LASER = [
  {
    key: 'LAZER GÜCÜ',
    value: 'SEÇİNİZ',
    options: ['3KW', '6KW', '12KW', '20KW', '30KW']
  },
  {
    key: 'EBAT SEÇİN (mm)',
    value: 'SEÇİNİZ',
    options: ['3015', '4015', '4020', '6015', '6020', '8025']
  }
]

const TABLE_DATA_ABKANT = [
  {
    key: 'TONAJ SEÇİN (ton)',
    value: 'SEÇİNİZ',
    options: ['30', '40', '50', '63', '80', '100', '125', '160', '200', '250', '300', '400', '500', '600']
  },
  {
    key: 'EBAT SEÇİN (mm)',
    value: 'SEÇİNİZ',
    options: ['1600', '2000', '2500', '3200', '4000', '6000']
  }
]

function getMachineData(type) {
  switch (type) {
    case 'laser-cutting': return laserMachinesData
    case 'abkant': return abkantMachinesData
    case 'laser-welding': return laserWeldingMachinesData
    default: return {}
  }
}

const machineData = ref(getMachineData(machineType.value))
const pdfPath = ref('')

function updateFromRoute(type) {
  machineData.value = getMachineData(type)
  if (type === 'laser-cutting') pdfPath.value = 'Durmark_Laser.pdf'
  else if (type === 'abkant') pdfPath.value = 'DurMarkAbkant.pdf'
  else pdfPath.value = ''
}

// Reactively update when route changes
watch(machineType, (type) => updateFromRoute(type), { immediate: true })

const currentTableData = computed(() =>
  machineType.value === 'laser-cutting' ? TABLE_DATA_LASER : TABLE_DATA_ABKANT
)

const heroItem = computed(() => {
  const data = MODEL_DATA[productType.value] || {}
  return {
    title: data.title || 'Default Title',
    text: data.text || 'Default Text',
    picture: data.picture || 'default-image.jpg',
    altText: data.altText || 'Default Alt Text'
  }
})

const altBolumler = computed(() => {
  const data = MODEL_DATA[productType.value] || {}
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
</style>
