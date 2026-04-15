<template>
  <div
    class="dropdown"
    @click="toggleDropdown"
    @keydown.arrow-down="navigate(1)"
    @keydown.arrow-up="navigate(-1)"
    @keydown.enter="selectOption(options[focusIndex])"
    tabindex="0"
    ref="dropdownEl"
  >
    <span class="selected-option">
      <span v-if="selectedOption">{{ selectedOption }}</span>
      <span v-else class="placeholder">Seçiniz ...</span>
    </span>
    <span class="arrow"></span>
    <div v-if="isOpen" class="dropdown-options">
      <div
        v-for="(option, index) in options"
        :key="option"
        @click.stop="selectOption(option)"
        class="dropdown-option"
        :class="{ 'dropdown-option-focused': index === focusIndex }"
      >
        {{ option }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'

const props = defineProps({
  options: {
    type: Array,
    required: true
  },
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const dropdownEl = ref(null)
const isOpen = ref(false)
const selectedOption = ref(props.modelValue)
const focusIndex = ref(-1)

watch(() => props.modelValue, (val) => { selectedOption.value = val })

function toggleDropdown() {
  isOpen.value = !isOpen.value
  focusIndex.value = props.options.indexOf(selectedOption.value)
}

function selectOption(option) {
  selectedOption.value = option
  isOpen.value = false
  emit('update:modelValue', option)
}

function outsideClick(e) {
  if (dropdownEl.value && !dropdownEl.value.contains(e.target)) {
    isOpen.value = false
  }
}

function navigate(step) {
  focusIndex.value = (focusIndex.value + step + props.options.length) % props.options.length
}

onMounted(() => document.addEventListener('click', outsideClick))
onBeforeUnmount(() => document.removeEventListener('click', outsideClick))
</script>

<style scoped>
.dropdown {
  position: relative;
  cursor: pointer;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:focus { outline: none; }
}
.selected-option {
  display: block;
  min-height: 20px;
}

.dropdown-options {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  border: 1px solid #ccc;
  max-height: 20rem;
  overflow-y: auto;
  z-index: 10;
  background-color: #fff;
}

.dropdown-option {
  padding: 10px;
  &:hover { background-color: #eee; }
}

.dropdown-option-focused {
  background-color: #ddd;
}
.arrow {
  height: 8px;
  width: 8px;
  border-left: 2px solid black;
  border-top: 2px solid black;
  transform: rotate(135deg);
}
.placeholder {
  color: red;
}
</style>
