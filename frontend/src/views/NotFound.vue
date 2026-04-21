<template>
  <section class="not-found">
    <div class="not-found__glow not-found__glow--left" aria-hidden="true"></div>
    <div class="not-found__glow not-found__glow--right" aria-hidden="true"></div>

    <div class="not-found__card">
      <p class="not-found__eyebrow">404 • Sayfa bulunamadı</p>
      <h1>Aradığınız sayfaya ulaşamadık.</h1>
      <p class="not-found__message">
        Bu bağlantı taşınmış, silinmiş ya da hiç var olmamış olabilir.
        Aşağıdaki seçeneklerle güvenli bir şekilde devam edebilirsiniz.
      </p>

      <div class="not-found__path">
        <span class="not-found__path-label">İstenen yol</span>
        <code>{{ currentPath }}</code>
      </div>

      <div class="not-found__actions">
        <RouterLink class="not-found__button not-found__button--primary" to="/">
          Ana sayfaya dön
        </RouterLink>
        <RouterLink class="not-found__button not-found__button--secondary" to="/solutions">
          Çözümleri incele
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

defineOptions({ name: 'NotFoundView' })

const route = useRoute()

const currentPath = computed(() => route.fullPath || '/')
</script>

<style scoped lang="scss">
.not-found {
  position: relative;
  min-height: calc(100vh - 22rem);
  display: grid;
  place-items: center;
  padding: 6rem 2rem 8rem;
  overflow: hidden;
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

.not-found__glow {
  position: absolute;
  width: 32rem;
  height: 32rem;
  border-radius: 50%;
  filter: blur(24px);
  opacity: 0.55;
}

.not-found__glow--left {
  top: 8rem;
  left: -12rem;
  background: rgba(0, 83, 156, 0.16);
}

.not-found__glow--right {
  right: -10rem;
  bottom: 4rem;
  background: rgba(231, 76, 60, 0.12);
}

.not-found__card {
  position: relative;
  width: min(100%, 72rem);
  padding: 4rem clamp(2rem, 4vw, 4.8rem);
  border: 1px solid rgba(17, 24, 39, 0.08);
  border-radius: 0;
  background:
    linear-gradient(135deg, rgba(255, 255, 255, 0.98), rgba(247, 250, 252, 0.94));
  box-shadow: 0 2.4rem 6rem rgba(15, 23, 42, 0.12);
}

.not-found__card::before {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 1rem;
  background: linear-gradient(180deg, #00539c 0%, #2f79bb 100%);
}

.not-found__eyebrow {
  margin: 0 0 1.2rem;
  color: #00539c;
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

h1 {
  margin: 0;
  max-width: 10ch;
  color: #102a43;
  font-size: clamp(4rem, 8vw, 6.8rem);
  line-height: 0.95;
  letter-spacing: -0.04em;
}

.not-found__message {
  max-width: 52rem;
  margin: 2rem 0 0;
  color: #486581;
  font-size: 1.8rem;
  line-height: 1.7;
}

.not-found__path {
  display: inline-flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-top: 2.8rem;
  padding: 1.4rem 1.6rem;
  border: 1px dashed rgba(0, 83, 156, 0.26);
  background: rgba(255, 255, 255, 0.72);
}

.not-found__path-label {
  color: #829ab1;
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

code {
  color: #102a43;
  font-size: 1.5rem;
  font-weight: 700;
  word-break: break-word;
}

.not-found__actions {
  display: flex;
  gap: 1.2rem;
  flex-wrap: wrap;
  margin-top: 3rem;
}

.not-found__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 19rem;
  padding: 1.3rem 1.8rem;
  border: 1px solid transparent;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease,
    color 0.2s ease;
}

.not-found__button:hover {
  transform: translateY(-1px);
}

.not-found__button--primary {
  background: #00539c;
  color: #fff;
  box-shadow: 0 1.2rem 2.6rem rgba(0, 83, 156, 0.22);
}

.not-found__button--secondary {
  border-color: rgba(16, 42, 67, 0.12);
  background: rgba(255, 255, 255, 0.9);
  color: #102a43;
}

@media (max-width: 700px) {
  .not-found {
    min-height: calc(100vh - 16rem);
    padding-inline: 1.6rem;
  }

  .not-found__card {
    padding: 3rem 2rem 2.4rem;
  }

  .not-found__actions {
    flex-direction: column;
  }

  .not-found__button {
    width: 100%;
    min-width: 0;
  }
}
</style>
