<template>
  <div ref="root" :class="['app-select', { 'is-open': isOpen, 'is-compact': compact }]">
    <button
      type="button"
      class="app-select__trigger"
      :aria-expanded="isOpen ? 'true' : 'false'"
      aria-haspopup="listbox"
      @click="toggleOpen"
      @keydown.down.prevent="openMenu"
      @keydown.up.prevent="openMenu"
      @keydown.enter.prevent="toggleOpen"
      @keydown.space.prevent="toggleOpen"
      @keydown.esc.prevent="closeMenu"
    >
      <span class="app-select__label">{{ selectedLabel }}</span>
      <span class="app-select__chevron" aria-hidden="true"></span>
    </button>

    <transition name="app-select-fade">
      <div v-if="isOpen" class="app-select__menu" role="listbox">
        <button
          v-for="option in normalizedOptions"
          :key="String(option.value)"
          type="button"
          :class="['app-select__option', { 'is-selected': option.value === modelValue }]"
          role="option"
          :aria-selected="option.value === modelValue ? 'true' : 'false'"
          @click="selectOption(option.value)"
        >
          {{ option.label }}
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

defineOptions({ name: 'AppSelect' })

const props = defineProps({
  modelValue: {
    type: [String, Number],
    required: true
  },
  options: {
    type: Array,
    required: true
  },
  compact: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue'])

const root = ref(null)
const isOpen = ref(false)

const normalizedOptions = computed(() =>
  props.options.map((option) =>
    typeof option === 'object'
      ? option
      : { value: option, label: String(option) }
  )
)

const selectedLabel = computed(() => {
  return normalizedOptions.value.find((option) => option.value === props.modelValue)?.label || ''
})

function openMenu() {
  isOpen.value = true
}

function closeMenu() {
  isOpen.value = false
}

function toggleOpen() {
  isOpen.value = !isOpen.value
}

function selectOption(value) {
  emit('update:modelValue', value)
  closeMenu()
}

function handleClickOutside(event) {
  if (!root.value?.contains(event.target)) {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.app-select {
  position: relative;
  min-width: 18rem;
}

.app-select.is-compact {
  min-width: 12rem;
}

.app-select__trigger {
  width: 100%;
  min-height: 4.8rem;
  padding: 1.2rem 4.4rem 1.2rem 1.4rem;
  border: 1px solid #7da6d8;
  border-radius: 0;
  background: #fff;
  color: #102a43;
  font-size: 1.4rem;
  text-align: left;
  cursor: pointer;
  position: relative;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;
}

.app-select__trigger:focus-visible,
.app-select.is-open .app-select__trigger {
  outline: none;
  border-color: #00539c;
  box-shadow: inset 0 0 0 1px rgba(0, 83, 156, 0.18);
}

.app-select__label {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.app-select__chevron {
  position: absolute;
  right: 1.4rem;
  top: 50%;
  width: 1rem;
  height: 1rem;
  border-right: 2px solid #2f79bb;
  border-bottom: 2px solid #2f79bb;
  transform: translateY(-60%) rotate(45deg);
  transition: transform 0.2s ease;
}

.app-select.is-open .app-select__chevron {
  transform: translateY(-35%) rotate(-135deg);
}

.app-select__menu {
  position: absolute;
  top: calc(100% + 0.4rem);
  left: 0;
  right: 0;
  z-index: 30;
  border: 1px solid #7da6d8;
  background: #fff;
  box-shadow: 0 1.6rem 3.2rem rgba(15, 23, 42, 0.12);
  overflow: hidden;
}

.app-select__option {
  width: 100%;
  padding: 1.2rem 1.4rem;
  border: none;
  border-bottom: 1px solid rgba(125, 166, 216, 0.28);
  background: #fff;
  color: #102a43;
  font-size: 1.4rem;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.16s ease, color 0.16s ease;
}

.app-select__option:last-child {
  border-bottom: none;
}

.app-select__option:hover,
.app-select__option.is-selected {
  background: rgba(0, 83, 156, 0.08);
  color: #00539c;
}

.app-select-fade-enter-active,
.app-select-fade-leave-active {
  transition: opacity 0.14s ease, transform 0.14s ease;
}

.app-select-fade-enter-from,
.app-select-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
