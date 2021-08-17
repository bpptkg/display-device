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
      <DChart ref="chart" :options="chartOptions" class="chart" />
    </BCard>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { BCard, BLink } from 'bootstrap-vue'
import ErrorMessage from '@/components/error-message'
import DChart from '@/components/echarts/chart/DChart'
import {
  baseChartOptions,
  createSeries,
  mediaQuery,
  createTooltip,
} from '@/components/echarts/chart-options/weather-pasarbubar'
import { NAMESPACE } from '@/store/weather/pasarbubar/rainfall'
import { UPDATE_METEOROLOGY } from '@/store/weather/pasarbubar/rainfall/actions'

export default {
  name: 'RainfallChart',
  components: {
    BCard,
    BLink,
    DChart,
    ErrorMessage,
  },
  computed: {
    ...mapState(NAMESPACE, {
      error: (state) => state.error,
    }),
    ...mapGetters(NAMESPACE, ['rainfallData', 'rainfallEvents']),
    chartOptions() {
      const options = {
        baseOption: {
          ...baseChartOptions(),
          series: createSeries(this.rainfallData, this.rainfallEvents),
          tooltip: createTooltip(this.rainfallEvents),
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

<style lang="scss" scoped>
.chart {
  min-height: 800px !important;
}
</style>
