<template>
  <div class="alt-bolumler">
    <div class="header">
      <h1 class="disp-2">{{ item.title }}</h1>
      <h5>{{ item.subtitle }}</h5>
    </div>
    <div class="paragraf">
      <div class="sol">
        <h3>{{ item.paragraph_1 }}</h3>
      </div>
      <div class="sag">
        <h3>{{ item.paragraph_2 }}</h3>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true
  }
})
</script>

<style lang="scss" scoped>
.alt-bolumler {
  max-width: 1050px;
  margin-inline: auto;
  .header {
    margin-top: var(--section-gap);
    color: var(--c-main);
    padding-inline: 3rem;

    h1 {
      margin-bottom: 2rem;
    }
    h5 {
      color: var(--c-grey);
      font-weight: 800;
    }
  }
  .paragraf {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 5rem;
    margin-top: 2rem;
    padding-inline: 3rem;
    @media only screen and (max-width: 800px) {
      grid-template-columns: 1fr;
    }
  }
}
</style>
