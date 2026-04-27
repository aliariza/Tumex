<template>
  <main class="site-map-page">
    <section class="site-map-hero">
      <p class="eyebrow">SİTE HARİTASI</p>
      <h1>Tumex sayfalarına hızlı erişim</h1>
      <p>
        Çözümler, ürün serileri, kurumsal bilgiler ve iletişim sayfalarını tek
        yerden inceleyin.
      </p>
    </section>

    <section class="site-map-grid" aria-label="Site bağlantıları">
      <article v-for="group in siteMapGroups" :key="group.title" class="site-map-card">
        <p class="card-eyebrow">{{ group.eyebrow }}</p>
        <h2>{{ group.title }}</h2>
        <ul>
          <li v-for="link in group.links" :key="link.to">
            <RouterLink :to="link.to">{{ link.label }}</RouterLink>
          </li>
        </ul>
      </article>
    </section>
  </main>
</template>

<script setup>
defineOptions({ name: 'SiteMapView' })

const siteMapGroups = [
  {
    eyebrow: 'Başlangıç',
    title: 'Ana Sayfa',
    links: [
      { label: "Tumex'e Hoşgeldiniz", to: '/' },
      { label: 'Çözümler', to: '/solutions' }
    ]
  },
  {
    eyebrow: 'MAKİNE grupları',
    title: 'Çözümler',
    links: [
      { label: 'Lazer Kesim Makineleri', to: '/laser-cutting' },
      { label: 'D-DLC serisi', to: '/laser-cutting/D-DLC' },
      { label: 'D-DLC-S serisi', to: '/laser-cutting/D-DLC-S' },
      { label: 'DLC serisi', to: '/laser-cutting/DLC' },
      { label: 'Abkant Makineleri', to: '/abkant' },
      { label: 'DGE serisi', to: '/abkant/DGE' },
      { label: 'PSH4 serisi', to: '/abkant/PSH4' },
      { label: 'WC67K serisi', to: '/abkant/WC67K' }
    ]
  },
  {
    eyebrow: 'Kurumsal',
    title: 'Hakkımızda',
    links: [
      { label: 'Tumex Hakkında', to: '/hakkinda' },
      { label: 'Durmark Tarihçe', to: '/durmark-tarihce' },
      { label: "Tumex'de Çalışmak", to: '/kariyer/tumex-calisma' },
      { label: 'Açık Pozisyonlar', to: '/kariyer/acik-pozisyonlar' }
    ]
  },
  {
    eyebrow: 'Bağlantı',
    title: 'İletişim',
    links: [
      { label: 'Merkez Ofis', to: '/iletisim/merkez-ofis' },
      { label: 'Bayi Girişi', to: '/iletisim/bayi' }
    ]
  },
  {
    eyebrow: 'GİRİŞLER',
    title: 'Bayi ve Yönetim',
    links: [
      { label: 'Bayi Alanı', to: '/iletisim/bayi' },
      { label: 'Admin Girişi', to: '/admin' }
    ]
  }
]
</script>

<style scoped>
.site-map-page {
  width: min(1180px, calc(100vw - 4rem));
  margin: var(--section-gap) auto;
  color: #102a43;
}

.site-map-hero {
  position: relative;
  padding: 5rem 5.5rem;
  border-left: 8px solid var(--c-main);
  background:
    linear-gradient(135deg, rgba(0, 83, 156, 0.08), transparent 38%),
    #fff;
  box-shadow: 0 24px 70px rgba(16, 42, 67, 0.08);
}

.site-map-hero::after {
  content: '';
  position: absolute;
  right: 4rem;
  top: 4rem;
  width: 9rem;
  height: 9rem;
  border: 1px dashed rgba(0, 83, 156, 0.28);
  background: rgba(255, 255, 255, 0.48);
}

.eyebrow,
.card-eyebrow {
  margin: 0;
  color: #557391;
  font-size: 1.25rem;
  font-weight: 900;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.site-map-hero h1 {
  max-width: 78rem;
  margin: 1rem 0 1.4rem;
  color: #102a43;
  font-size: clamp(4.6rem, 7vw, 8rem);
  line-height: 0.95;
}

.site-map-hero p:last-child {
  max-width: 72rem;
  margin: 0;
  color: #536b86;
  font-size: 1.9rem;
  line-height: 1.7;
}

.site-map-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 2rem;
  margin-top: 3rem;
}

.site-map-card {
  min-height: 24rem;
  padding: 3rem;
  border: 1px solid rgba(0, 83, 156, 0.18);
  border-left: 7px solid var(--c-main);
  background:
    linear-gradient(135deg, rgba(0, 83, 156, 0.06), transparent 45%),
    #fff;
  box-shadow: 0 20px 60px rgba(16, 42, 67, 0.06);
}

.site-map-card h2 {
  margin: 1rem 0 1.8rem;
  color: #102a43;
  font-size: 2.6rem;
  line-height: 1.1;
}

.site-map-card ul {
  display: grid;
  gap: 1rem;
  padding: 0;
  margin: 0;
  list-style: none;
}

.site-map-card a {
  display: inline-flex;
  color: #234765;
  font-size: 1.6rem;
  line-height: 1.4;
  text-decoration: none;
  transition:
    color 0.2s ease,
    transform 0.2s ease;
}

.site-map-card a::before {
  content: '›';
  margin-right: 0.8rem;
  color: var(--c-main);
}

.site-map-card a:hover,
.site-map-card a:focus-visible {
  color: var(--c-main);
  transform: translateX(4px);
}

@media (max-width: 800px) {
  .site-map-page {
    width: min(100vw - 2rem, 64rem);
  }

  .site-map-hero {
    padding: 3rem 2.4rem;
  }

  .site-map-hero::after {
    display: none;
  }

  .site-map-grid {
    grid-template-columns: 1fr;
  }
}
</style>
