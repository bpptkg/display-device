<template>
  <div class="chart-container">
    <ErrorMessage v-if="error">
      <p>Unable to load data.</p>
      <p>Error: {{ error.message }}</p>
      <p>We will refresh the chart automatically when network available.</p>
      <p>
        <BLink @click="update"> Try again </BLink>
      </p>
    </ErrorMessage>
    <DChart v-show="!error" ref="chart" :options="chartOptions" class="chart" />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { BLink } from 'bootstrap-vue'

import { toUnixMiliSeconds } from '@/utils/series'
import DChart from '@/components/echarts/chart/DChart'
import ErrorMessage from '@/components/error-message'

import {
  baseChartOptions,
  createSeries,
  createXAxis,
  mediaQuery,
} from '@/components/echarts/chart-options/seismic/equivalent-energy'

import { SamplingTypes } from '@/store/seismic/equivalent-energy'
import { UPDATE_ENERGY } from '@/store/seismic/equivalent-energy/actions'

import { patchRfapEnergyGrid } from './patch'

const NAMESPACE = 'realtime/seismic/rfapEnergy'

export default {
  name: 'RfapEnergyChart',
  components: {
    BLink,
    DChart,
    ErrorMessage,
  },
  data() {
    return { interval: null }
  },
  computed: {
    ...mapState(NAMESPACE, {
      data: (state) => state.data,
      error: (state) => state.error,
      period: (state) => state.period,
      startTime: (state) => state.startTime,
      endTime: (state) => state.endTime,
    }),

    chartOptions() {
      const options = {
        baseOption: {
          ...baseChartOptions({
            sampling: SamplingTypes.HOUR,
          }),
          dataZoom: [],
          series: createSeries(this.data),
          xAxis: createXAxis(
            toUnixMiliSeconds(this.startTime),
            toUnixMiliSeconds(this.endTime)
          ),
        },
        media: mediaQuery(),
      }

      return patchRfapEnergyGrid(options)
    },
  },
  beforeDestroy() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  },
  async mounted() {
    this.update()
    this.interval = setInterval(() => {
      this.update()
    }, 30 * 1000)
  },
  methods: {
    ...mapActions({
      fetchData(dispatch) {
        return dispatch(NAMESPACE + '/' + UPDATE_ENERGY)
      },
    }),
    update() {
      const chart = this.$refs.chart.$refs.chart
      chart.clear()
      chart.showLoading()
      this.fetchData().finally(() => {
        chart.hideLoading()
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.chart-container {
  padding: 10px;
  height: 100%;
  width: 100%;
}

.chart {
  height: 100%;
  width: 100%;
  min-height: 200px;
}
</style>
