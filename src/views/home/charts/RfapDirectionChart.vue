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
  },
  computed: {
    ...mapState(NAMESPACE, {
      data: (state) => state.data,
      error: (state) => state.error,
      period: (state) => state.period,
      startTime: (state) => state.startTime,
      endTime: (state) => state.endTime,
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
  async mounted() {
    this.update()
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
