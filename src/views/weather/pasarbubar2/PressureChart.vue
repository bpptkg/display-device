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

    <BCard v-show="!error" title-tag="h5">
      <DChart ref="chart" :options="chartOptions" />
    </BCard>
  </div>
</template>

<script>
import {
  baseChartOptions,
  createSeries,
  mediaQuery,
} from '@/components/echarts/chart-options/weather-pasarbubar2/pressure'
import DChart from '@/components/echarts/chart/DChart'
import ErrorMessage from '@/components/error-message'
import { NAMESPACE } from '@/store/weather/pasarbubar2/rainfall'
import { UPDATE_METEOROLOGY } from '@/store/weather/pasarbubar2/rainfall/actions'
import { createPeriodText } from '@/utils/datetime'
import { BCard, BLink } from 'bootstrap-vue'
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  name: 'PressureChart',
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
      startTime: (state) => state.startTime,
      endTime: (state) => state.endTime,
    }),
    ...mapGetters(NAMESPACE, ['rainfallData']),
    chartOptions() {
      const options = {
        baseOption: {
          ...baseChartOptions({
            title: { subtext: createPeriodText(this.startTime, this.endTime) },
          }),
          series: createSeries(this.rainfallData),
        },
        media: mediaQuery,
      }
      return options
    },
  },
  methods: {
    ...mapActions({
      fetchData(dispatch) {
        return dispatch(NAMESPACE + '/' + UPDATE_METEOROLOGY)
      },
    }),
    update() {
      this.showLoading()
      this.fetchData().finally(() => {
        this.hideLoading()
      })
    },
    delegateMethod(name, ...args) {
      const chart = this.$refs.chart.$refs.chart
      return chart[name](...args)
    },
    showLoading(type, options) {
      this.delegateMethod('showLoading', type, options)
    },
    hideLoading() {
      this.delegateMethod('hideLoading')
    },
    clear() {
      this.delegateMethod('clear')
    },
  },
}
</script>
