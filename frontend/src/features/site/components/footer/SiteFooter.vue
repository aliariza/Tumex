<template>
  <footer class="site-footer">
    <div class="footer-shell">
      <section class="footer-brand" aria-label="Tumex iletişim özeti">
        <RouterLink to="/" class="footer-logo" aria-label="Tumex ana sayfa">
          <TumexBlue />
        </RouterLink>
        <p>
          Sac metal işleme teknolojilerinde lazer kesim ve abkant çözümleriyle
          üretiminize doğru makineyi seçmenize yardımcı oluyoruz.
        </p>
        <a class="footer-cta" href="https://wa.me/905303927259" target="_blank" rel="noopener noreferrer">
          WhatsApp ile görüşün
        </a>
      </section>

      <nav class="footer-links" aria-label="Alt menü">
        <div class="footer-column">
          <h2>Çözümler</h2>
          <RouterLink to="/laser-cutting">Lazer Kesim</RouterLink>
          <RouterLink to="/abkant">Abkant</RouterLink>
          <RouterLink to="/solutions">Tüm çözümler</RouterLink>
        </div>

        <div class="footer-column">
          <h2>Kurumsal</h2>
          <RouterLink to="/hakkinda">Hakkımızda</RouterLink>
          <RouterLink to="/durmark-tarihce">Durmark Tarihçe</RouterLink>
          <RouterLink to="/kariyer/tumex-calisma">Kariyer</RouterLink>
          <RouterLink to="/site-haritasi">Site Haritası</RouterLink>
        </div>

        <div class="footer-column">
          <h2>İLETİŞİM</h2>
          <RouterLink to="/iletisim/merkez-ofis">Merkez Ofis</RouterLink>
          <RouterLink :to="isAuthenticated ? '/protected' : '/iletisim/bayi'">
            {{ isAuthenticated ? 'Bayi Paneli' : 'Bayi Girişi' }}
          </RouterLink>
          <a href="mailto:info@tum-ex.com">info@tum-ex.com</a>
        </div>
      </nav>
    </div>

    <div class="footer-bottom">
      <span>© {{ currentYear }} Tumex</span>
      <span>Endüstriyel üretim için akıllı makine çözümleri</span>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import TumexBlue from '@/shared/components/icons/TumexBlue.vue'

defineOptions({ name: 'SiteFooter' })

const store = useStore()
const currentYear = new Date().getFullYear()
const isAuthenticated = computed(() => store.getters.isAuthenticated)
</script>

<style scoped>
.site-footer {
  position: relative;
  width: 100vw;
  margin-top: var(--section-gap);
  overflow: hidden;
  border-top: 1px solid rgba(0, 83, 156, 0.14);
  background:
    radial-gradient(circle at 12% 10%, rgba(0, 83, 156, 0.16), transparent 28rem),
    linear-gradient(135deg, #f7fbff 0%, #ffffff 44%, #edf5fc 100%);
  color: #102a43;
}

.site-footer::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background-image:
    linear-gradient(rgba(0, 83, 156, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 83, 156, 0.045) 1px, transparent 1px);
  background-size: 42px 42px;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent);
}

.footer-shell {
  position: relative;
  z-index: 1;
  max-width: 1180px;
  margin: 0 auto;
  padding: 5rem 2rem 3.5rem;
  display: grid;
  grid-template-columns: minmax(26rem, 0.9fr) 1.6fr;
  gap: 5rem;
}

.footer-brand {
  border-left: 8px solid var(--c-main);
  padding: 2.2rem 0 2.2rem 2.4rem;
  background: rgba(255, 255, 255, 0.72);
  box-shadow: 0 24px 70px rgba(16, 42, 67, 0.08);
}

.footer-logo {
  display: inline-flex;
  max-width: 15rem;
  margin-bottom: 1.8rem;
}

.footer-brand p {
  max-width: 38rem;
  margin: 0;
  color: #536b86;
  font-size: 1.45rem;
  line-height: 1.7;
}

.footer-cta {
  display: inline-flex;
  margin-top: 2rem;
  padding: 1rem 1.5rem;
  color: #fff;
  background: #00539c;
  text-decoration: none;
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: 0.02em;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.footer-cta:hover,
.footer-cta:focus-visible {
  background: #00437e;
  transform: translateY(-2px);
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 2rem;
}

.footer-column {
  display: grid;
  align-content: start;
  gap: 1rem;
  padding-top: 0.6rem;
}

.footer-column h2 {
  margin: 0 0 0.8rem;
  color: #466683;
  font-size: 1.2rem;
  font-weight: 900;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.footer-column a {
  color: #102a43;
  text-decoration: none;
  font-size: 1.45rem;
  line-height: 1.35;
  transition: color 0.2s ease, transform 0.2s ease;
}

.footer-column a:hover,
.footer-column a:focus-visible {
  color: var(--c-main);
  transform: translateX(4px);
}

.footer-bottom {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  max-width: 1180px;
  margin: 0 auto;
  padding: 1.6rem 2rem 2.4rem;
  border-top: 1px solid rgba(0, 83, 156, 0.14);
  color: #6b7f95;
  font-size: 1.25rem;
}

@media (max-width: 900px) {
  .footer-shell {
    grid-template-columns: 1fr;
    gap: 3rem;
  }

  .footer-links {
    grid-template-columns: 1fr;
  }

  .footer-bottom {
    flex-direction: column;
  }
}
</style>
