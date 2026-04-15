<!-- src/components/Modal.vue -->
<template>
  <div v-if="visible" class="modal" @click.self="closeModal">
    <div class="modal-content" role="dialog" aria-modal="true">
      <button type="button" class="close" @click="closeModal" aria-label="Close">&times;</button>
      <slot></slot>
    </div>
  </div>
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
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  z-index: 10000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  padding: 24px;
  overflow: auto;
  background:
    radial-gradient(circle at top, rgba(52, 152, 219, 0.14), transparent 35%),
    rgba(15, 23, 42, 0.48);
  backdrop-filter: blur(6px);
}

.modal-content {
  position: relative;
  width: min(100%, 540px);
  margin: auto;
  padding: 30px 28px 24px;
  border: 1px solid rgba(148, 163, 184, 0.28);
  border-radius: 0;
  background: linear-gradient(180deg, #ffffff 0%, #f8fbff 100%);
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.22);
}

.close {
  position: absolute;
  top: 10px;
  right: 12px;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 0;
  background: transparent;
  color: #94a3b8;
  font-size: 28px;
  line-height: 1;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.close:hover,
.close:focus {
  color: #1f2937;
  cursor: pointer;
  outline: none;
}

.modal-content :deep(h2) {
  margin: 18px 0 20px;
}

@media only screen and (max-width: 640px) {
  .modal {
    padding: 16px;
  }

  .modal-content {
    padding: 24px 20px 20px;
    border-radius: 0;
  }
}
</style>
