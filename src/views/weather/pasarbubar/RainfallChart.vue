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
      <div class="d-flex justify-content-end">
        <MoreMenu right>
          <BDropdownItem @click="downloadData"> Download Data </BDropdownItem>
        </MoreMenu>
      </div>
      <DChart ref="chart" :options="chartOptions" class="chart" />
    </BCard>
    <DNote>
      &mdash; Rainfall event may be clipped if rainfall duration greater than
      time period selected. Using longer time period is recommended to avoid
      this clipping issue.
    </DNote>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { BCard, BLink, BDropdownItem } from 'bootstrap-vue'
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
import MoreMenu from '@/components/more-menu'
import { createCSVContent, createShortNameFromPeriod } from '@/utils/bulletin'
import { saveAs } from '@/lib/file-saver'
import DNote from '@/components/base/note/DNote'

export default {
  name: 'RainfallChart',
  components: {
    BCard,
    BDropdownItem,
    BLink,
    DChart,
    DNote,
    ErrorMessage,
    MoreMenu,
  },
  computed: {
    ...mapState(NAMESPACE, {
      error: (state) => state.error,
      period: (state) => state.period,
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
    async downloadData() {
      const blob = new Blob([createCSVContent(this.rainfallData)], {
        type: 'text/csv;charset=utf-8',
      })
      saveAs(
        blob,
        `weather-pasarbubar-${createShortNameFromPeriod(this.period)}.csv`
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.chart {
  min-height: 800px !important;
}
</style>
