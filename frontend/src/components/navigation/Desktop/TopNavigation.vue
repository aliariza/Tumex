<template>
  <section class="top-nav">
    <ul>
      <li :class="{ active: activeMenu === 'solutions' }">
        <router-link to="/solutions"><h4>Çözümler</h4></router-link>
      </li>
      <li :class="{ active: activeMenu === 'company' }">
        <router-link to="/company"><h4>Hakkımızda</h4></router-link>
      </li>
      <li :class="{ active: activeMenu === 'iletisim' }">
        <router-link to="/iletisim"><h4>İletişim</h4></router-link>
      </li>
    </ul>
    <router-link to="/">
      <div class="logo">
        <tumex-blue></tumex-blue>
      </div>
    </router-link>
  </section>
</template>

<script setup>
import TumexBlue from '../../../components/icons/TumexBlue.vue'

defineOptions({ name: 'TopNavigation' })
defineProps({
  activeMenu: {
    type: String,
    default: null
  }
})
</script>

<style scoped lang="scss">
.top-nav {
  width: 100vw;
  background-color: var(--c-background-nav-top);
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;

  .logo {
    height: 10rem;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    background-color: var(--c-white);
    padding: 3rem;
  }
}

ul {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  position: relative;
  color: var(--c-grey);
  cursor: pointer;
  line-height: 4rem;
  margin: 0 1rem;

  &.active::after {
    content: '';
    position: absolute;
    bottom: 0.2rem;
    left: 50%;
    width: 0;
    height: 0;
    border-left: 0.8rem solid transparent;
    border-right: 0.8rem solid transparent;
    border-bottom: 0.8rem solid var(--c-triangle);
    transform: translateX(-50%);
  }

  &:hover {
    color: var(--c-main);
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  a:hover {
    color: var(--c-main);
  }
}
</style>
