<template>
  <section class="container">
    <div class="container__glow container__glow--left" aria-hidden="true"></div>
    <div class="container__glow container__glow--right" aria-hidden="true"></div>
    <BayiAuthActions />
  </section>
</template>

<script setup>
import BayiAuthActions from '@/features/auth/components/BayiAuthActions.vue'
</script>

<style scoped lang="scss">
.container {
  position: relative;
  min-height: calc(100vh - 22rem);
  display: grid;
  place-items: center;
  padding: 6rem 2rem 8rem;
  overflow: hidden;
  transform: translateZ(0);
  background:
    linear-gradient(180deg, rgba(240, 247, 255, 0.95) 0%, rgba(255, 255, 255, 1) 58%),
    repeating-linear-gradient(
      -45deg,
      rgba(0, 83, 156, 0.035) 0,
      rgba(0, 83, 156, 0.035) 14px,
      rgba(255, 255, 255, 0.82) 14px,
      rgba(255, 255, 255, 0.82) 28px
    );
}

.container__glow {
  position: absolute;
  width: 32rem;
  height: 32rem;
  border-radius: 50%;
  filter: blur(24px);
  opacity: 0.55;
  pointer-events: none;
}

.container__glow--left {
  top: 8rem;
  left: -12rem;
  background: rgba(0, 83, 156, 0.16);
}

.container__glow--right {
  right: -10rem;
  bottom: 4rem;
  background: rgba(231, 76, 60, 0.12);
}

@media (max-width: 700px) {
  .container {
    min-height: calc(100vh - 16rem);
    padding-inline: 1.6rem;
  }
}
</style>
