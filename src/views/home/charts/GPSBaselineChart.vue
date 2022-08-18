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
          <h6>GPS Baseline Pasarbubar</h6>
          <router-link to="/gps/baseline/pasarbubar">
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
  createDataZoom,
  createSeries,
  createXAxis,
  createYAxis,
} from '@/components/echarts/chart-options/gps/baseline'
import { UPDATE_GPS_BASELINE } from '@/store/gps/baseline/actions'

import InfoNote from './InfoNote.vue'

const NAMESPACE = 'home/charts/gps'

export default {
  name: 'GPSBaselineChart',
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
      references: (state) => state.references,
      error: (state) => state.error,
      period: (state) => state.period,
      startTime: (state) => state.startTime,
      endTime: (state) => state.endTime,
      lastUpdated: (state) => state.lastUpdated,
    }),
    chartOptions() {
      const options = {
        baseOption: {
          ...baseChartOptions,
          dataZoom: createDataZoom(this.references.length),
          grid: createRowGrid(this.references.length, { bottom: 8, left: 13 }),
          series: createSeries(this.data, this.references),
          title: {
            align: 'right',
            left: 'center',
            show: false,
            text: 'GPS Baseline Pasarbubar',
            textStyle: { fontSize: 14, fontWeight: 'normal' },
          },
          xAxis: createXAxis(
            this.references.length,
            toUnixMiliSeconds(this.startTime),
            toUnixMiliSeconds(this.endTime)
          ),
          yAxis: createYAxis(this.references),
        },
        media: [
          {
            query: {
              maxWidth: 575.98,
            },
            option: {
              grid: createRowGrid(this.references.length, {
                left: 22,
                top: 5,
                bottom: 8,
              }),
              title: {
                top: 25,
                textStyle: {
                  fontSize: 12,
                },
              },
            },
          },
        ],
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
        return dispatch(NAMESPACE + '/' + UPDATE_GPS_BASELINE)
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
  height: 800px;
}
</style>
