<template>
  <div>
    <button
      class="menu-header"
      @click="$emit('toggle')"
      :aria-expanded="open"
      :aria-controls="`section-${title}`"
    >
      <div class="menu-text">{{ title }}</div>
      <span aria-hidden="true">{{ open ? '▼' : '►' }}</span>
    </button>
    <div :id="`section-${title}`" class="alt-menu" :class="{ open }">
      <div
        v-for="link in links"
        :key="link.to"
        class="menu-item"
      >
        <router-link :to="link.to" @click="$emit('close-menu')">{{ link.label }}</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
defineOptions({ name: 'MobileMenuSection' })

defineProps({
  title: {
    type: String,
    required: true
  },
  open: {
    type: Boolean,
    default: false
  },
  links: {
    type: Array,
    required: true
  }
})

defineEmits(['toggle', 'close-menu'])
</script>
