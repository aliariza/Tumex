<template>
  <section class="merkez-ofis">
    <div class="left">
      <h1 class="disp-1">Merkez Ofis</h1>
      <h1 class="disp-2">Ankara / Türkiye</h1>
      <h1 class="disp-4">Tumex Ltd. Şti.</h1>
      <div class="adres-bolumu">
        <div class="adres">
          <p>Birlik Mahallesi 408. Sokak</p>
          <p>No: 9 / 2 Çankaya</p>
          <p>Ankara / Türkiye</p>
        </div>
        <div class="ikon-bilgi">
          <div class="ikon"><phone-icon /></div>
          <div class="bilgi">+90 530 392 7259</div>
        </div>
        <div class="ikon-bilgi">
          <div class="ikon"><envelope-icon /></div>
          <div class="bilgi">satis@tum-ex.com</div>
        </div>
        <div class="ikon-bilgi">
          <a href="https://www.tum-ex.com">
            <div class="ikon"><link-icon /></div>
            <div class="bilgi">www.tum-ex.com</div>
          </a>
        </div>
        <div class="ikon-bilgi">
          <a
            href="https://www.google.com/maps/place/Birlik,+408.+Sk.+No:9,+06610+%C3%87ankaya%2FAnkara/@39.8840806,32.8712578,20.13z/data=!4m9!1m2!10m1!1e1!3m5!1s0x14d34f8c099641d3:0x3ad651026b226c6d!8m2!3d39.8841227!4d32.8714836!16s%2Fg%2F11fswcb_bc?entry=ttu"
            target="_blank"
          >
            <div class="ikon"><location-icon /></div>
            <div class="bilgi">Google harita</div>
          </a>
        </div>
        <div class="ikon-bilgi">
          <a href="https://www.instagram.com/tumex.ltd" target="_blank">
            <div class="ikon"><instagram-icon /></div>
            <div class="bilgi">@tumex.ltd</div>
          </a>
        </div>
      </div>
    </div>
    <div class="right">
      <img src="/assets/images/Turkey_Map.webp" class="svg" />
    </div>
  </section>
</template>

<script setup>
import EnvelopeIcon from '../../components/icons/EnvelopeIcon.vue'
import PhoneIcon from '../../components/icons/PhoneIcon.vue'
import LinkIcon from '../../components/icons/LinkIcon.vue'
import LocationIcon from '../../components/icons/LocationIcon.vue'
import InstagramIcon from '../../components/icons/InstagramIcon.vue'

defineOptions({ name: 'MerkezOfis' })
</script>

<style lang="scss" scoped>
.merkez-ofis {
  max-width: 1200px;
  margin: var(--section-gap) auto;
  display: grid;
  grid-template-columns: 50% 50%;
  align-items: center;
  justify-content: space-between;
  padding-inline: 5rem;
  @media only screen and (max-width: 800px) {
    grid-template-columns: 1fr;
  }

  .left {
    width: 100%;
    @media only screen and (max-width: 800px) {
      order: 1;
      text-align: center;
    }
    .adres-bolumu {
      @media only screen and (max-width: 800px) {
        width: 25rem;
        margin: 0 auto;
      }
      .adres {
        font-size: 1.7rem;
        color: var(--c-grey);
        margin-bottom: 2rem;
        width: 100%;
      }
    }
    .disp-1 {
      @media only screen and (max-width: 800px) {
        font-size: 6rem;
        font-weight: 500;
        margin-bottom: 0;
      }
    }
    .disp-2 {
      color: var(--c-main);
      margin-top: 5rem;
      @media only screen and (max-width: 800px) {
        font-size: 4rem;
        font-weight: 500;
        margin-top: 0;
      }
    }
    .disp-4 {
      margin-top: 2rem;
      @media only screen and (max-width: 800px) {
        margin-top: 0;
      }
    }
  }

  .right {
    width: 100%;
    align-self: start;
    @media only screen and (max-width: 800px) {
      order: -1;
      padding-inline: 3rem;
    }
    .svg {
      width: 100%;
      height: auto;
    }
  }
}

.ikon-bilgi {
  display: flex;
  align-items: center;
  height: 4rem;
  color: var(--c-main);

  .ikon,
  a .ikon {
    display: flex;
    align-items: center;
    width: 4rem;
    fill: var(--c-main);
    justify-content: flex-start;
  }

  .bilgi {
    font-size: 2rem;
  }

  a {
    display: flex;
    fill: var(--c-main);
    justify-content: flex-start;
  }
}
</style>
