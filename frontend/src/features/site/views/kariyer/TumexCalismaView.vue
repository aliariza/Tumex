<template>
  <section class="tumex-calisma">
    <section class="hero">
      <div class="hero__copy">
        <p class="hero__eyebrow">Tumex Kariyer</p>
        <h1 class="disp-1">Birlikte Daha Güçlü Üretelim</h1>
        <p class="hero__text">
          Satış, teknik destek, operasyon ve yönetim ekiplerimiz için yetenekli takım arkadaşlarıyla
          tanışmak istiyoruz. Açık pozisyon olmasa bile bize kendinizi tanıtabilirsiniz.
        </p>
      </div>

      <aside class="hero__cta">
        <h2 class="disp-3">Hızlı Başvuru</h2>
        <p>CV'nizi ve kısa bir ön yazıyı aşağıdaki adrese iletebilirsiniz.</p>
        <a href="mailto:info@tum-ex.com?subject=Kariyer%20Basvurusu">info@tum-ex.com</a>
        <small>Konu satırında ilgilendiğiniz rolü belirtmeniz değerlendirme sürecini hızlandırır.</small>
      </aside>
    </section>

    <section class="highlights">
      <article class="highlight-card">
        <p class="highlight-card__eyebrow">Çalışma Alanları</p>
        <h3>Satış, teknik servis, yönetim ve operasyon</h3>
        <p>Müşteri ilişkilerinden saha desteğine, yönetim koordinasyonundan teklif akışına kadar farklı noktalarda değer üretecek adaylar arıyoruz.</p>
      </article>

      <article class="highlight-card">
        <p class="highlight-card__eyebrow">Bizim İçin Önemli</p>
        <h3>Sorumluluk, iletişim ve öğrenme isteği</h3>
        <p>Teknik bilgi kadar ekip çalışmasına açıklık, düzenli takip ve müşteri odaklı yaklaşım da bizim için belirleyici.</p>
      </article>

      <article class="highlight-card">
        <p class="highlight-card__eyebrow">Başvuru Şekli</p>
        <h3>Açık başvuru kabul ediyoruz</h3>
        <p>Güncel ilan beklemeden özgeçmişinizi paylaşabilirsiniz. Uygun pozisyon açıldığında sizinle hızlıca iletişime geçebiliriz.</p>
      </article>
    </section>

    <section class="why-tumex">
      <div class="why-tumex__copy">
        <h2 class="disp-2">Neden Tumex?</h2>
        <p>
          Büyüyen yapımız içinde inisiyatif alabilen, sahayı tanıyan ve müşteriye değer üretmekten
          heyecan duyan ekip arkadaşlarıyla uzun vadeli bir yapı kurmak istiyoruz.
        </p>

        <ul>
          <li>Makine ve endüstri odaklı gerçek saha deneyimi</li>
          <li>Karar almayı ve sorumluluk üstlenmeyi destekleyen ekip kültürü</li>
          <li>Müşteriyle yakın çalışan pratik ve sonuç odaklı çalışma modeli</li>
        </ul>
      </div>

      <div class="why-tumex__steps">
        <article class="steps-card">
          <h2 class="disp-3">Başvuru Süreci</h2>
          <div class="steps-card__items">
            <p>1. CV'nizi ve kısa notunuzu paylaşın</p>
            <p>2. Uygun rol olduğunda ön görüşme planlayalım</p>
            <p>3. Teknik ve operasyonel uyumu birlikte değerlendirelim</p>
          </div>
        </article>

        <article class="contact-card">
          <h2 class="disp-3">İletişim</h2>
          <p>Kariyer başvuruları ve genel insan kaynakları iletişimi için:</p>
          <a href="mailto:info@tum-ex.com?subject=Kariyer%20Basvurusu">info@tum-ex.com</a>
          <a href="tel:+905303927259">+90 530 392 72 59</a>
          <small>LinkedIn profilinizi veya uzmanlık alanlarınızı da eklerseniz sizi daha doğru pozisyonlarla eşleştirebiliriz.</small>
        </article>
      </div>
    </section>
  </section>
</template>

<script setup>
defineOptions({ name: 'TumexCalismaView' })
</script>

<style scoped lang="scss">
.tumex-calisma {
  background: #f6f7f5;
  color: #1d2b36;
  padding-bottom: 8rem;
}

.hero {
  max-width: 1200px;
  margin: 0 auto;
  padding: 6rem 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.4rem;
  align-items: end;
}

.hero__copy {
  background: linear-gradient(135deg, #0e4f7f 0%, #2f7fb4 72%);
  color: #fff;
  padding: 3.2rem;
}

.hero__eyebrow,
.highlight-card__eyebrow {
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 1.2rem;
}

.hero__text {
  font-size: 1.9rem;
  line-height: 1.8;
  margin-top: 1.8rem;
}

.hero__cta {
  background: rgba(14, 79, 127, 0.08);
  border: 1px solid rgba(14, 79, 127, 0.12);
  padding: 2.6rem;
  display: grid;
  gap: 1.2rem;

  p,
  small {
    font-size: 1.55rem;
    line-height: 1.7;
    color: #486581;
  }

  a {
    font-size: 2rem;
    font-weight: 800;
    color: #0e4f7f;
    word-break: break-word;
  }
}

.highlights {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.8rem;
}

.highlight-card,
.why-tumex__copy,
.contact-card {
  background: #fff;
  border: 1px solid #dde6ec;
  padding: 2.4rem;
  box-shadow: 0 12px 28px rgba(16, 53, 79, 0.06);
}

.highlight-card h3 {
  font-size: 2.4rem;
  line-height: 1.3;
  margin-bottom: 1rem;
}

.highlight-card p,
.why-tumex__copy p,
.contact-card p,
.contact-card small {
  font-size: 1.6rem;
  line-height: 1.75;
  color: #51606b;
}

.why-tumex {
  max-width: 1200px;
  margin: 5rem auto 0;
  padding: 0 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.why-tumex__copy ul {
  display: grid;
  gap: 1rem;
  margin-top: 2rem;
  padding-left: 1.8rem;
}

.why-tumex__copy li {
  font-size: 1.65rem;
  line-height: 1.7;
}

.why-tumex__steps {
  display: grid;
  gap: 2rem;
}

.steps-card {
  background: #0e4f7f;
  color: #fff;
  padding: 2.6rem;
  box-shadow: 0 18px 40px rgba(14, 79, 127, 0.16);
}

.steps-card__items {
  display: grid;
  gap: 1rem;
  margin-top: 1.4rem;
}

.steps-card__items p {
  background: rgba(255, 255, 255, 0.1);
  padding: 1.2rem 1.4rem;
  font-size: 1.55rem;
  line-height: 1.7;
}

.contact-card {
  display: grid;
  gap: 1rem;
}

.contact-card a {
  font-size: 1.9rem;
  font-weight: 800;
  color: #0e4f7f;
}

@media (max-width: 800px) {
  .hero__copy .disp-1,
  .why-tumex__copy .disp-2 {
    font-size: 4.2rem;
    line-height: 1.1;
  }
}
</style>
