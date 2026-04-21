<template>
  <transition name="fade">
    <div v-if="show" class="dialog-overlay" @click.self="$emit('cancel')">
      <div class="dialog-box">
        <p class="dialog-eyebrow">Onay • Kritik İşlem</p>
        <h3 class="dialog-title">{{ title }}</h3>
        <p class="dialog-message">{{ message }}</p>

        <div class="dialog-notice">
          <span class="dialog-notice__label">Uyarı</span>
          <p>Bu işlem onaylandığında kayıt kalıcı olarak kaldırılır.</p>
        </div>

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

<script setup>
defineOptions({ name: 'ConfirmDialog' })

defineEmits(['confirm', 'cancel'])

defineProps({
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
})
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
  max-width: 460px;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(247, 250, 252, 0.94));
  border: 1px solid rgba(17, 24, 39, 0.08);
  border-radius: 0;
  padding: 28px 24px 24px;
  box-shadow: 0 24px 60px rgba(15, 23, 42, 0.14);
}

.dialog-box::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 8px;
  background: linear-gradient(180deg, #00539c 0%, #2f79bb 100%);
}

.dialog-eyebrow {
  margin: 0 0 10px;
  color: #00539c;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.dialog-title {
  margin: 0;
  color: #1f2933;
  font-size: 24px;
  line-height: 1.3;
}

.dialog-message {
  margin: 14px 0 0;
  color: #52606d;
  font-size: 15px;
  line-height: 1.7;
}

.dialog-notice {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 24px;
  padding: 14px 16px;
  border: 1px dashed rgba(0, 83, 156, 0.26);
  background: rgba(247, 250, 252, 0.95);
}

.dialog-notice__label {
  color: #829ab1;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.dialog-notice p {
  margin: 0;
  color: #243b53;
  font-size: 14px;
  line-height: 1.6;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}

.secondary-btn,
.danger-btn {
  border: 1px solid transparent;
  border-radius: 0;
  min-height: 40px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    background-color 0.2s ease,
    border-color 0.2s ease,
    color 0.2s ease;
}

.secondary-btn {
  background: #f8fafc;
  border-color: rgba(16, 42, 67, 0.12);
  color: #102a43;
}

.danger-btn {
  background: #fff1f2;
  border-color: rgba(185, 28, 28, 0.12);
  color: #b91c1c;
}

.secondary-btn:hover,
.danger-btn:hover {
  transform: translateY(-1px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 640px) {
  .dialog-actions {
    flex-direction: column-reverse;
  }

  .secondary-btn,
  .danger-btn {
    width: 100%;
  }
}
</style>
