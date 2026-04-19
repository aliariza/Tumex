<template>
  <section class="carousel">
    <div class="carousel-inner" :key="item.id">
      <div class="grid-container">
        <div class="item item1">
          <h2 class="over-title">{{ item.overTitle }}</h2>
          <h1 class="disp-2">{{ item.title }}</h1>
        </div>
        <div class="item item2">
          <div class="text-item2">
            <h3 class="text">{{ item.text }}</h3>
          </div>
          <div class="text-item3">
            <h3 class="text">{{ item.textMiddle }}</h3>
          </div>
          <base-button :link="item.link" mode="normal" class="orta">DETAY</base-button>
        </div>
        <div class="item item3"><img :src="item.picture" alt="ürün görseli" /></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import BaseButton from '../../components/navigation/Desktop/button/BaseButton.vue'

defineOptions({ name: 'TheCarousel' })
defineProps({
  item: {
    type: Object,
    required: true
  }
})
</script>

<style scoped lang="scss">
.carousel {
  width: 100vw;
  overflow-x: hidden;
  margin-top: var(--section-gap);

  .carousel-inner {
    max-width: 1200px;
    margin: 0 auto;
    overflow-x: hidden;
  }

  .grid-container {
    display: grid;
    grid-template-columns: 60% 40%;
    grid-template-rows: repeat(3, min-content);
    gap: 2rem;
    margin-inline: auto;
    @media only screen and (max-width: 800px) {
      grid-template-columns: 100%;
      margin-inline: auto;
      padding-inline: 1rem;
      gap: 0.5rem;
      .item1 { grid-area: 1 / 1 / 2 / 2; }
      .item3 { grid-area: 2 / 1 / 3 / 2; }
      .item2 { grid-area: 3 / 1 / 4 / 2; }
    }
  }
  .over-title {
    font-size: 2rem;
    font-weight: 400;
    padding-left: 0.5rem;
  }
  .disp-2 {
    color: var(--c-main);
  }

  .item1,
  .item2 {
    grid-column: 1 / span 1;
  }
  .item1 {
    grid-row: 1 / span 1;
  }
  .item3 {
    grid-column: 2;
    grid-row: 1 / -1;
    display: flex;

    img {
      max-width: 90%;
      max-height: auto;
      object-fit: contain;
    }
  }
  .item2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    @media only screen and (max-width: 800px) {
      grid-template-columns: 1fr;
    }
  }
  .text {
    padding-bottom: 3rem;
  }
  .orta {
    @media only screen and (max-width: 800px) {
      text-align: center;
    }
  }
}
</style>
