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

import { SamplingTypes } from '@/constants/seismicity'
import { toUnixMiliSeconds } from '@/utils/series'
import { createRowGrid } from '@/utils/echarts/grid'
import DChart from '@/components/echarts/chart/DChart'
import ErrorMessage from '@/components/error-message'
import {
  baseChartOptions,
  createSeries,
  createXAxis,
  tooltipFormatter,
} from '@/components/echarts/chart-options/seismic/seismicity'
import eventTypes from '@/components/echarts/chart-options/seismic/seismicity/event-types'
import { UPDATE_SEISMICITY } from '@/store/seismic/seismicity/actions'

const NAMESPACE = 'realtime/seismic/seismicity'

const createYAxisMobile = (names) => {
  return names.map(() => {
    return {
      nameTextStyle: {
        fontSize: 10,
      },
      axisLabel: {
        fontSize: 10,
      },
    }
  })
}

const mediaQuery = [
  {
    query: {
      maxWidth: 575.98,
    },
    option: {
      grid: createRowGrid(eventTypes.length, {
        top: 15,
        bottom: 15,
        left: 15,
        right: 5,
      }),
      title: {
        top: 10,
        textStyle: {
          fontSize: 12,
        },
      },
      yAxis: createYAxisMobile(eventTypes.map((v) => v.type)),
    },
  },
]

export default {
  name: 'SeismicityChart',
  components: {
    BLink,
    DChart,
    ErrorMessage,
  },
  data() {
    return {
      interval: null,
    }
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
            yAxisOptions: { nameTextStyle: { fontSize: 10 } },
          }),
          dataZoom: [],
          grid: createRowGrid(eventTypes.length, { top: 10, bottom: 10 }),
          series: createSeries(this.data),
          title: {
            align: 'right',
            left: 'center',
            show: true,
            text: 'Seismicity',
            textStyle: { fontSize: 14, fontWeight: 'normal' },
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'line',
              lineStyle: {
                type: 'dashed',
              },
            },
            formatter: tooltipFormatter(SamplingTypes.HOUR),
          },
          xAxis: createXAxis(
            eventTypes.length,
            toUnixMiliSeconds(this.startTime),
            toUnixMiliSeconds(this.endTime)
          ),
        },
        media: mediaQuery,
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
        return dispatch(NAMESPACE + '/' + UPDATE_SEISMICITY)
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
