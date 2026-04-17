<template>
  <transition name="fade">
    <div v-if="show" class="dialog-overlay" @click.self="$emit('cancel')">
      <div class="dialog-box">
        <h3 class="dialog-title">{{ title }}</h3>
        <p class="dialog-message">{{ message }}</p>

        <div class="dialog-actions">
          <button class="secondary-btn" type="button" @click="$emit('cancel')">
            Vazgeç
          </button>
          <button class="danger-btn" type="button" @click="$emit('confirm')">
            Sil
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ConfirmDialog',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: 'Onay'
    },
    message: {
      type: String,
      default: 'Bu işlemi yapmak istediğinize emin misiniz?'
    }
  },
  emits: ['confirm', 'cancel']
}
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  display: grid;
  place-items: center;
  z-index: 9998;
  padding: 20px;
}

.dialog-box {
  width: 100%;
  max-width: 420px;
  background: white;
  border: 1px solid #d8dbe2;
  border-radius: 0;
  padding: 24px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.18);
}

.dialog-title {
  margin: 0 0 10px;
  font-size: 20px;
}

.dialog-message {
  margin: 0 0 20px;
  color: #4b5563;
  line-height: 1.5;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.secondary-btn,
.danger-btn {
  border: none;
  border-radius: 0;
  padding: 10px 14px;
  font-size: 14px;
  cursor: pointer;
}

.secondary-btn {
  background: #e5e7eb;
  color: #111827;
}

.danger-btn {
  background: #fee2e2;
  color: #991b1b;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>