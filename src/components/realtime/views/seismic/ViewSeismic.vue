<template>
  <div id="realtimeSeismicView" class="g-container">
    <div class="g-item g-item-s">
      <div class="c-item">
        <SeismicityChart />
      </div>
      <div class="c-item">
        <SeismicEnergyChart />
      </div>
    </div>
    <div class="g-item">
      <HypocenterChart />
    </div>
  </div>
</template>

<script>
import SeismicityChart from './SeismicityChart'
import SeismicEnergyChart from './SeismicEnergyChart'
import HypocenterChart from './HypocenterChart'

export default {
  name: 'ViewSeismic',
  components: {
    SeismicityChart,
    SeismicEnergyChart,
    HypocenterChart,
  },
  beforeDestroy() {
    window.removeEventListener('keyup', this.toggleFullscreen)
  },
  mounted() {
    window.addEventListener('keyup', this.toggleFullscreen)
  },
  methods: {
    toggleFullscreen(event) {
      // Listen when user press F letter in the keyboard.
      if (event.keyCode === 70) {
        if (document.fullscreenElement) {
          this.exitFullscreen()
        } else {
          const el = document.getElementById('realtimeSeismicView')
          if (el.requestFullscreen) {
            el.requestFullscreen()
          } else if (el.mozRequestFullScreen) {
            el.mozRequestFullScreen()
          } else if (el.webkitRequestFullscreen) {
            el.webkitRequestFullscreen()
          } else if (el.msRequestFullscreen) {
            el.msRequestFullscreen()
          }
        }
      }
    },
    exitFullscreen() {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen()
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen()
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.g-container {
  background-color: #fff;
  bottom: 0;
  display: flex;
  position: absolute;
  top: 50px;
  width: 100%;
}

.c-container {
  display: flex;
  flex-direction: column;
}

.c-item {
  height: 50%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-collapse: collapse;
}

.g-item {
  flex: 50%;
}

@media (max-width: 991.98px) {
  .g-container {
    display: block;
  }

  .g-item {
    display: flex;
    height: 50%;
  }

  .c-item {
    flex: 50%;
    height: 100%;
  }
}

@media (max-width: 767.98px) {
  .g-container {
    display: block;
  }

  .g-item {
    display: block;
    height: 33.33%;
  }

  .g-item-s {
    height: 66.66%;
  }

  .c-item {
    display: block;
    height: 50%;
  }
}
</style>
