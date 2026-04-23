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
          <span>Teknik detaylar</span>
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
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: flex-start;
  width: 100%;
  min-height: 100%;
  text-align: center;
  padding: 2rem 1.8rem 2.2rem;
  background: #fcfcfc;
  border: 1px solid rgba(0, 83, 156, 0.12);
  border-radius: 0px;
  box-shadow: 0 6px 18px rgba(16, 42, 67, 0.05);
}

.card-item-sol {
  width: 100%;
  margin-bottom: 0.8rem;
}

.img-container {
  width: 100%;
  height: 20rem;
  padding: 1rem 1.5rem 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
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
  min-height: 5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.6rem;
  color: var(--c-main);
}

.title h1 {
  margin: 0;
  line-height: 1.2;
}

.text {
  min-height: 6.5rem;
  max-width: 36rem;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.text h3 {
  margin: 0;
  line-height: 1.5;
  font-weight: 400;
}

.router {
  margin-top: 1.2rem;
  padding-top: 0;
}

.teknik-detaylar {
  color: var(--c-main);

  span {
    font-weight: 400;
    font-size: 1.7rem;
  }

  &:hover {
    text-decoration: underline;
  }
}

@media only screen and (max-width: 800px) {
 .img-container {
  height: 18rem;
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
