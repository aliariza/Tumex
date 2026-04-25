<template>
  <section class="acik-pozisyonlar">
    <header class="positions-hero">
      <div>
        <p class="positions-hero__eyebrow">Açık Roller</p>
        <h1 class="disp-1">Ekibimize katılabileceğiniz alanlar</h1>
      </div>
      <p class="positions-hero__text">
        Aşağıdaki roller örnek başvuru alanlarıdır. İlgili deneyiminiz varsa doğrudan bizimle iletişime geçebilirsiniz.
      </p>
    </header>

    <p v-if="loading" class="state-message">Pozisyonlar yükleniyor...</p>
    <p v-else-if="error" class="state-message state-message--error">{{ error }}</p>

    <section v-else class="positions-grid">
      <article v-for="position in positions" :key="position._id" class="position-card">
        <div class="position-card__top">
          <div>
            <p class="position-card__eyebrow">{{ position.department }}</p>
            <h2 class="disp-4">{{ position.title }}</h2>
          </div>
          <div class="position-card__badges">
            <span>{{ position.locationType }}</span>
            <span>{{ position.employmentType }}</span>
          </div>
        </div>

        <p class="position-card__summary">{{ position.summary }}</p>

        <ul v-if="position.highlights?.length" class="position-card__highlights">
          <li v-for="item in position.highlights" :key="item">{{ item }}</li>
        </ul>

        <a
          class="position-card__cta"
          :href="buildMailTo(position)"
        >
          Bu role başvur
        </a>
      </article>

      <article v-if="!positions.length" class="empty-card">
        <h2 class="disp-3">Şu anda yayında pozisyon bulunmuyor</h2>
        <p>
          Açık başvuruları yine de düzenli olarak inceliyoruz. Özgeçmişinizi bizimle paylaşırsanız uygun fırsat oluştuğunda sizinle iletişime geçebiliriz.
        </p>
        <a href="mailto:info@tum-ex.com?subject=Acik%20Basvuru">Açık Başvuru Gönder</a>
      </article>
    </section>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { getPublishedJobPositions } from '@/features/site/services/jobPositionApi'

defineOptions({ name: 'AcikPozisyonlarView' })

const positions = ref([])
const loading = ref(false)
const error = ref('')

function buildMailTo(position) {
  const email = position.applicationEmail || 'info@tum-ex.com'
  const subject = encodeURIComponent(position.applicationSubject || `${position.title} Basvurusu`)
  return `mailto:${email}?subject=${subject}`
}

onMounted(async () => {
  loading.value = true
  error.value = ''

  try {
    positions.value = await getPublishedJobPositions()
  } catch (requestError) {
    error.value = requestError.response?.data?.message || 'Pozisyonlar alınamadı.'
  } finally {
    loading.value = false
  }
})
</script>

<style scoped lang="scss">
.acik-pozisyonlar {
  max-width: 1200px;
  margin: 0 auto;
  padding: 5rem 2rem 8rem;
}

.positions-hero {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 2rem;
  flex-wrap: wrap;
  margin-bottom: 2.4rem;
}

.positions-hero__eyebrow,
.position-card__eyebrow {
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #2f79bb;
  margin-bottom: 0.8rem;
}

.positions-hero__text {
  max-width: 46rem;
  font-size: 1.7rem;
  line-height: 1.75;
  color: #51606b;
}

.state-message {
  font-size: 1.6rem;
  line-height: 1.7;
  color: #51606b;
}

.state-message--error {
  color: #b42318;
}

.positions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.8rem;
}

.position-card,
.empty-card {
  background: #fff;
  border: 1px solid #dde6ec;
  padding: 2.4rem;
  box-shadow: 0 12px 28px rgba(16, 53, 79, 0.06);
  display: grid;
  gap: 1.4rem;
}

.position-card__top {
  display: grid;
  gap: 1rem;
}

.position-card__badges {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;

  span {
    background: #eef5fa;
    color: #51606b;
    font-size: 1.25rem;
    font-weight: 700;
    padding: 0.6rem 0.9rem;
  }
}

.position-card__summary,
.empty-card p {
  font-size: 1.6rem;
  line-height: 1.75;
  color: #51606b;
}

.position-card__highlights {
  display: grid;
  gap: 0.7rem;
  padding-left: 1.8rem;
  font-size: 1.5rem;
  line-height: 1.65;
  color: #1d2b36;
}

.position-card__cta,
.empty-card a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 1.1rem 1.6rem;
  background: #0e4f7f;
  color: #fff;
  font-size: 1.5rem;
  font-weight: 800;
}

@media (max-width: 800px) {
  .positions-hero .disp-1 {
    font-size: 4.2rem;
    line-height: 1.1;
  }
}
</style>
