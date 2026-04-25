<template>
  <section class="dealer-resource-panel">
    <article class="resource-card resource-card--primary">
      <p class="resource-card__eyebrow">{{ eyebrow }}</p>
      <h2>{{ title }}</h2>
      <p>{{ description }}</p>
    </article>

    <article class="resource-card">
      <p class="resource-card__eyebrow">Broşür</p>
      <h3>{{ brochureLabel }}</h3>
      <p>Güncel PDF dosyasını indirip müşterinizle hızlıca paylaşabilirsiniz.</p>
      <a class="resource-card__button" :href="brochureHref" target="_blank" rel="noopener noreferrer">
        Broşürü Aç
      </a>
    </article>

    <article class="resource-card">
      <p class="resource-card__eyebrow">Teklif Hazırlığı</p>
      <h3>Hızlı talep gönderin</h3>
      <p>Makine tipi, güç ya da tonaj ve müşteri notlarıyla ön talep iletin.</p>
      <a class="resource-card__button" :href="mailtoHref">Teklif Talebi Gönder</a>
    </article>

    <article class="resource-card">
      <p class="resource-card__eyebrow">Hızlı İletişim</p>
      <h3>WhatsApp ve merkez ofis</h3>
      <p>Teknik ekip ya da satışla hızlı koordinasyon için iletişim kanallarını kullanın.</p>
      <div class="resource-card__actions">
        <a class="resource-card__button resource-card__button--ghost" href="https://wa.me/905303927259" target="_blank" rel="noopener noreferrer">
          WhatsApp
        </a>
        <RouterLink class="resource-card__button resource-card__button--ghost" to="/iletisim/merkez-ofis">
          Merkez Ofis
        </RouterLink>
      </div>
    </article>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

defineOptions({ name: 'DealerResourcePanel' })

const props = defineProps({
  eyebrow: {
    type: String,
    default: 'Bayi Araçları'
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  brochureLabel: {
    type: String,
    required: true
  },
  brochurePath: {
    type: String,
    required: true
  },
  quoteSubject: {
    type: String,
    required: true
  }
})

const brochureHref = computed(() => `/assets/pdf/${props.brochurePath}`)
const mailtoHref = computed(() => `mailto:info@tum-ex.com?subject=${encodeURIComponent(props.quoteSubject)}`)
</script>

<style scoped lang="scss">
.dealer-resource-panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.6rem;
}

.resource-card {
  display: grid;
  gap: 1rem;
  padding: 2rem;
  background: #fff;
  border: 1px solid rgba(16, 42, 67, 0.1);

  h2,
  h3 {
    margin: 0;
    color: #102a43;
    font-size: 2.1rem;
    line-height: 1.25;
  }

  p {
    margin: 0;
    color: #486581;
    font-size: 1.5rem;
    line-height: 1.65;
  }
}

.resource-card--primary {
  background: linear-gradient(135deg, rgba(0, 83, 156, 0.1), rgba(255, 255, 255, 0.98));
}

.resource-card__eyebrow {
  color: #00539c;
  font-size: 1.2rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.resource-card__actions {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.resource-card__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  min-height: 4.2rem;
  padding: 1rem 1.4rem;
  background: #00539c;
  border: 1px solid #00539c;
  color: #fff;
  text-decoration: none;
  font-size: 1.4rem;
  font-weight: 800;
}

.resource-card__button--ghost {
  background: #fff;
  color: #102a43;
  border-color: rgba(16, 42, 67, 0.14);
}
</style>
