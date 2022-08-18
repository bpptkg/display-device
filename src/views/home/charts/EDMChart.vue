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
          <h6>EDM Babadan</h6>
          <router-link to="/edm/BAB0">
            <small>See more</small>
          </router-link>
        </div>
      </template>
      <DChart ref="chart" :options="chartOptions" :style="style" />

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

import { createSubplotGrid } from '@/utils/echarts/grid'
import { toUnixMiliSeconds } from '@/utils/series'
import DChart from '@/components/echarts/chart/DChart'
import ErrorMessage from '@/components/error-message'
import {
  baseChartOptions,
  calculateAdaptiveHeight,
  createSeries,
  createXAxis,
  createYAxis,
  CHART_VIEWS,
  tooltipFormatter,
} from '@/components/echarts/chart-options/edm'
import { createDataZoom } from '@/components/echarts/chart-options/common/datazoom'
import { UPDATE_EDM } from '@/store/edm/actions'

import InfoNote from './InfoNote.vue'

const NAMESPACE = 'home/charts/edm'

export default {
  name: 'EDMChart',
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
      reflectors: (state) => state.reflectors,
      error: (state) => state.error,
      period: (state) => state.period,
      startTime: (state) => state.startTime,
      endTime: (state) => state.endTime,
      lastUpdated: (state) => state.lastUpdated,
    }),
    chartOptions() {
      const reflectorLength = this.reflectors.length

      const options = {
        baseOption: {
          ...baseChartOptions,
          dataZoom: createDataZoom(reflectorLength, {
            bottom: 30,
          }),
          grid: createSubplotGrid(
            reflectorLength,
            calculateAdaptiveHeight(reflectorLength),
            { margin: 20, top: 50, right: 20, bottom: 80, left: 60 }
          ),
          title: {
            align: 'right',
            left: 'center',
            show: false,
            text: 'EDM Babadan',
            textStyle: { fontSize: 14, fontWeight: 'normal' },
          },
          series: createSeries(this.data, this.reflectors),
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              lineStyle: {
                type: 'dashed',
              },
            },
            formatter: tooltipFormatter(CHART_VIEWS.slope_distance),
          },
          xAxis: createXAxis(
            reflectorLength,
            toUnixMiliSeconds(this.startTime),
            toUnixMiliSeconds(this.endTime)
          ),
          yAxis: createYAxis(this.reflectors),
        },
        media: [
          {
            query: {
              maxWidth: 575.98,
            },
            option: {
              grid: createSubplotGrid(
                this.reflectors.length,
                calculateAdaptiveHeight(this.reflectors.length),
                { margin: 20, top: 50, right: 20, bottom: 80, left: 80 }
              ),
            },
          },
        ],
      }
      return options
    },
    style() {
      return {
        height: `${calculateAdaptiveHeight(this.reflectors.length)}px`,
      }
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
    }, 1000 * 60 * 30)
  },
  methods: {
    ...mapActions({
      fetchData(dispatch) {
        return dispatch(NAMESPACE + '/' + UPDATE_EDM)
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
