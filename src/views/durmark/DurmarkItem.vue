<template>
  <section class="durmark-item" v-for="item in items" :key="item.header">
    <div class="durmark-item-inner">
      <div class="item-left">
        <TheLoading v-if="!imageLoaded" />
        <img
          v-lazy="{ src: item.image, loading: '', error: '' }"
          alt="MileStone-picture"
          @load="imageLoaded = true"
          :class="{ loaded: imageLoaded }"
        />
      </div>
      <div class="item-right">
        <div class="item-right-header">
          <h1 class="disp-1">{{ item.header }}</h1>
        </div>
        <div class="item-right-paragraph">
          <h5>{{ item.paragraph }}</h5>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import TheLoading from '../../components/TheLoading.vue'

defineOptions({ name: 'DurmarkItem' })

defineProps({
  items: {
    type: Array,
    required: true,
    validator: (value) =>
      value.every(
        (item) =>
          typeof item.header === 'string' &&
          typeof item.paragraph === 'string' &&
          typeof item.image === 'string'
      )
  }
})

const imageLoaded = ref(false)
</script>

<style lang="scss" scoped>
.durmark-item {
  padding: 1rem 0;

  &:nth-child(odd) { background-color: var(--c-background-table); }
  &:nth-child(even) { background-color: white; }

  .durmark-item-inner {
    max-width: 800px;
    display: grid;
    grid-template-columns: 30% 65%;
    gap: 5rem;
    margin: 2rem auto;

    @media only screen and (max-width: 800px) {
      grid-template-columns: 1fr;
      padding-inline: 5rem;
    }
    .item-left {
      display: flex;
      align-items: center;
      order: 0;
      @media only screen and (max-width: 800px) { order: 1; }

      img {
        width: 100%;
        object-fit: cover;
        opacity: 0;
        transition: opacity 0.3s;
        &.loaded { opacity: 1; }
      }
    }

    .item-right {
      display: flex;
      align-items: flex-start;
      flex-direction: column;
      justify-content: center;

      @media only screen and (max-width: 800px) {
        text-align: center;
        align-items: center;
        order: -1;
      }

      h1.disp-1 { color: var(--c-main); }
      h5 { color: var(--c-grey); }
    }
  }
}
</style>
