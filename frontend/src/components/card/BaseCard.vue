<template>
  <div class="card-item">
    <div class="card-item-sol">
      <div class="img-container">
        <TheLoading v-if="!imageLoaded" />
        <img
          v-lazy="{ src: item.image, loading: '', error: '' }"
          :alt="item.altText || 'Ürün görseli'"
          @load="imageLoaded = true"
          :class="{ loaded: imageLoaded }"
        />
      </div>
    </div>

    <div class="card-item-sag">
      <div class="title">
        <h1 class="disp-3">{{ item.title }}</h1>
      </div>

      <div class="text">
        <h3>{{ item.text }}</h3>
      </div>

      <div class="router">
        <router-link :to="item.href" class="teknik-detaylar">
          <span>TEKNİK DETAYLAR</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TheLoading from '@/shared/components/common/TheLoading.vue'

defineOptions({ name: 'BaseCard' })

defineProps({
  item: {
    type: Object,
    required: true,
    validator: (prop) =>
      ['title', 'image', 'text', 'href'].every((field) =>
        Object.prototype.hasOwnProperty.call(prop, field)
      )
  }
})

const imageLoaded = ref(false)
</script>

<style scoped lang="scss">
.card-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  width: 100%;
  min-height: 100%;
  text-align: center;
  padding: 2.4rem 2.2rem 2.6rem;
  background:
    linear-gradient(145deg, rgba(255, 255, 255, 0.98), rgba(248, 251, 255, 0.94)),
    #fff;
  border: 1px solid rgba(0, 83, 156, 0.16);
  border-radius: 0px;
  box-shadow: 0 1.8rem 5rem rgba(16, 42, 67, 0.08);
  overflow: hidden;
  transition:
    transform 0.22s ease,
    border-color 0.22s ease,
    box-shadow 0.22s ease;
}

.card-item::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 0.6rem;
  background: linear-gradient(180deg, #00539c 0%, #3a79b0 100%);
  opacity: 0.88;
}

.card-item:hover,
.card-item:focus-within {
  transform: translateY(-4px);
  border-color: rgba(0, 83, 156, 0.34);
  box-shadow: 0 2.6rem 7rem rgba(16, 42, 67, 0.13);
}

.card-item-sol {
  width: 100%;
  margin-bottom: 1.4rem;
}

.img-container {
  width: 100%;
  height: 22rem;
  padding: 1.4rem 1.8rem 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background:
    radial-gradient(circle at 50% 45%, rgba(0, 83, 156, 0.09), transparent 28rem),
    linear-gradient(180deg, #ffffff 0%, #f7fbff 100%);
  border: 1px solid rgba(0, 83, 156, 0.08);
}

.img-container img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center center;
  opacity: 0;
  transition: opacity 0.3s;
}

.img-container img.loaded {
  opacity: 1;
}

.card-item-sag {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.title {
  min-height: 5.8rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.8rem;
  color: var(--c-main);
}

.title h1 {
  margin: 0;
  color: #2f79bb;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.text {
  min-height: 7.2rem;
  max-width: 36rem;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.text h3 {
  margin: 0;
  color: #102a43;
  font-size: 1.55rem;
  line-height: 1.58;
  font-weight: 500;
}

.router {
  margin-top: 1.8rem;
  padding-top: 0;
}

.teknik-detaylar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 4rem;
  padding: 0 1.8rem;
  color: #00539c;
  border: 1px solid rgba(0, 83, 156, 0.22);
  background: rgba(0, 83, 156, 0.04);
  transition:
    background-color 0.18s ease,
    color 0.18s ease,
    border-color 0.18s ease;

  span {
    font-weight: 900;
    font-size: 1.4rem;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }

  &:hover {
    color: #fff;
    background: #00539c;
    border-color: #00539c;
  }
}

@media only screen and (max-width: 800px) {
 .img-container {
  height: 18.5rem;
  padding: 0.8rem 1rem 0.4rem;
}

  .title {
    min-height: auto;
  }

  .text {
    min-height: auto;
  }
}
</style>
