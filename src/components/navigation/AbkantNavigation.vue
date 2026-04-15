<template>
  <section class="abkant-nav">
    <ul>
      <li v-for="(item, index) in items" :key="index">
        <router-link :to="item.href">
          <h5>{{ item.title }}<br />Abkant</h5>
        </router-link>
      </li>
    </ul>
  </section>
</template>

<script setup>
import machineData from '../../data/machinesData.js'

defineOptions({ name: 'AbkantNavigation' })

const items = machineData['abkant'].items
</script>

<style lang="scss" scoped>
.abkant-nav {
  width: 100vw;
  background-color: var(--c-white-mute);
  overflow-x: hidden;

  ul {
    width: 100vw;
    box-shadow: 0 2px 0px rgba(0, 0, 0, 0.1);
    z-index: 100;
    padding-inline: 1rem;
    height: 5rem;
    li {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding-right: 7%;
      z-index: 5000;
      box-shadow: 0 2px 0px rgba(0, 0, 0, 0.1);

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
