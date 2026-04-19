<template>
  <section>
    <the-hero :item="item" :class="{ 'hide-title': !isTitleVisible }"></the-hero>
    <div class="alt-bolumler">
      <h1 class="iletisim">İletişim Bilgileri</h1>
      <h1 class="sirket">Tumex Mümessillik ve Dış Ticaret Limited Şirketi</h1>
      <div class="logolar">
        <div class="durmark-logo">
          <img src="/assets/images/" alt="Durmark Logo" />
        </div>
        <div class="tumex-logo"><img src="/assets/images/tumex_blue.svg" alt="Tumex Logo" /></div>
      </div>
      <div class="address-details">
        <div class="phone">
          <div class="phone-1">Tel: +90 530 392 7259</div>
          <div class="phone-2">Tel: +90 536 666 0490</div>
        </div>
        <div class="email">E-posta: info@tum-ex.com</div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import TheHero from '../components/hero/TheHero.vue'

const item = {
  picture: '/assets/images/factory-front.webp',
  title: 'Sitemiz yapım aşamasındadır...',
  subtitle: ''
}

const titleVisible = ref(window.innerWidth > 1300)
const isTitleVisible = computed(() => titleVisible.value)

function updateWidth() {
  titleVisible.value = window.innerWidth > 1300
}

onMounted(() => window.addEventListener('resize', updateWidth))
onBeforeUnmount(() => window.removeEventListener('resize', updateWidth))
</script>

<style scoped lang="scss">
.alt-bolumler {
  max-width: 1050px;
  margin-inline: auto;
  text-align: center;
  color: var(--c-main);
  font-weight: 800;
  font-size: x-large;
  margin-block: 5rem;
  .sirket {
    padding-inline: 4rem;
  }
  .logolar {
    width: 30%;
    margin-inline: auto;
    margin-top: 3rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    .tumex-logo {
      height: 100px;
      width: 100px;
      img { height: 100%; width: 100%; }
    }
    .durmark-logo {
      height: auto;
      width: 175px;
      display: flex;
      align-items: center;
      img { height: 100%; width: 100%; }
    }
  }
  .iletisim { margin-bottom: 1rem; }
  .sirket {
    font-size: 2rem;
    color: var(--c-grey);
    margin-bottom: 1rem;
  }
}
</style>
