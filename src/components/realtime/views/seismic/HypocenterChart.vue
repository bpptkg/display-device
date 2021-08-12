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
    <DGLChart
      v-show="!error"
      ref="chart"
      class="chart"
      :options="chartOptions"
      manual-update
    />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { BLink } from 'bootstrap-vue'

import { toUnixMiliSeconds } from '@/utils/series'
import DGLChart from '@/components/echarts/chart/DGLChart'
import ErrorMessage from '@/components/error-message'
import {
  baseChartOptions,
  createSeries,
  createVisualMap,
} from '@/components/echarts/chart-options/hypocenter'
import { UPDATE_HYPO, FETCH_TOPO } from '@/store/seismic/hypocenter/actions'

const NAMESPACE = 'realtime/seismic/hypocenter'

export default {
  name: 'HypocenterChart',
  components: {
    BLink,
    DGLChart,
    ErrorMessage,
  },
  data() {
    return {
      interval: null,
    }
  },
  computed: {
    ...mapState(NAMESPACE, {
      topo: (state) => state.topo,
      settings: (state) => state.settings,
      data: (state) => state.data,
      error: (state) => state.error,
      period: (state) => state.period,
      startTime: (state) => state.startTime,
      endTime: (state) => state.endTime,
    }),
    ...mapGetters(NAMESPACE, ['btbbEvents']),
    chartOptions() {
      const options = {
        ...baseChartOptions(this.settings),
        series: createSeries(this.topo, this.btbbEvents, this.settings),
      }

      if (this.data.length) {
        const visualMap = createVisualMap({
          ...this.settings,
          timeMin: toUnixMiliSeconds(this.startTime),
          timeMax: toUnixMiliSeconds(this.endTime),
        })
        options.visualMap = visualMap
      }
      return options
    },
  },
  beforeDestroy() {
    clearInterval(this.interval)
  },
  async mounted() {
    this.init()
    this.interval = setInterval(() => {
      this.update()
    }, 30 * 1000)
  },
  methods: {
    ...mapActions({
      fetchData(dispatch) {
        return dispatch(NAMESPACE + '/' + UPDATE_HYPO)
      },
    }),
    init() {
      const chart = this.$refs.chart.$refs.chart
      chart.clear()
      chart.showLoading()

      Promise.all([
        this.$store.dispatch(NAMESPACE + '/' + FETCH_TOPO),
        this.$store.dispatch(NAMESPACE + '/' + UPDATE_HYPO),
      ]).finally(() => {
        chart.hideLoading()
        chart.mergeOptions(this.chartOptions)
      })
    },
    update() {
      const chart = this.$refs.chart.$refs.chart
      chart.clear()
      chart.showLoading()
      this.fetchData().finally(() => {
        chart.hideLoading()
        chart.mergeOptions(this.chartOptions)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.chart-container {
  height: 100%;
  width: 100%;
}

.chart {
  height: 100%;
  width: 100%;
  min-height: 200px;
}
</style>
