<template>
  <div class="marquee-content" :style="{ animationDuration: duration + 's' }">
    <div class="image-set" v-for="n in 2" :key="n">
      <img
        v-for="(image, index) in images"
        :key="index"
        :src="image"
        alt="Kayan resim"
        class="marquee-image"
      />
    </div>
  </div>
</template>

<script setup>
import { marqueeImages } from '../../data/marqueeData.js'

const duration = 30
const images = marqueeImages
</script>

<style scoped lang="scss">
$numberOfImages: 11;
.marquee-content {
  display: flex;
  width: calc(34rem * $numberOfImages * 1.75);
  animation: marqueeAnimation linear infinite;
}

.image-set {
  display: flex;
  width: calc(34rem * $numberOfImages);
}
.marquee-image {
  width: 30rem;
  height: auto;
  object-fit: cover;
  border: 1px solid black;
  border-radius: 1rem;
  margin: 2rem;
  box-shadow: 3px 3px 2px rgba(0, 0, 0, 0.5);
}

@keyframes marqueeAnimation {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}
</style>
