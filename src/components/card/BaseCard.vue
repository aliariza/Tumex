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
        <router-link :to="item.href" class="teknik-detaylar"
          ><span>Teknik detaylar</span></router-link
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TheLoading from '../TheLoading.vue'

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
  align-items: center;
  justify-content: space-between;
  width: 100%;

  .card-item-sol {
    width: 100%;
    margin-bottom: 2rem;
    text-align: center;

    .img-container {
      height: 100%;
      width: 100%;

      img {
        height: auto;
        width: 100%;
        opacity: 0;
        transition: opacity 0.3s;
        &.loaded {
          opacity: 1;
        }
      }
    }
  }
  .card-item-sag {
    width: 100%;
    text-align: center;
    .title {
      color: var(--c-main);
      margin-bottom: 1rem;
    }
  }
  .router {
    margin-top: 3rem;
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
}
</style>
