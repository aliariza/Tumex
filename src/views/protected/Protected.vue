<template>
  <ProtectedLayout
    title="Tumex bayi alanına hoş geldiniz"
    description="Bu alan bayi kullanıcıları için ayrılan özel içerikleri ve sonraki korunaklı sayfa akışlarını barındırır."
  />
</template>

<script setup>
defineOptions({
  name: 'ProtectedHomeView'
})

import ProtectedLayout from './ProtectedLayout.vue'
</script>
