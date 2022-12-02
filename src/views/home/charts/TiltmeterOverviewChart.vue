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
          <h6>Tiltmeter</h6>
          <router-link to="/tiltmeter-overview">
            <small>See more</small>
          </router-link>
        </div>
      </template>
      <DChart
        ref="chart"
        :options="chartOptions"
        class="chart"
        :style="style"
      />

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
import moment from 'moment'

import { mapState, mapActions } from 'vuex'
import { BCard, BLink } from 'bootstrap-vue'

import { DATE_FORMAT } from '@/constants/date'
import { SamplingTypes } from '@/constants/tiltmeter'
import { toUnixMiliSeconds } from '@/utils/series'

import DChart from '@/components/echarts/chart/DChart'
import ErrorMessage from '@/components/error-message'
import {
  baseChartOptions,
  createSeries,
  createXAxis,
  //   mediaQuery,
} from '@/components/echarts/chart-options/tiltmeter/overview'
import { tooltipFormatter } from '@/components/echarts/chart-options/tiltmeter'
import { createRowGrid } from '@/utils/echarts/grid'

import { UPDATE_TILTMETER } from '@/store/tiltmeter/overview/actions'

import InfoNote from './InfoNote.vue'

const NAMESPACE = 'home/charts/tiltmeterOverview'

const mediaQuery = (tiltOptions) => {
  return [
    {
      query: {
        maxWidth: 575.98,
      },
      option: {
        grid: createRowGrid(tiltOptions.length, {
          top: 10,
          bottom: 14,
          left: 15,
          right: 15,
        }),
        title: {
          top: 15,
          textStyle: {
            fontSize: 13,
          },
        },
      },
    },
  ]
}

export default {
  name: 'TiltmeterOverviewChart',
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
      annotationOptions: (state) => state.annotationOptions,
      annotations: (state) => state.annotations,
      tiltOptions: (state) => state.tiltOptions,
      datasampling: (state) => state.sampling,
      lastUpdated: (state) => state.lastUpdated,
    }),
    chartOptions() {
      const options = {
        baseOption: {
          ...baseChartOptions(this.tiltOptions),
          series: createSeries(this.data, this.tiltOptions, {
            annotations: this.annotations,
          }),
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
            toUnixMiliSeconds(
              this.sampling === SamplingTypes.DAY
                ? moment(this.startTime.format(DATE_FORMAT))
                : this.startTime
            ),
            toUnixMiliSeconds(this.endTime),
            this.tiltOptions
          ),
        },
        media: mediaQuery(this.tiltOptions),
      }
      return options
    },
    style() {
      return {
        height: `${this.tiltOptions.length * 130}px`,
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
