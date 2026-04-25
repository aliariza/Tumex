<template>
  <ProtectedLayout
    title="Tumex bayi alanına hoş geldiniz"
    description="Bu alan bayi kullanıcıları için ayrılan özel içerikleri ve sonraki korunaklı sayfa akışlarını barındırır."
  >
    <section class="dealer-dashboard">
      <DealerSubnav />
      <DealerResourcePanel
        eyebrow="Bayi Araçları"
        title="Teklif ve içerik akışı"
        description="Bayi panelinden broşürlere ulaşabilir, hızlı teklif talebi başlatabilir ve satış akışını hızlandırabilirsiniz."
        brochure-label="Genel Lazer Broşürü"
        brochure-path="Durmark_Laser.pdf"
        quote-subject="Genel Bayi Teklif Talebi"
      />
      <DealerQuoteRequestForm
        eyebrow="Talep Merkezi"
        title="Genel bayi talebi oluşturun"
        description="Hangi ürün grubuna ilerleyeceğiniz net değilse bile temel müşteri bilgisini bırakın, Tumex ekibi talebi uygun satış akışına yönlendirsin."
        product-group="Genel Bayi Talebi"
        product-group-label="Genel Bayi Talebi"
        series-placeholder="Örn. Abkant, lazer veya henüz netleşmedi"
        button-label="Genel Talebi Gönder"
      />

      <div class="dealer-dashboard__hero">
        <div class="dealer-dashboard__stat">
          <span class="dealer-dashboard__stat-label">Hızlı Erişim</span>
          <strong>3 ana bayi akışı</strong>
        </div>
        <p>
          Ürün gruplarına göre ilerleyebilir, teknik ekip ile paylaşacağınız notları hazırlayabilir
          ve ihtiyacınıza uygun seriye daha hızlı ulaşabilirsiniz.
        </p>
      </div>

      <div class="dealer-dashboard__grid">
        <RouterLink to="/protected/abkant" class="dealer-card">
          <p class="dealer-card__eyebrow">Abkant</p>
          <h2>Abkant bayi bölümü</h2>
          <p>Tonaj ve bükme uzunluğu aralıklarını inceleyin, öne çıkan serilere doğrudan geçin.</p>
        </RouterLink>

        <RouterLink to="/protected/laser" class="dealer-card">
          <p class="dealer-card__eyebrow">Lazer Kesim</p>
          <h2>Lazer bayi bölümü</h2>
          <p>Güç ve ebat bazlı serileri görüntüleyin, teklif öncesi uygun aileyi hızlıca seçin.</p>
        </RouterLink>

        <article class="dealer-card dealer-card--note">
          <p class="dealer-card__eyebrow">İş Akışı</p>
          <h2>Bayi çalışma önerisi</h2>
          <ul>
            <li>Önce ürün grubunu seçin</li>
            <li>Uygun seriyi teknik aralıklarla daraltın</li>
            <li>Detay sayfasına geçip müşteri teklifini hazırlayın</li>
          </ul>
        </article>
      </div>

      <div class="dealer-dashboard__panel">
        <div>
          <p class="dealer-card__eyebrow">Kullanım Notu</p>
          <h2>Bu alanı nasıl kullanmalı?</h2>
          <p>
            Bayi paneli, ürün ailesine göre doğru sayfaya daha hızlı ulaşmanız için sadeleştirildi.
            Buradaki kısayollar sizi doğrudan ilgili bayi akışına taşır.
          </p>
        </div>

        <div class="dealer-dashboard__links">
          <RouterLink to="/abkant">Genel abkant sayfası</RouterLink>
          <RouterLink to="/laser-cutting">Genel lazer sayfası</RouterLink>
          <RouterLink to="/iletisim/merkez-ofis">Merkez ofis iletişim</RouterLink>
        </div>
      </div>
    </section>
  </ProtectedLayout>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import DealerQuoteRequestForm from './DealerQuoteRequestForm.vue'
import DealerResourcePanel from './DealerResourcePanel.vue'
import DealerSubnav from './DealerSubnav.vue'

defineOptions({
  name: 'ProtectedHomeView'
})

import ProtectedLayout from './ProtectedLayout.vue'
</script>

<style scoped lang="scss">
.dealer-dashboard {
  display: grid;
  gap: 2rem;
}

.dealer-dashboard__hero,
.dealer-dashboard__panel {
  display: grid;
  gap: 1.4rem;
  padding: 2rem;
  background: rgba(240, 247, 255, 0.86);
  border: 1px solid rgba(0, 83, 156, 0.12);
}

.dealer-dashboard__hero p,
.dealer-dashboard__panel p {
  margin: 0;
  font-size: 1.55rem;
  line-height: 1.7;
  color: #486581;
}

.dealer-dashboard__stat {
  display: grid;
  gap: 0.4rem;

  strong {
    font-size: 2.2rem;
    color: #102a43;
  }
}

.dealer-dashboard__stat-label,
.dealer-card__eyebrow {
  color: #00539c;
  font-size: 1.2rem;
  font-weight: 800;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.dealer-dashboard__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.6rem;
}

.dealer-card {
  display: grid;
  gap: 1rem;
  padding: 2rem;
  background: #fff;
  border: 1px solid rgba(16, 42, 67, 0.1);
  color: inherit;
  text-decoration: none;
  transition: transform 0.18s ease, box-shadow 0.18s ease, border-color 0.18s ease;

  h2 {
    margin: 0;
    color: #102a43;
    font-size: 2.2rem;
    line-height: 1.2;
  }

  p,
  li {
    margin: 0;
    color: #486581;
    font-size: 1.5rem;
    line-height: 1.65;
  }

  &:hover {
    transform: translateY(-2px);
    border-color: rgba(0, 83, 156, 0.2);
    box-shadow: 0 1.6rem 3rem rgba(15, 23, 42, 0.08);
  }
}

.dealer-card--note {
  ul {
    display: grid;
    gap: 0.8rem;
    padding-left: 1.8rem;
  }
}

.dealer-dashboard__links {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  a {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 4.2rem;
    padding: 1rem 1.4rem;
    background: #102a43;
    color: #fff;
    text-decoration: none;
    font-size: 1.4rem;
    font-weight: 700;
  }
}

@media (max-width: 700px) {
  .dealer-dashboard__links {
    a {
      width: 100%;
    }
  }
}
</style>
