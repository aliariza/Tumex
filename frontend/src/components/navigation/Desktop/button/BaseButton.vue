<template>
  <router-link :to="link" :class="buttonClass">
    <slot></slot>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  link: {
    type: String,
    required: true
  },
  mode: {
    type: String,
    default: 'normal'
  }
})

const buttonClass = computed(() =>
  props.mode === 'white' ? 'button-light' : 'button-solid'
)
</script>

<style scoped src="@/components/shared/buttonStyles.css"></style>
