<template>
  <section class="solutions-page">
    <TheHero :item="heroItem" />

    <div class="solutions-content">
      <header class="solutions-header">
        <p class="eyebrow">ÇÖZÜMLER</p>
        <h1>İhtiyacınıza uygun makine grubunu seçin</h1>
        <p>
          Lazer kesim ve abkant çözümlerini ayrı akışlarda inceleyin; teknik
          değerler, seriler ve ürün detayları seçtiğiniz gruba göre şekillenir.
        </p>
      </header>

      <div class="solution-grid">
        <RouterLink
          v-for="solution in solutions"
          :key="solution.to"
          class="solution-card"
          :to="solution.to"
        >
          <span class="solution-kicker">{{ solution.kicker }}</span>
          <h2>{{ solution.title }}</h2>
          <p>{{ solution.description }}</p>
          <span class="solution-action">İncele</span>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import TheHero from '@/features/site/components/hero/TheHero.vue'

defineOptions({ name: 'SolutionsView' })

const heroItem = {
  title: 'Tumex çözümleri',
  subtitle: 'Doğru makine, doğru üretim akışı',
  picture: '/assets/images/LaserKesimHero.webp',
  imageAlt: 'Durmark lazer kesim makinesi'
}

const solutions = [
  {
    to: '/laser-cutting',
    kicker: 'Lazer Kesim',
    title: 'Lazer kesim tezgahları',
    description: 'Lazer gücü ve ebat bilgilerine göre doğru lazer kesim serisini seçin.'
  },
  {
    to: '/abkant',
    kicker: 'Abkant',
    title: 'Abkant pres tezgahları',
    description: 'Tonaj ve bükme uzunluğu değerlerine göre abkant çözümlerini inceleyin.'
  }
]
</script>

<style scoped>
.solutions-page {
  width: 100vw;
  overflow-x: hidden;
}

.solutions-content {
  max-width: 1120px;
  margin: var(--section-gap) auto;
  padding-inline: 1.5rem;
}

.solutions-header {
  max-width: 760px;
  margin-bottom: 3rem;
}

.eyebrow {
  margin: 0 0 0.75rem;
  color: var(--c-main);
  font-size: 1.2rem;
  font-weight: 800;
  letter-spacing: 0.22em;
}

.solutions-header h1 {
  margin: 0;
  color: var(--c-grey);
  font-size: clamp(3.6rem, 6vw, 6.8rem);
  line-height: 0.98;
}

.solutions-header p {
  margin: 1.5rem 0 0;
  color: #536b86;
  font-size: 1.7rem;
  line-height: 1.7;
}

.solution-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2rem;
}

.solution-card {
  display: grid;
  gap: 1rem;
  min-height: 23rem;
  padding: 3rem;
  color: var(--c-grey);
  text-decoration: none;
  border: 1px solid rgba(0, 83, 156, 0.18);
  border-left: 8px solid var(--c-main);
  background:
    linear-gradient(135deg, rgba(0, 83, 156, 0.08), rgba(255, 255, 255, 0.95)),
    #fff;
  box-shadow: 0 24px 70px rgba(16, 42, 67, 0.08);
  transition:
    transform 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;
}

.solution-card:hover,
.solution-card:focus-visible {
  transform: translateY(-4px);
  border-color: rgba(0, 83, 156, 0.42);
  box-shadow: 0 30px 90px rgba(16, 42, 67, 0.14);
}

.solution-kicker {
  color: #5f7892;
  font-size: 1.2rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.solution-card h2 {
  margin: 0;
  font-size: 2.5rem;
}

.solution-card p {
  margin: 0;
  color: #536b86;
  font-size: 1.45rem;
  line-height: 1.6;
}

.solution-action {
  align-self: end;
  color: var(--c-main);
  font-size: 1.35rem;
  font-weight: 800;
}

@media (max-width: 800px) {
  .solution-grid {
    grid-template-columns: 1fr;
  }

  .solution-card {
    min-height: auto;
    padding: 2.4rem;
  }
}
</style>
