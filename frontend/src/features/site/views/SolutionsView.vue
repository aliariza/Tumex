<template>
  <section class="solutions-page">
    <TheHero :item="heroItem" />

    <div class="solutions-carousel">
      <transition name="fade">
        <TheCarousel
          v-if="showCarousel"
          :item="currentItem"
          @mouseover="pauseOnHover"
          @mouseleave="resumeOnLeave"
        />
      </transition>

      <div class="carousel-menu" aria-label="Öne çıkan çözüm slaytları">
        <button
          v-for="(carouselItem, index) in carouselItems"
          :key="`solution-menu-${carouselItem.id || index}`"
          class="menu-square"
          :class="{ active: index === currentItemIndex }"
          type="button"
          :aria-label="`${index + 1}. slaytı göster`"
          :aria-current="index === currentItemIndex ? 'true' : undefined"
          @click="setCurrentItem(index)"
        />
      </div>
    </div>

    <TheBand :icerik="supportContent" />
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import TheHero from '@/features/site/components/hero/TheHero.vue'
import TheCarousel from '@/features/site/components/carousel/TheCarousel.vue'
import TheBand from '@/features/site/components/band/TheBand.vue'
import { carouselData } from '@/data/carousel.js'

defineOptions({ name: 'SolutionsView' })

const heroItem = {
  title: 'Tumex çözümleri',
  subtitle: 'Doğru makine, doğru üretim akışı',
  picture: '/assets/images/LaserKesimHero.webp',
  imageAlt: 'Durmark lazer kesim makinesi'
}

const supportContent = {
  title: 'Destek',
  subtitle: 'Müşteri işbirliği & sofistike çözümler',
  paragraf_1:
    'Sac metal şekillendirme sektöründe sürekli bir deneyim kazanımı yaşanmaktadır. Değerli müşterilerimizle gerçekleştirdiğimiz işbirliği, başarımızın temelini oluşturmaktadır',
  paragraf_2:
    'Müşteri desteğimiz, sadece yardımcı olmakla kalmaz; birlikte en sofistike çözümleri geliştirmek için çalışırız.',
  button: true,
  image: '/assets/images/man-working-office.webp'
}

const carouselItems = carouselData
const currentItemIndex = ref(0)
const showCarousel = ref(true)
let rotateInterval = null

const currentItem = computed(() => carouselItems[currentItemIndex.value])

function setCurrentItem(index) {
  currentItemIndex.value = index
}

function nextItem() {
  showCarousel.value = false
  currentItemIndex.value = (currentItemIndex.value + 1) % carouselItems.length
  setTimeout(() => {
    showCarousel.value = true
  }, 0)
}

function startAutoRotate() {
  stopAutoRotate()
  rotateInterval = setInterval(nextItem, 10000)
}

function stopAutoRotate() {
  if (rotateInterval) {
    clearInterval(rotateInterval)
    rotateInterval = null
  }
}

function pauseOnHover() {
  stopAutoRotate()
}

function resumeOnLeave() {
  startAutoRotate()
}

onMounted(() => startAutoRotate())
onBeforeUnmount(() => stopAutoRotate())
</script>

<style scoped>
.solutions-page {
  width: 100vw;
  overflow-x: hidden;
}

.solutions-carousel {
  margin-top: var(--section-gap);
}

.carousel-menu {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
  margin-bottom: 5rem;
}

.menu-square {
  width: 10rem;
  height: 0.8rem;
  padding: 0;
  cursor: pointer;
  border: 0;
  background-color: var(--c-triangle);
  transition:
    background-color 0.3s ease,
    transform 0.2s ease;
}

.menu-square:hover,
.menu-square:focus-visible {
  background-color: #9aa6b2;
  outline: none;
  transform: translateY(-1px);
}

.menu-square.active {
  background-color: var(--c-main);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 1s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

@media (max-width: 800px) {
  .carousel-menu {
    margin-bottom: 3rem;
  }

  .menu-square {
    width: 6rem;
  }
}
</style>
