<template>
  <div class="g-container">
    <div class="g-item">
      <div class="c-item">
        <SeismicityChart />
      </div>
      <div class="c-item">
        <HypocenterChart
          :magnitude-visual-map-options="{
            right: 50,
            bottom: 50,
            left: undefined,
          }"
          :time-colormap-options="{
            left: 50,
          }"
        />
      </div>
    </div>
    <div class="g-item">
      <div class="c-item">
        <SeismicEnergyChart />
      </div>
      <div class="c-item">
        <RfapEnergyChart />
      </div>
    </div>
  </div>
</template>

<script>
import SeismicityChart from './SeismicityChart'
import SeismicEnergyChart from './SeismicEnergyChart'
import HypocenterChart from './HypocenterChart'
import RfapEnergyChart from './RfapEnergyChart'

export default {
  name: 'ViewSeismic2',
  components: {
    SeismicityChart,
    SeismicEnergyChart,
    HypocenterChart,
    RfapEnergyChart,
  },
  data() {
    return {
      timer: null,
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearTimeout(this.timer)
    }
  },
  mounted() {
    // Set timer for reload the page after 1 hour. It helps use to update the
    // app or refresh if any error occurred.
    this.timer = setTimeout(() => {
      window.location.reload()
    }, 60 * 60 * 1000)
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
    display: block;
    height: 600px;
  }

  .c-item {
    display: block;
    height: 50%;
  }
}
</style>
