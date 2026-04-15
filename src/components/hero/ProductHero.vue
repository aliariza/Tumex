<template>
  <section class="product-hero">
    <div class="overlay"></div>
    <div class="product-hero-inside">
      <div class="product-hero-header">
        <h1 class="disp-1">{{ item.title }}</h1>
        <h3 class="text">{{ item.text }}</h3>
      </div>
      <div class="product-img-container">
        <img :src="item.picture" :alt="item.altText || 'Ürün Görseli'" />
      </div>
    </div>
  </section>
</template>

<script setup>
defineOptions({ name: 'ProductHero' })

defineProps({
  item: {
    type: Object,
    required: true,
    validator: (prop) => {
      const required = ['title', 'text', 'picture']
      return required.every((field) => Object.prototype.hasOwnProperty.call(prop, field))
    }
  }
})
</script>

<style lang="scss" scoped>
.product-hero {
  width: 100vw;
  height: fit-content;
  display: flex;
  align-items: center;
  background-image: url('/assets/images/product-background.webp');
  position: relative;
  padding-inline: 15rem;

  @media only screen and (max-width: 1000px) {
    height: fit-content;
    text-align: center;
    padding-inline: 5rem;
    padding-block: 2rem;
  }
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(169, 169, 169, 0.8) 50%);
  overflow-x: hidden;
}
.product-hero-inside {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 50%);
  margin-inline: auto;
  z-index: 5;
  align-items: center;
  @media only screen and (max-width: 1000px) {
    grid-template-columns: 1fr;
    .product-hero-header {
      grid-area: 2 / 1 / 3 / 1;
      justify-self: center;
    }
    .product-img-container {
      grid-area: 1 / 1 / 2 / 1;
    }
  }
}
.product-hero-header {
  justify-self: flex-start;
}
.product-img-container {
  max-width: 100%;
  height: auto;
  justify-self: flex-end;
  img {
    width: 80%;
    height: auto;
    object-fit: cover;
  }
}
.text {
  line-height: 6rem;
  font-weight: 600;
}
</style>
