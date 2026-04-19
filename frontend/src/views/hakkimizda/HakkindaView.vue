<template>
  <section class="hakkinda">
    <the-hero :item="item"></the-hero>
    <div class="hakkinda-inner">
      <div class="title">
        <h1 class="disp-1">Biz kimiz?</h1>
      </div>
      <div class="paragraph">
        <div class="left">
          <h3>
            2010 yılında Hong Kong'un dinamik ticaret atmosferinde temelleri atılan Tumex
            Mümessillik ve Dış Ticaret Ltd. Şti., kısa süre içerisinde global bir oyuncu haline
            geldi. Başlangıcını bir ticaret şirketi olarak yapan firmamız, sektördeki talep ve
            fırsatları göz önünde bulundurarak faaliyetlerini genişletti ve paslanmaz malzeme
            konusunda ünlü olan Çin'in Wenzhou şehrinde modern bir atölye kurarak paslanmaz bağlantı
            elemanları üretimine başladı.
          </h3>
          <h3>
            Üretim kapasitemiz ve kalitemiz sayesinde kısa sürede uluslararası pazarda tanındık.
            Müşteri portföyümüzü Pakistan, Güney Kore, Almanya, Hollanda, Amerika ve Türkiye gibi
            önemli ülkelerdeki prestijli firmalarla genişlettik.
          </h3>
        </div>
        <div class="right">
          <h3>
            10 yıl boyunca Çin'de sürekli büyüyen bir başarı grafiği çizen firmamız, Çin hükümetinin
            yabancı şirketlere uyguladığı yaptırımların ardından Türkiye'ye dönme kararı aldı.
            Anavatanımızda, metal sektörüne yenilikçi ve kaliteli çözümler sunma hedefiyle
            faaliyetlerimize devam etmekteyiz. Bu doğrultuda, Durmark markası ile stratejik bir iş
            birliği yaparak Türkiye'nin tek yetkili distribütörü olduk.
          </h3>
          <h3>
            Tumex Mumessillik ve Dış Ticaret Ltd. Şti. olarak, sektördeki tecrübemizle
            müşterilerimize en iyi hizmeti sunmayı ve sürdürülebilir büyümemizi devam ettirmeyi
            hedefliyoruz.
          </h3>
        </div>
      </div>
    </div>
    <the-band :icerik="icerik"></the-band>
  </section>
</template>

<script setup>
import TheHero from '../../components/hero/TheHero.vue'
import TheBand from '../../components/band/TheBand.vue'

const item = {
  title: 'Hakkımızda',
  picture: '/assets/images/hakkimizda.webp'
}

const icerik = {
  title: 'Misyonumuz',
  paragraf_1:
    'Lazer kesme, Abkant ve lazer kaynak alanlarında, endüstrinin sürekli değişen ve gelişen ihtiyaçlarına yanıt vererek en yüksek kalite standartlarında ürün ve hizmet sunmaktır. ',
  paragraf_2:
    'Müşteri memnuniyetini merkezine alarak, teknolojik yenilikleri yakından takip eden ve sürekli kendini geliştiren bir ekiple, sektördeki liderliğimizi sürdürmeyi ve iş ortaklarımızın beklentilerini aşmayı hedeflemekteyiz.',
  button: false,
  class: 'one-piece',
  image: '/assets/images/mission.webp',
  style: '53% 55%'
}
</script>

<style lang="scss" scoped>
.hakkinda {
  .hakkinda-inner {
    max-width: 1050px;
    margin: var(--section-gap) auto;
    padding-inline: 3rem;
  }
  .paragraph {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5rem;
    @media only screen and (max-width: 800px) {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 1fr;
    }

    .left,
    .right {
      display: flex;
      flex-direction: column;
      h3 {
        padding-bottom: 1rem;
        text-indent: 4%;
        text-align: justify;
        font-size: 2rem;
        font-weight: 400;
        color: var(--c-grey);
        line-height: 2.5rem;
      }
    }
  }
  .disp-1 {
    color: var(--c-main);
    margin-bottom: 2rem;
  }
}
</style>
