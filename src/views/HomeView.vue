<template>
  <section class="home">
    <TheHero :item="item" />
    <div class="carousel-container">
      <transition name="fade">
        <TheCarousel
          :item="currentItem"
          @mouseover="pauseOnHover"
          @mouseleave="resumeOnLeave"
          v-if="showCarousel"
        />
      </transition>
      <div class="carousel-menu">
        <div
          v-for="(carouselItem, index) in carouselItems"
          :key="`menu-${index}`"
          class="menu-square"
          :class="{ active: index === currentItemIndex }"
          @click="setCurrentItem(index)"
        />
      </div>
    </div>
    <TheBand :icerik="icerik" />
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import TheHero from '@/components/hero/TheHero.vue'
import TheCarousel from '@/components/carousel/TheCarousel.vue'
import TheBand from '@/components/band/TheBand.vue'
import { carouselData } from '@/data/carousel.js'

defineOptions({ name: 'HomeView' })

const icerik = {
  title: 'Destek',
  subtitle: 'Müşteri işbirliği & sofistike çözümler',
  paragraf_1:
    'Sac metal şekillendirme sektöründe sürekli bir deneyim kazanımı yaşanmaktadır. Değerli müşterilerimizle gerçekleştirdiğimiz işbirliği, başarımızın temelini oluşturmaktadır',
  paragraf_2:
    'Müşteri desteğimiz, sadece yardımcı olmakla kalmaz; birlikte en sofistike çözümleri geliştirmek için çalışırız.',
  button: true,
  image: '/assets/images/man-working-office.webp'
}

const item = {
  title: "Tumex'e Hoşgeldiniz",
  subtitle: 'Bir kesim ötesi kalite',
  picture: '/assets/images/factory-front-small.webp',
  text: '15 yılı aşkın bir süredir, TUMEX metal işlemedeki teknolojik deneyimini şimdi Türkiye pazarına sunuyor.'
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
  // Use setTimeout to restore showCarousel after Vue flushes DOM
  setTimeout(() => { showCarousel.value = true }, 0)
}

function startAutoRotate() {
  rotateInterval = setInterval(nextItem, 10000)
}

function stopAutoRotate() {
  clearInterval(rotateInterval)
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

<style lang="scss" scoped>
.carousel-menu {
  display: flex;
  justify-content: center;
  margin-top: 0;

  .menu-square {
    width: 10rem;
    height: 0.8rem;
    background-color: var(--c-triangle);
    margin: 1rem 1rem 5rem 0;
    margin-bottom: 5rem;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: darkgray;
    }
    &.active {
      background-color: var(--c-main);
    }
  }
}

.carousel-container {
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
</style>
