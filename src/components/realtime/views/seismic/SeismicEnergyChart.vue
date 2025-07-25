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
import { EnergyTypes } from '@/constants/energy'
import {
  baseChartOptions,
  createLegend,
  createSeries,
  createXAxis,
  createYAxis,
  mediaQuery,
} from '@/components/echarts/chart-options/seismic/energy'
import { UPDATE_ENERGY } from '@/store/seismic/energy/actions'

const NAMESPACE = 'realtime/seismic/energy'

const createGrid = () => {
  return {
    left: 80,
    right: 190,
    bottom: 70,
  }
}

export default {
  name: 'SeismicEnergyChart',
  components: {
    BLink,
    DChart,
    ErrorMessage,
  },
  data() {
    return { type: EnergyTypes.TOTAL, interval: null }
  },
  computed: {
    ...mapState(NAMESPACE, {
      data: (state) => state.data,
      error: (state) => state.error,
      period: (state) => state.period,
      sampling: (state) => state.sampling,
      startTime: (state) => state.startTime,
      endTime: (state) => state.endTime,
    }),
    chartOptions() {
      const options = {
        baseOption: {
          ...baseChartOptions(this.sampling),
          dataZoom: [],
          grid: createGrid(),
          legend:
            this.type === EnergyTypes.TOTAL ? createLegend() : { show: false },
          xAxis: createXAxis(
            toUnixMiliSeconds(this.startTime),
            toUnixMiliSeconds(this.endTime)
          ),
          yAxis: createYAxis(this.type),
          series: createSeries(this.data, this.type),
          title: {
            text: 'Hourly Total Seismic Energy',
            left: 'center',
            align: 'right',
            textStyle: {
              fontSize: 14,
              fontWeight: 'normal',
            },
          },
        },
        media: mediaQuery(this.type),
      }

      return options
    },
  },
  beforeDestroy() {
    clearInterval(this.interval)
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
