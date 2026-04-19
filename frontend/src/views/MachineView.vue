<template>
  <section :class="machineType">
    <the-hero :item="currentItem"></the-hero>
    <alt-bolumler :item="currentAltBolumler"></alt-bolumler>
    <div class="card-container">
      <base-card v-for="(item, index) in currentItems" :key="index" :item="item"></base-card>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import machinesData from '../data/machinesData.js'
import BaseCard from '../components/card/BaseCard.vue'
import TheHero from '../components/hero/TheHero.vue'
import AltBolumler from '../components/altbolumler/AltBolumler.vue'

defineOptions({ name: 'MachineView' })

const props = defineProps({
  machineType: {
    type: String,
    required: true,
    validator: (value) => ['laser-cutting', 'abkant'].includes(value)
  }
})

const machineData = computed(() => machinesData[props.machineType] || {})
const currentItem = computed(() => machineData.value.item || {})
const currentItems = computed(() => machineData.value.items || [])
const currentAltBolumler = computed(() => machineData.value.altBolumler || {})
</script>

<style lang="scss" scoped>
.laser-cutting,
.abkant {
  width: 100vw;
  overflow-x: hidden;
  margin-bottom: var(--section-gap);

  .card-container {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 5rem;
    max-width: 1050px;
    margin-inline: auto;
    margin-top: var(--section-gap);
    @media only screen and (max-width: 800px) {
      grid-template-columns: 1fr;
    }
  }
}
</style>
