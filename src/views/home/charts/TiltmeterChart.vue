<template>
  <div>
    <BCard v-if="error">
      <ErrorMessage>
        <p>Unable to load data.</p>
        <p>Error: {{ error.message }}</p>
        <p>
          <BLink @click="update"> Try again </BLink>
        </p>
      </ErrorMessage>
    </BCard>
    <BCard v-show="!error">
      <template #header>
        <div class="d-flex justify-content-between">
          <h6>Tiltmeter Borehole Klatakan</h6>
          <router-link to="/tiltmeter/borehole/klatakan">
            <small>See more</small>
          </router-link>
        </div>
      </template>
      <DChart ref="chart" :options="chartOptions" class="chart" />

      <hr />
      <InfoNote
        :start-time="startTime"
        :end-time="endTime"
        :last-updated="lastUpdated"
      ></InfoNote>
    </BCard>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { BCard, BLink } from 'bootstrap-vue'

import { toUnixMiliSeconds } from '@/utils/series'
import { createRowGrid } from '@/utils/echarts/grid'
import DChart from '@/components/echarts/chart/DChart'
import ErrorMessage from '@/components/error-message'
import {
  baseChartOptions,
  createSeries,
  createXAxis,
  createYAxis,
  createDataZoom,
  tooltipFormatter,
} from '@/components/echarts/chart-options/tiltmeter'
import { UPDATE_TILTMETER } from '@/store/tiltmeter/actions'

import InfoNote from './InfoNote.vue'

const NAMESPACE = 'home/charts/tiltmeter'

const mediaQuery = [
  {
    query: {
      maxWidth: 575.98,
    },
    option: {
      grid: createRowGrid(1, { top: 15, bottom: 15, left: 22, right: 22 }),
      title: {
        top: 25,
        textStyle: {
          fontSize: 13,
        },
      },
    },
  },
]

export default {
  name: 'TiltmeterChart',
  components: {
    BCard,
    BLink,
    DChart,
    ErrorMessage,
    InfoNote,
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
      sampling: (state) => state.sampling,
      lastUpdated: (state) => state.lastUpdated,
    }),
    chartOptions() {
      const options = {
        baseOption: {
          ...baseChartOptions,
          dataZoom: createDataZoom({ omitTemperature: true }),
          yAxis: createYAxis({ omitTemperature: true }),
          grid: createRowGrid(1, { top: 10, bottom: 15, left: 10, right: 10 }),
          series: createSeries(this.data, { omitTemperature: true }),
          title: {
            align: 'right',
            left: 'center',
            show: false,
            text: 'Tiltmeter Borehole',
            textStyle: { fontSize: 14, fontWeight: 'normal' },
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              lineStyle: {
                type: 'dashed',
              },
            },
            formatter: tooltipFormatter(this.sampling),
          },
          xAxis: createXAxis(
            toUnixMiliSeconds(this.startTime),
            toUnixMiliSeconds(this.endTime),
            { omitTemperature: true }
          ),
        },
        media: mediaQuery,
      }
      return options
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
    }, 1000 * 60 * 60)
  },
  methods: {
    ...mapActions({
      fetchData(dispatch) {
        return dispatch(NAMESPACE + '/' + UPDATE_TILTMETER)
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
.chart {
  height: 450px;
}
</style>
