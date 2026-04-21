<!-- src/components/Modal.vue -->
<template>
  <transition name="fade">
    <div v-if="visible" class="modal" @click.self="closeModal">
      <div class="modal-content" role="dialog" aria-modal="true">
      <button type="button" class="close" @click="closeModal" aria-label="Close">&times;</button>
      <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script setup>
defineOptions({
  name: 'AppModal'
})

defineProps({
  visible: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['close'])

function closeModal() {
  emit('close')
}
</script>

<style scoped>
.modal {
  display: grid;
  place-items: center;
  position: fixed;
  z-index: 10000;
  inset: 0;
  padding: 24px;
  overflow: auto;
  background: rgba(0, 0, 0, 0.35);
}

.modal-content {
  position: relative;
  width: min(100%, 420px);
  margin: auto;
  padding: 24px;
  border: 1px solid #d8dbe2;
  border-radius: 0;
  background: #fff;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.18);
}

.close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 0;
  background: transparent;
  color: #6b7280;
  font-size: 28px;
  line-height: 1;
  transition:
    color 0.2s ease;
}

.close:hover,
.close:focus {
  color: #111827;
  cursor: pointer;
  outline: none;
}

.modal-content :deep(h2) {
  margin: 0 0 10px;
  font-size: 24px;
  line-height: 1.3;
  color: #1f2937;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media only screen and (max-width: 640px) {
  .modal {
    padding: 16px;
  }

  .modal-content {
    padding: 24px 20px 20px;
  }
}
</style>
