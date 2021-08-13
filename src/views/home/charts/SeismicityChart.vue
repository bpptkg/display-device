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
          <h6>Seismicity</h6>
          <router-link to="/seismic/seismicity">
            <small>See more</small>
          </router-link>
        </div>
      </template>
      <DChart ref="chart" :options="chartOptions" class="chart" />
    </BCard>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { BCard, BLink } from 'bootstrap-vue'

import { SamplingTypes } from '@/constants/seismicity'
import { toUnixMiliSeconds } from '@/utils/series'
import DChart from '@/components/echarts/chart/DChart'
import ErrorMessage from '@/components/error-message'
import {
  baseChartOptions,
  createSeries,
  createXAxis,
  mediaQuery,
  tooltipFormatter,
} from '@/components/echarts/chart-options/seismic/seismicity'
import eventTypes from '@/components/echarts/chart-options/seismic/seismicity/event-types'
import { UPDATE_SEISMICITY } from '@/store/seismic/seismicity/actions'

const NAMESPACE = 'home/charts/seismicity'

export default {
  name: 'SeismicityChart',
  components: {
    BCard,
    BLink,
    DChart,
    ErrorMessage,
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
          ...baseChartOptions(),
          series: createSeries(this.data),
          title: {
            align: 'right',
            left: 'center',
            show: false,
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
            formatter: tooltipFormatter(SamplingTypes.DAY),
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
  async mounted() {
    this.update()
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
.chart {
  height: 700px;
}
</style>
