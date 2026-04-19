<template>
  <section class="highlights-downloads">
    <div class="highlights">
      <h1 class="disp-2">Öne çıkanlar</h1>
      <ul class="square-bullets">
        <li>Item 1</li>
        <li>Item 2</li>
      </ul>
    </div>
    <div class="downloads">
      <h1 class="disp-2">İndirmeler</h1>
      <a :href="brochureLink" target="_blank" rel="noopener noreferrer" class="disp-3"
        >Broşür indirin</a
      >
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  pdfPath: {
    type: String,
    default: ''
  }
})

const brochureLink = computed(() => `/assets/pdf/${props.pdfPath}`)
</script>

<style scoped lang="scss">
.highlights-downloads {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1050px;
  gap: 5rem;
  margin: var(--section-gap) auto;
  padding-inline: 3rem;
  @media only screen and (max-width: 800px) {
    grid-template-columns: 1fr;
  }
  .disp-2 {
    @media only screen and (max-width: 800px) {
      font-size: 4rem;
    }
  }
}
ul.square-bullets {
  padding-left: 0;
  display: flex;
  flex-direction: column;
}

ul.square-bullets li {
  position: relative;
  padding-left: 2rem;
}

ul.square-bullets li::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  width: 1rem;
  height: 1rem;
  background-color: var(--c-main);
  transform: translateY(-50%);
}
</style>
