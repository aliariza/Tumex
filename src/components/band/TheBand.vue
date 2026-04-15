<template>
  <section class="band">
    <div
      class="img-container"
      :style="{
        'background-image': 'url(' + icerik.image + ')',
        'background-position': icerik.style
      }"
    ></div>

    <div class="right-container">
      <div class="support">
        <h1 class="disp-2">{{ icerik.title }}</h1>
      </div>
      <div class="partnership">
        <h2 class="disp-3">{{ icerik.subtitle }}</h2>
      </div>
      <div class="texts" :class="icerik.class">
        <div class="text-left">
          <h3>{{ icerik.paragraf_1 }}</h3>
        </div>
        <div class="text-right">
          <h3>{{ icerik.paragraf_2 }}</h3>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  icerik: {
    type: Object,
    required: true
  },
  mode: {
    type: String,
    default: null
  }
})
</script>

<style lang="scss" scoped>
.band {
  width: 100vw;
  overflow-x: hidden;
  display: grid;
  grid-template-columns: 50% 1fr;
  margin-bottom: var(--section-gap);

  @media only screen and (max-width: 800px) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }

  color: var(--c-white-mute);

  .img-container {
    width: 100%;
  }

  .right-container {
    background-color: var(--c-main);
    padding-left: 10%;
    padding-bottom: 4%;

    .support {
      padding-block: 2%;
    }

    .partnership {
      padding-bottom: 2%;
      color: var(--c-grey-dark);

      .disp-3 {
        font-weight: 400;
      }
    }

    .texts {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-gap: 2rem;
      padding-bottom: 4%;
      padding-inline-end: 5rem;
      @media only screen and (max-width: 800px) {
        grid-template-columns: 1fr;
      }

      &.one-piece {
        display: flex;
        flex-direction: column;
      }

      h3 {
        font-weight: 400;
      }
    }
  }
}
</style>
