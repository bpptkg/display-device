<template>
  <div id="realtimeDeformationView" class="g-container">
    <div class="g-item">
      <div class="c-item">
        <EDMChart />
      </div>
      <div class="t-item">
        <TiltmeterChart />
      </div>
      <div class="c-item">
        <GpsBaselineChart />
      </div>
    </div>
    <div class="g-item">
      <WebobsChart />
    </div>
  </div>
</template>

<script>
import EDMChart from './EDMChart.vue'
import GpsBaselineChart from './GpsBaselineChart.vue'
import TiltmeterChart from './TiltmeterChart.vue'
import WebobsChart from './WebobsChart.vue'

export default {
  name: 'ViewDeformation',
  components: {
    EDMChart,
    GpsBaselineChart,
    TiltmeterChart,
    WebobsChart,
  },
  data() {
    return {
      timer: null,
    }
  },
  beforeDestroy() {
    window.removeEventListener('keyup', this.toggleFullscreen)

    if (this.timer) {
      clearTimeout(this.timer)
    }
  },
  mounted() {
    window.addEventListener('keyup', this.toggleFullscreen)

    this.timer = setTimeout(() => {
      window.location.reload()
    }, 60 * 60 * 1000)
  },
  methods: {
    toggleFullscreen(event) {
      // Listen when user press F letter in the keyboard.
      if (event.keyCode === 70) {
        if (document.fullscreenElement) {
          this.exitFullscreen()
        } else {
          const el = document.getElementById('realtimeDeformationView')
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

.c-item {
  height: 30%;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-collapse: collapse;
}

.t-item {
  height: 40%;
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
    display: block;
  }

  .c-item {
    display: block;
  }

  .t-item {
    display: block;
    min-height: 250px;
  }
}
</style>
