<template>
  <section class="laser-welding-nav">
    <ul>
      <li><h5>laser-welding-type-1</h5></li>
      <li><h5>laser-welding-type-2</h5></li>
      <li><h5>laser-welding-type-3</h5></li>
    </ul>
  </section>
</template>

<script setup>
defineOptions({ name: 'LaserWeldingNavigation' })
</script>

<style lang="scss" scoped>
.laser-welding-nav {
  width: 100vw;
  background-color: var(--c-white-mute);
  padding-inline: 1rem;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
  padding-left: 42%;
  ul {
    li {
      height: 5rem;
      display: flex;
      align-items: center;
      cursor: pointer;
      padding-right: 7%;
      h5 {
        line-height: 3rem;
        color: var(--c-grey);
        &:hover { color: var(--c-main); }
      }
    }
  }
}
</style>
