<template>
  <BContainer fluid="xl" class="content">
    <h6>Quick Chart</h6>

    <BRow>
      <BCol md="6">
        <div class="mb-3">
          <SeismicityChart />
        </div>
        <div class="mb-3">
          <EDMChart />
        </div>
        <div class="mb-3">
          <WeatherPasarbubarChart />
        </div>
      </BCol>
      <BCol md="6">
        <div class="mb-3">
          <GPSBaselineChart />
        </div>
        <div class="mb-3">
          <TiltmeterChart />
        </div>
        <div class="mb-3">
          <LavaDomeChart />
        </div>
      </BCol>
    </BRow>
  </BContainer>
</template>

<script>
import { BContainer, BCol, BRow } from 'bootstrap-vue'

import EDMChart from './charts/EDMChart'
import GPSBaselineChart from './charts/GPSBaselineChart'
import LavaDomeChart from './charts/LavaDomeChart'
import SeismicityChart from './charts/SeismicityChart'
import TiltmeterChart from './charts/TiltmeterChart'
import WeatherPasarbubarChart from './charts/WeatherPasarbubarChart'

export default {
  name: 'HomeView',
  components: {
    BCol,
    BContainer,
    BRow,
    EDMChart,
    GPSBaselineChart,
    LavaDomeChart,
    SeismicityChart,
    TiltmeterChart,
    WeatherPasarbubarChart,
  },
}
</script>

<style lang="scss" scoped>
.content {
  margin-top: 80px;
}
</style>
