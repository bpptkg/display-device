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
      <div class="d-flex justify-content-between">
        <MoreMenu right class="ml-auto">
          <BDropdownItem @click="downloadData"> Download Data </BDropdownItem>
        </MoreMenu>
      </div>
      <DChart ref="chart" :options="chartOptions" class="chart" />
    </BCard>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { BCard, BLink, BDropdownItem } from 'bootstrap-vue'
import ErrorMessage from '@/components/error-message'
import DChart from '@/components/echarts/chart/DChart'
import {
  baseChartOptions,
  createSeries,
  mediaQuery,
} from '@/components/echarts/chart-options/weather-babadan'
import { NAMESPACE } from '@/store/weather/babadan/rainfall'
import { UPDATE_METEOROLOGY } from '@/store/weather/babadan/rainfall/actions'
import { createCSVContent } from '@/utils/bulletin'
import MoreMenu from '@/components/more-menu'

export default {
  name: 'RainfallChart',
  components: {
    BCard,
    BLink,
    BDropdownItem,
    DChart,
    ErrorMessage,
    MoreMenu,
  },
  data() {
    return {
      interval: null,
    }
  },
  computed: {
    ...mapState(NAMESPACE, {
      error: (state) => state.error,
      data: (state) => state.data,
    }),
    chartOptions() {
      const options = {
        baseOption: {
          ...baseChartOptions(),
          series: createSeries(this.data),
        },
        media: mediaQuery,
      }
      return options
    },
  },
  beforeDestroy() {
    if (this.interval !== null) {
      clearInterval(this.interval)
    }
  },
  mounted() {
    this.interval = setInterval(this.update, 60000)
  },
  methods: {
    ...mapActions({
      fetchData(dispatch) {
        return dispatch(NAMESPACE + '/' + UPDATE_METEOROLOGY)
      },
    }),
    update() {
      console.log('Updating Rainfall Chart...')
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
    downloadData() {
      console.log(this.data)
      const csvString = createCSVContent(this.data)
      const doDownloadAsync = async (data, exportFilename) => {
        const blob = new Blob([createCSVContent(this.data)], {
          type: 'text/csv;charset=utf-8',
        })
        if (navigator.msSaveBlob) {
          navigator.msSaveBlob(blob, exportFilename)
        } else {
          const link = document.createElement('a')
          if (link.download !== undefined) {
            const url = URL.createObjectURL(blob)
            link.setAttribute('href', url)
            link.setAttribute('download', exportFilename)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
        }
      }
      doDownloadAsync(this.data, 'Rainfall-Babadan.csv')
    },
  },
}
</script>

<style lang="scss" scoped>
.chart {
  min-height: 800px !important;
}
</style>
