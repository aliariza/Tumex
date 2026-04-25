<template>
  <ProtectedLayout
    title="Abkant bayi bölümü"
    description="Abkant ürün grubuna ait seri ailelerini hızlıca inceleyin ve doğru sayfaya geçin."
  >
    <section class="protected-machine-page">
      <DealerSubnav />
      <DealerResourcePanel
        eyebrow="Abkant Kaynakları"
        title="Abkant bayi araçları"
        description="Abkant teklif süreci için broşür, merkez ofis ve hızlı talep bağlantılarını burada tutuyoruz."
        brochure-label="Durmark Abkant Broşürü"
        brochure-path="DurMarkAbkant.pdf"
        quote-subject="Abkant Bayi Teklif Talebi"
      />
      <DealerQuoteRequestForm
        eyebrow="Abkant Talebi"
        title="Abkant teklif talebi bırakın"
        description="Tonaj, bükme boyu ve müşteri notlarını girin. Talep bayi hesabınızla birlikte satış ekibine iletilsin."
        product-group="Abkant"
        product-group-label="Abkant"
        series-placeholder="Örn. PSH, HAP veya özel tonaj"
        button-label="Abkant Talebini Gönder"
      />

      <div class="protected-machine-page__intro">
        <article class="info-card">
          <p class="info-card__eyebrow">Abkant Akışı</p>
          <h2>Seri seçimini hızlandırın</h2>
          <p>
            Tonaj ve bükme uzunluğu ihtiyacına göre aile seçimini daraltmak için bu alanı kullanın.
            Kartlar sizi doğrudan ilgili seri sayfasına götürür.
          </p>
        </article>

        <article class="info-card info-card--dark">
          <p class="info-card__eyebrow">Bayi Notu</p>
          <ul>
            <li>Müşteri tonaj ihtiyacını netleştirin</li>
            <li>Bükme uzunluğunu seri aralığıyla eşleştirin</li>
            <li>Detay sayfasından teknik tabloya geçin</li>
          </ul>
        </article>
      </div>

      <p v-if="loading" class="state-message">Abkant serileri yükleniyor...</p>
      <p v-else-if="error" class="state-message state-message--error">{{ error }}</p>

      <div v-else class="series-grid">
        <RouterLink
          v-for="item in machineItems"
          :key="item.href"
          :to="item.href"
          class="series-card"
        >
          <img :src="item.image" :alt="item.altText" />
          <div class="series-card__body">
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
          </div>
        </RouterLink>
      </div>
    </section>
  </ProtectedLayout>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useMachineCatalog } from '@/features/machines/composables/useMachineCatalog'
import DealerQuoteRequestForm from './DealerQuoteRequestForm.vue'
import DealerResourcePanel from './DealerResourcePanel.vue'
import DealerSubnav from './DealerSubnav.vue'
import ProtectedLayout from './ProtectedLayout.vue'

const { machineItems, loading, error } = useMachineCatalog('abkant')
</script>

<style scoped lang="scss">
.protected-machine-page,
.protected-machine-page__intro,
.series-grid {
  display: grid;
  gap: 1.6rem;
}

.protected-machine-page__intro {
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.info-card,
.series-card {
  background: #fff;
  border: 1px solid rgba(16, 42, 67, 0.1);
}

.info-card {
  display: grid;
  gap: 1rem;
  padding: 2rem;

  h2 {
    margin: 0;
    color: #102a43;
    font-size: 2.2rem;
  }

  p,
  li {
    margin: 0;
    color: #486581;
    font-size: 1.5rem;
    line-height: 1.65;
  }

  ul {
    display: grid;
    gap: 0.8rem;
    padding-left: 1.8rem;
  }
}

.info-card--dark {
  background: #102a43;

  h2,
  p,
  li,
  .info-card__eyebrow {
    color: #fff;
  }
}

.info-card__eyebrow {
  color: #00539c;
  font-size: 1.2rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.state-message {
  margin: 0;
  color: #486581;
  font-size: 1.55rem;
}

.state-message--error {
  color: #b42318;
}

.series-grid {
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
}

.series-card {
  display: grid;
  color: inherit;
  text-decoration: none;
  overflow: hidden;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(0, 83, 156, 0.22);
    box-shadow: 0 1.6rem 3rem rgba(15, 23, 42, 0.08);
  }

  img {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: contain;
    background: linear-gradient(180deg, #f8fbff 0%, #eef5fa 100%);
    padding: 1.4rem;
  }
}

.series-card__body {
  display: grid;
  gap: 0.8rem;
  padding: 1.8rem;

  h3 {
    margin: 0;
    color: #102a43;
    font-size: 2rem;
    line-height: 1.25;
  }

  p {
    margin: 0;
    color: #486581;
    font-size: 1.45rem;
    line-height: 1.65;
  }
}
</style>
