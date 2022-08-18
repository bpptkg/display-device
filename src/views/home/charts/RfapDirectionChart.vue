<template>
  <div>
    <BCard v-if="error">
      <ErrorMessage>
        <p>Unable to load the chart.</p>
        <p>Error: {{ error.message }}</p>
        <p>
          <BLink @click="update">Try again</BLink>
        </p>
      </ErrorMessage>
    </BCard>

    <BCard v-show="!error">
      <template #header>
        <div class="d-flex justify-content-between">
          <h6>RF &amp; AP Direction Group</h6>
          <router-link to="/observation/rfap-direction">
            <small>See more</small>
          </router-link>
        </div>
      </template>
      <DChart ref="chart" class="chart" :options="chartOptions" />

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
import { mapState, mapActions, mapGetters } from 'vuex'
import { BCard, BLink } from 'bootstrap-vue'
import ErrorMessage from '@/components/error-message'
import DChart from '@/components/echarts/chart/DChart'
import { createCircleTemplate } from '@/utils/series'
import { numberFormatterFactory } from '@/utils/formatter-factory'
import {
  baseChartOptions,
  createSeries,
  mediaQuery,
} from '@/components/echarts/chart-options/rfap-direction/rose'
import { UPDATE_DATA } from '@/store/base/actions'

import InfoNote from './InfoNote.vue'

const NAMESPACE = 'home/charts/rfapDirection'

const f = numberFormatterFactory(0)

function tooltipFormatter(params) {
  return `
        ${createCircleTemplate(params.color)} ${params.seriesName}: ${f(
    params.value
  )} m<br />
        `
}

export default {
  name: 'RfapDirectionChart',
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
      lastUpdated: (state) => state.lastUpdated,
    }),

    ...mapGetters(NAMESPACE, ['rfapDirectionGroupDistance']),

    chartOptions() {
      const options = {
        baseOption: {
          ...baseChartOptions({
            title: {
              text: '',
              subtext: '',
            },
            axisLabel: { show: false },
            tooltip: {
              formatter: tooltipFormatter,
            },
          }),
          series: createSeries(this.rfapDirectionGroupDistance),
        },
        media: mediaQuery(),
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
    }, 1000 * 60 * 30)
  },
  methods: {
    ...mapActions({
      fetchData(dispatch) {
        return dispatch(NAMESPACE + '/' + UPDATE_DATA)
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
