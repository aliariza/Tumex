<template>
  <section class="tarihce">
    <the-hero :item="item"></the-hero>
    <durmark-item :items="items"></durmark-item>
    <marquee-view></marquee-view>
  </section>
</template>

<script setup>
import DurmarkItem from './DurmarkItem.vue'
import TheHero from '../../components/hero/TheHero.vue'
import MarqueeView from '../../components/marquee/MarqueeView.vue'
import { items, heroItem } from '../../data/durmarkData.js'

defineOptions({ name: 'DurmarkView' })

const item = heroItem
</script>

<style lang="scss" scoped>
.tarihce {
  margin: 0 auto;
  .disp-1 { text-align: center; }
}
</style>
