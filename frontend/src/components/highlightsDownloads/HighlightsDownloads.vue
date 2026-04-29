<template>
  <section class="highlights-downloads">
    <div class="highlights">
      <span class="section-tag">SERİ AVANTAJLARI</span>
      <h1 class="disp-2">Öne çıkanlar</h1>
      <ul class="square-bullets">
        <li
          v-for="highlight in normalizedHighlights"
          :key="highlight"
        >
          {{ highlight }}
        </li>
      </ul>
    </div>
    <div class="downloads">
      <span class="section-tag">HAZIR DOKÜMAN</span>
      <h1 class="disp-2">İndirmeler</h1>
      <a
        v-if="brochureLink"
        :href="brochureLink"
        target="_blank"
        rel="noopener noreferrer"
        class="download-card"
      >
        <span class="download-card__eyebrow">PDF BROŞÜR</span>
        <strong class="download-card__title">{{ productTitle || 'Ürün broşürü' }}</strong>
        <span class="download-card__copy">Tek sayfada seri özeti, kullanım odağı ve iletişim bilgileri.</span>
        <span class="download-card__cta">Broşür indir</span>
      </a>
      <p v-else class="download-empty">
        Bu ürün için henüz PDF broşür eklenmedi.
      </p>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  pdfPath: {
    type: String,
    default: ''
  },
  highlights: {
    type: Array,
    default: () => []
  },
  productTitle: {
    type: String,
    default: ''
  }
})

const brochureLink = computed(() => {
  if (!props.pdfPath) return ''

  const base = /^https?:\/\//i.test(props.pdfPath)
    ? props.pdfPath
    : `/assets/pdf/${props.pdfPath}`

  // Append #view=FitH so browsers open the PDF inline instead of downloading it
  return base.includes('#') ? base : `${base}#view=FitH`
})

const normalizedHighlights = computed(() => props.highlights.filter(Boolean))
</script>

<style scoped lang="scss">
.highlights-downloads {
  display: grid;
  grid-template-columns: 1fr 1fr;
  max-width: 1050px;
  gap: 5rem;
  margin: var(--section-gap) auto;
  padding-inline: 3rem;
  @media only screen and (max-width: 800px) {
    grid-template-columns: 1fr;
  }
  .disp-2 {
    @media only screen and (max-width: 800px) {
      font-size: 4rem;
    }
  }
}

.highlights,
.downloads {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(0, 83, 156, 0.12);
  background:
    radial-gradient(circle at top right, rgba(0, 83, 156, 0.16), transparent 12rem),
    linear-gradient(160deg, #ffffff 0%, #f5faff 100%);
  box-shadow: 0 24px 60px rgba(16, 42, 67, 0.08);
  padding: 3rem;
}

.section-tag {
  display: inline-flex;
  margin-bottom: 1.6rem;
  color: #456783;
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

ul.square-bullets {
  gap: 1.3rem;
  padding-left: 0;
  display: flex;
  flex-direction: column;
  margin: 2rem 0 0;
}

ul.square-bullets li {
  position: relative;
  padding-left: 2.2rem;
  color: #24435f;
  font-size: 1.6rem;
  line-height: 1.6;
  list-style: none;
}

ul.square-bullets li::before {
  content: '';
  position: absolute;
  top: 1.1rem;
  left: 0;
  width: 1.1rem;
  height: 1.1rem;
  background-color: var(--c-main);
  transform: translateY(-50%) rotate(45deg);
}

.download-card {
  display: grid;
  gap: 1rem;
  margin-top: 2rem;
  padding: 2.4rem;
  color: #102a43;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.88);
  border-left: 6px solid var(--c-main);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    border-color 0.2s ease;
}

.download-card:hover,
.download-card:focus-visible {
  transform: translateY(-4px);
  box-shadow: 0 24px 50px rgba(0, 83, 156, 0.12);
  border-color: #0a6bc3;
}

.download-card__eyebrow {
  color: #5f7b94;
  font-size: 1.1rem;
  font-weight: 800;
  letter-spacing: 0.22em;
}

.download-card__title {
  font-size: 2.2rem;
  line-height: 1.2;
}

.download-card__copy {
  color: #506b84;
  font-size: 1.45rem;
  line-height: 1.6;
}

.download-card__cta {
  color: var(--c-main);
  font-size: 1.4rem;
  font-weight: 800;
  letter-spacing: 0.05em;
}

.download-empty {
  margin-top: 2rem;
  color: #506b84;
  font-size: 1.45rem;
  line-height: 1.6;
}
</style>
