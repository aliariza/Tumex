<!-- eslint-disable vue/valid-v-on -->
<template>
  <div class="select">
    <div class="custom-dropdown" @click="openDropdown" ref="dropdownEl">
      {{ selectedTonaj || tonajOptions[0] }}
      <div class="dropdown-list" v-if="isDropdownVisible">
        <div
          class="dropdown-item"
          v-for="option in tonajOptions"
          :key="option"
          @click.stop="selectOption(option)"
        >
          {{ option }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

defineOptions({ name: 'TheSelector' })

defineProps({
  uzunlukOptions: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update-value'])

const dropdownEl = ref(null)
const isTogglingDropdown = ref(false)
const selectedTonaj = ref(null)
const isDropdownVisible = ref(false)

const tonajOptions = ['Tonaj Seciniz', 30, 40, 50, 63, 80, 100, 125, 160, 200, 250, 300, 400, 500, 600]

function openDropdown() {
  isTogglingDropdown.value = true
  isDropdownVisible.value = true
  setTimeout(() => { isTogglingDropdown.value = false }, 100)
}

function closeDropdown() {
  if (isTogglingDropdown.value) return
  isDropdownVisible.value = false
}

function selectOption(option) {
  selectedTonaj.value = option
  emit('update-value', option)
  closeDropdown()
}

function handleOutsideClick(e) {
  if (dropdownEl.value && !dropdownEl.value.contains(e.target)) {
    closeDropdown()
  }
}

onMounted(() => document.addEventListener('click', handleOutsideClick))
onBeforeUnmount(() => document.removeEventListener('click', handleOutsideClick))
</script>

<style lang="scss" scoped>
.select {
  display: flex;
  justify-content: space-between;
  position: relative;
  width: 25rem;
  cursor: pointer;
}

.dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  border: 1px solid #ccc;
  width: 100%;
  background-color: white;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);

  .dropdown-item {
    padding: 10px;
    &:hover { background-color: #f6f6f6; }
  }
}
.custom-dropdown {
  width: 100%;
  position: relative;
  cursor: pointer;
  &::after {
    content: '';
    position: absolute;
    right: 5px;
    top: 50%;
    transform: translateY(-50%);
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid black;
  }
}
</style>
