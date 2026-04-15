<template>
  <div
    class="custom-dropdown"
    role="combobox"
    :aria-expanded="open"
    aria-haspopup="listbox"
    tabindex="0"
    @click.stop="$emit('toggle')"
    @keydown.enter.prevent="$emit('toggle')"
    @keydown.space.prevent="$emit('toggle')"
    ref="dropdownEl"
  >
    <div class="felan">
      <span :class="{ 'text-red': isDefault }">{{ selected }}</span>
      <span class="chevron" aria-hidden="true"><chevron-down /></span>
    </div>
    <ul v-if="open" class="dropdown-items" role="listbox">
      <li
        v-for="option in options"
        :key="option"
        role="option"
        :aria-selected="option === selected"
        @click.stop="$emit('select', option)"
      >
        {{ option }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import ChevronDown from '../icons/ChevronDown.vue'

defineOptions({ name: 'DropdownCell' })

const props = defineProps({
  options: {
    type: Array,
    required: true
  },
  selected: {
    type: String,
    default: 'SEÇİNİZ'
  },
  open: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle', 'select'])

const isDefault = computed(() => props.selected === 'SEÇİNİZ')
</script>

<style lang="scss" scoped>
.custom-dropdown {
  position: relative;
  cursor: pointer;

  .felan {
    display: flex;
    justify-content: space-between;
    align-items: center;
    span.chevron {
      width: 2rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .dropdown-items {
    position: absolute;
    top: 100%;
    left: 0;
    background-color: #fff;
    border: 1px solid #ccc;
    width: 100%;
    z-index: 1;
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      padding: 0.5rem 1rem;
      cursor: pointer;
      &:hover {
        background-color: #eee;
      }
      &[aria-selected='true'] {
        background-color: #dbeafe;
      }
    }
  }
}
.text-red {
  color: red;
}
</style>
