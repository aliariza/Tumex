<template>
  <button
    type="button"
    :class="['auth-action-button', sharedButtonClass, { 'is-active': active }]"
    @click="$emit('click')"
    @focus="$emit('focus')"
    @mouseenter="$emit('mouseenter')"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  active: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String,
    default: 'ghost'
  }
})

defineEmits(['click', 'focus', 'mouseenter'])

const sharedButtonClass = computed(() =>
  props.variant === 'light' || props.variant === 'secondary' ? 'button-light' : 'button-solid'
)
</script>

<style scoped>
.auth-action-button {
  margin: 10px;
}
</style>
<style scoped src="@/components/shared/buttonStyles.css"></style>
