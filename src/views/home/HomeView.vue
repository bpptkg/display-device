<template>
  <div class="home-view">
    <h6>Quick Charts</h6>

    <div class="masonry-container">
      <div class="masonry-item">
        <HelicorderChart class="chart-item" />
      </div>
      <div class="masonry-item">
        <SeismicityChart class="chart-item" />
      </div>
      <div class="masonry-item">
        <EDMChart class="chart-item" />
      </div>
      <div class="masonry-item">
        <WeatherPasarbubarChart class="chart-item" />
      </div>
      <div class="masonry-item">
        <RfapDirectionChart class="chart-item" />
      </div>
      <div class="masonry-item">
        <TiltmeterChart class="chart-item" />
      </div>
      <div class="masonry-item">
        <GPSBaselineChart class="chart-item" />
      </div>
      <div class="masonry-item">
        <LavaDomeChart class="chart-item" />
      </div>
    </div>
  </div>
</template>

<script>
import EDMChart from './charts/EDMChart'
import GPSBaselineChart from './charts/GPSBaselineChart'
import HelicorderChart from './charts/HelicorderChart'
import LavaDomeChart from './charts/LavaDomeChart'
import RfapDirectionChart from './charts/RfapDirectionChart'
import SeismicityChart from './charts/SeismicityChart'
import TiltmeterChart from './charts/TiltmeterChart'
import WeatherPasarbubarChart from './charts/WeatherPasarbubarChart'

export default {
  name: 'HomeView',
  components: {
    // BContainer,
    EDMChart,
    GPSBaselineChart,
    HelicorderChart,
    LavaDomeChart,
    RfapDirectionChart,
    SeismicityChart,
    TiltmeterChart,
    WeatherPasarbubarChart,
  },
  mounted() {
    this.$nextTick(() => {
      this.resizeAllGridItems()
      window.addEventListener('resize', this.resizeAllGridItems)
    })
  },
  methods: {
    resizeGridItem(item) {
      const grid = document.getElementsByClassName('masonry-container')[0]
      const rowHeight = parseInt(
        window.getComputedStyle(grid).getPropertyValue('grid-auto-rows')
      )
      const rowGap = parseInt(
        window.getComputedStyle(grid).getPropertyValue('grid-row-gap')
      )
      const rowSpan = Math.ceil(
        (item.querySelector('.chart-item').getBoundingClientRect().height +
          rowGap) /
          (rowHeight + rowGap)
      )
      item.style.gridRowEnd = 'span ' + rowSpan
    },

    resizeAllGridItems() {
      const allItems = document.getElementsByClassName('masonry-item')
      for (let x = 0; x < allItems.length; x++) {
        this.resizeGridItem(allItems[x])
      }
    },

    resizeInstance(instance) {
      const item = instance.elements[0]
      this.resizeGridItem(item)
    },
  },
}
</script>

<style lang="scss" scoped>
.home-view {
  margin-top: 80px;
  padding-left: 15px;
  padding-right: 15px;
}

.masonry-container {
  display: grid;
  grid-gap: 15px;
  grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
  grid-auto-rows: 15px;
}

.masonry-item {
  display: inline-block;
  width: 100%;
}

.masonry-item .chart-item {
  display: block;
  width: 100%;
}

@media (max-width: 575.98px) {
  .masonry-container {
    display: block;
  }

  .masonry-item {
    margin-bottom: 15px;
  }
}
</style>
