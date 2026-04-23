<template>
  <div class="hero" :class="$attrs.class" :style="{ backgroundImage: `url(${item.picture})` }">
    <div class="overlay"></div>
    <div class="hero-inside">
      <div class="hero-header">
        <h1 class="disp-1">{{ item.title }}</h1>
        <h2 class="disp-3">{{ item.subtitle }}</h2>
        <h3 class="text">{{ item.text }}</h3>
      </div>
      <div class="bosluk"></div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    required: true
  }
})
</script>
<style scoped lang="scss">
$color-grey: var(--c-grey);
$color-white-mute: white;

.abkant,
.laser-cutting,
.home,
.tarihce,
.hakkinda {
  .hero {
    width: 100vw;
    height: 50rem;
    background-repeat: no-repeat;
    background-size: cover;
    display: flex;
    position: relative;
    z-index: 1;
    overflow-x: hidden;

    .overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 2;
    }

    .hero-inside {
      width: 100%;
      margin-inline: auto;
      display: flex;
      align-items: center;
      z-index: 3;

      .hero-header {
        padding-inline: 1.5rem;
      }

      .bosluk {
        width: 50%;
      }
    }
  }
}

.abkant,
.laser-cutting {
  .hero {
    color: $color-grey !important;

    .hero-header {
      @media only screen and (max-width: 800px) {
        .disp-1 {
          font-size: 5rem;
          font-weight: 900;
          color: $color-grey;
          text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.9);
        }
        .disp-3 {
          font-size: 3rem;
          text-shadow: 1px 1px 1px rgba(255, 255, 255, 0.9);
          font-weight: 900;
        }
      }
    }

    .overlay {
      background: linear-gradient(to right, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0) 70%);
    }
  }
}

.laser-cutting {
  .hero {
    background-position: 0% 40%;
    @media only screen and (max-width: 800px) {
      background-position: 100% 40%;
    }
  }
}
.abkant {
  .hero {
    background-position: 75% 80%;
  }
}

.home,
.tarihce,
.hakkinda {
  .hero {
    height: 50rem;
    background-position: 75% 60%;
    color: white;

    .hero-header {
      background-color: rgba(0, 83, 156, 0.7);
      color: $color-white-mute;
      padding-block: 4rem;
      text-align: start;

      .disp-1 {
        text-shadow: none;
        font-size: 6.5rem;
      }

      .disp-3 {
        margin-bottom: 0.5rem;
      }

      .text {
        font-weight: 400;
      }
    }
  }
}
</style>
