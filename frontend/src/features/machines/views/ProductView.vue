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
        :productOptions="productOptions"
        @machine-selected="selectedMachine = $event"
      />
    </div>

    <HighlightsDownloads
      :pdfPath="selectedMachineBrochurePath"
      :highlights="productHighlights"
      :productTitle="heroItem.title"
    />
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import ProductHero from '@/features/site/components/hero/ProductHero.vue'
import TheTable from '@/components/table/TheTable.vue'
import AltBolumler from '@/features/site/components/altbolumler/AltBolumler.vue'
import HighlightsDownloads from '@/components/highlightsDownloads/HighlightsDownloads.vue'
import { useProductPage } from '../composables/useProductPage.js'

defineOptions({ name: 'ProductView' })

const {
  altBolumler,
  currentTableData,
  error,
  heroItem,
  isApiDrivenType,
  loading,
  machineData,
  pdfPath,
  productHighlights,
  productOptions,
  productType
} = useProductPage()

const selectedMachine = ref(null)

const selectedMachineBrochurePath = computed(() => {
  if (!selectedMachine.value?._id) {
    return pdfPath.value
  }

  return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'}/machines/${selectedMachine.value._id}/brochure.pdf`
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
