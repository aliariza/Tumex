<template>
  <section class="laser-cutting-nav">
    <ul>
      <li v-for="(item, index) in items" :key="index">
        <router-link :to="item.href">
          <h5>{{ item.title }}<br />{{ item.tabla }}</h5>
        </router-link>
      </li>
    </ul>
  </section>
</template>

<script setup>
import machineData from '../../data/machinesData.js'

defineOptions({ name: 'LaserCuttingNavigation' })

const items = machineData['laser-cutting'].items
</script>

<style lang="scss" scoped>
.laser-cutting-nav {
  width: 100vw;
  background-color: var(--c-white-mute);
  padding-inline: 1rem;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
  z-index: 1000;
  padding-left: 21.7%;
  ul {
    li {
      height: 5rem;
      display: flex;
      align-items: center;
      cursor: pointer;
      padding-right: 7%;
      h5 {
        line-height: 2rem;
        color: var(--c-grey);
        &:hover {
          color: var(--c-main);
        }
      }
    }
  }
}
</style>
