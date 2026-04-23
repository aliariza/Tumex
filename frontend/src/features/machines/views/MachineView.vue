<template>
  <section :class="machineType">
    <the-hero :item="currentItem"></the-hero>
    <alt-bolumler :item="currentAltBolumler"></alt-bolumler>

    <div class="card-container-wrapper">
      <p v-if="loading" class="status-message">
        Veriler yükleniyor...
      </p>

      <p v-else-if="error" class="status-message status-message--error">
        {{ error }}
      </p>

      <div v-else class="card-container">
        <base-card
          v-for="(item, index) in currentItems"
          :key="item.href || index"
          :item="item"
        ></base-card>
      </div>
    </div>
  </section>
</template>

<script setup>
import BaseCard from '@/components/card/BaseCard.vue'
import TheHero from '@/features/site/components/hero/TheHero.vue'
import AltBolumler from '@/features/site/components/altbolumler/AltBolumler.vue'
import { useMachineCatalog } from '../composables/useMachineCatalog.js'

defineOptions({ name: 'MachineView' })

const props = defineProps({
  machineType: {
    type: String,
    required: true,
    validator: (value) => ['laser-cutting', 'abkant'].includes(value)
  }
})

const {
  heroItem: currentItem,
  machineItems: currentItems,
  altBolumler: currentAltBolumler,
  loading,
  error
} = useMachineCatalog(() => props.machineType)
</script>

<style lang="scss" scoped>
.laser-cutting,
.abkant {
  width: 100vw;
  overflow-x: hidden;
  margin-bottom: var(--section-gap);

  .card-container-wrapper {
    max-width: 1050px;
    margin-inline: auto;
    margin-top: var(--section-gap);
    padding-inline: 1rem;
  }

  .card-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 3rem;
    align-items: stretch;

    @media only screen and (max-width: 800px) {
      grid-template-columns: 1fr;
    }
  }
}

.status-message {
  font-size: 1.6rem;
  padding: 1rem 0;
}

.status-message--error {
  color: #c0392b;
}
</style>
