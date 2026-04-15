<template>
  <section class="product-view">
    <ProductHero :item="heroItem"></ProductHero>
    <AltBolumler :item="altBolumler"></AltBolumler>
    <div class="table-section">
      <h2 class="disp-2">Teknik veriler</h2>
      <h1>{{ productType }} serisi</h1>
      <TheTable :tableData="currentTableData" :machines="machineData" />
    </div>
    <HighlightsDownloads :pdfPath="pdfPath"></HighlightsDownloads>
  </section>
</template>

<script setup>
import { computed } from 'vue'
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

const MACHINE_DATA_BY_TYPE = {
  'laser-cutting': laserMachinesData,
  abkant: abkantMachinesData,
  'laser-welding': laserWeldingMachinesData
}

const PDF_BY_MACHINE_TYPE = {
  'laser-cutting': 'Durmark_Laser.pdf',
  abkant: 'DurMarkAbkant.pdf'
}

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

function getModelData(type) {
  return MODEL_DATA[type] || {}
}

const machineData = computed(() => MACHINE_DATA_BY_TYPE[machineType.value] || {})
const pdfPath = computed(() => PDF_BY_MACHINE_TYPE[machineType.value] || '')

const currentTableData = computed(() =>
  machineType.value === 'laser-cutting' ? TABLE_DATA_LASER : TABLE_DATA_ABKANT
)

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
</style>
