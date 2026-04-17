<template>
  <transition name="toast-fade">
    <div v-if="show" :class="['toast', typeClass]">
      {{ message }}
    </div>
  </transition>
</template>

<script>
export default {
  name: 'AppToast',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    message: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'success'
    }
  },
  computed: {
    typeClass() {
      return this.type === 'error' ? 'toast-error' : 'toast-success'
    }
  }
}
</script>

<style scoped>
.toast {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  min-width: 260px;
  max-width: 420px;
  padding: 14px 16px;
  border-radius: 0px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
  font-size: 14px;
  font-weight: 500;
}

.toast-success {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #86efac;
}

.toast-error {
  background: #fee2e2;
  color: #991b1b;
  border: 1px solid #fca5a5;
}

.toast-fade-enter-active,
.toast-fade-leave-active {
  transition: all 0.2s ease;
}

.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

@media (max-width: 700px) {
  .toast {
    top: 16px;
    right: 16px;
    left: 16px;
    min-width: auto;
    max-width: none;
  }
}
</style>