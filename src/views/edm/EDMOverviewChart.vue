<template>
  <div>
    <div v-if="error">
      <ErrorMessage>
        <p>Unable to load the chart.</p>
        <p>Error: {{ error.message }}</p>
        <p>
          <BLink @click="update"> Try again </BLink>
        </p>
      </ErrorMessage>
    </div>
    <div v-show="!error">
      <div
        class="d-flex justify-content-between align-items-center flex-wrap mb-3"
      >
        <div class="d-flex align-items-center flex-wrap">
          <RangeSelector
            ref="range-selector"
            size="sm"
            custom-enabled
            :selected="period"
            :items="rangeSelector"
            :max-custom-duration="maxCustomDuration"
            @period-selected="onPeriodChange"
          />
          <EventAnnotation
            class="ml-2"
            :annotations="annotationOptions"
            @change="handleUpdateAnnotations"
          />
        </div>
        <div class="d-flex align-items-center">
          <MoreMenu right class="ml-2">
            <BDropdownItem @click="downloadData"> Download Data </BDropdownItem>
          </MoreMenu>
        </div>
      </div>
      <DChart
        ref="chart"
        :options="chartOptions"
        :style="style"
        manual-update
      />
    </div>
  </div>
</template>

<script>
import JSZip from 'jszip'
import { mapState, mapActions, mapMutations } from 'vuex'
import { BLink, BDropdownItem } from 'bootstrap-vue'

import { saveAs } from '@/lib/file-saver'
import { toUnixMiliSeconds } from '@/utils/series'
import { createCSVContent, createShortNameFromPeriod } from '@/utils/bulletin'

import EventAnnotation from '@/components/event-annotation'
import rangeSelectorMixin from '@/components/mixins/range-selector'
import ErrorMessage from '@/components/error-message'
import RangeSelector from '@/components/range-selector'
import DChart from '@/components/echarts/chart/DChart'
import MoreMenu from '@/components/more-menu'
import {
  baseChartOptions,
  createSeries,
  createXAxis,
  createYAxis,
  mediaQuery,
} from '@/components/echarts/chart-options/edm/overview'

import rangeSelector, {
  maxCustomDuration,
} from '@/store/edm/overview/range-selector'
import { UPDATE_EDM } from '@/store/edm/overview/actions'
import {
  SET_PERIOD,
  SET_START_TIME,
  SET_END_TIME,
  SET_ANNOTATION_OPTIONS,
} from '@/store/base/mutations'
import { UPDATE_ANNOTATIONS } from '@/store/base/actions'

export default {
  name: 'EDMOverviewChart',
  components: {
    BDropdownItem,
    BLink,
    DChart,
    ErrorMessage,
    EventAnnotation,
    MoreMenu,
    RangeSelector,
  },
  mixins: [rangeSelectorMixin],
  data() {
    return {
      interval: null,
      maxCustomDuration,
      rangeSelector,
    }
  },
  computed: {
    ...mapState({
      data: (state) => state.edm.overview.data,
      period: (state) => state.edm.overview.period,
      error: (state) => state.edm.overview.error,
      startTime: (state) => state.edm.overview.startTime,
      endTime: (state) => state.edm.overview.endTime,
      annotationOptions: (state) => state.edm.overview.annotationOptions,
      edmOptions: (state) => state.edm.overview.edmOptions,
    }),
    namespace() {
      return 'edm/overview'
    },
    chartOptions() {
      return {
        baseOption: {
          ...baseChartOptions(),
          series: createSeries(this.data),
          xAxis: createXAxis(
            toUnixMiliSeconds(this.startTime),
            toUnixMiliSeconds(this.endTime)
          ),
          yAxis: createYAxis(),
        },
        media: mediaQuery,
      }
    },
    style() {
      return {
        height: `${this.edmOptions.length * 120}px`,
      }
    },
  },
  beforeDestroy() {
    if (this.interval !== null) {
      clearInterval(this.interval)
    }
  },
  mounted() {
    this.update()
    this.interval = setInterval(this.update, 600000)
  },
  methods: {
    ...mapMutations({
      setPeriod(commit, period) {
        return commit(this.namespace + '/' + SET_PERIOD, period)
      },
      setStartTime(commit, value) {
        return commit(this.namespace + '/' + SET_START_TIME, value)
      },
      setEndTime(commit, value) {
        return commit(this.namespace + '/' + SET_END_TIME, value)
      },
      setAnnotationOptions(commit, options) {
        return commit(this.namespace + '/' + SET_ANNOTATION_OPTIONS, options)
      },
    }),
    ...mapActions({
      fetchData(dispatch) {
        return dispatch(this.namespace + '/' + UPDATE_EDM)
      },
      updateAnnotations(dispatch) {
        return dispatch(this.namespace + '/' + UPDATE_ANNOTATIONS)
      },
    }),
    update() {
      const chart = this.$refs.chart.$refs.chart
      chart.clear()
      chart.showLoading()
      Promise.all([this.fetchData(), this.updateAnnotations()]).finally(() => {
        chart.hideLoading()
        if (this.showRegressionLine) {
          chart.mergeOptions(this.chartOptionsWithRegression)
        } else {
          chart.mergeOptions(this.chartOptions)
        }
      })
    },
    handleUpdateAnnotations(options) {
      const chart = this.$refs.chart.$refs.chart
      chart.clear()
      chart.showLoading()

      this.setAnnotationOptions(options)
      this.updateAnnotations().finally(() => {
        chart.hideLoading()
        if (this.showRegressionLine) {
          chart.mergeOptions(this.chartOptionsWithRegression)
        } else {
          chart.mergeOptions(this.chartOptions)
        }
      })
    },
    async downloadData() {
      const zip = new JSZip()
      this.data.forEach((array, index) => {
        const edm = this.edmOptions[index]
        const fileName = `${edm.benchmark}-${edm.reflector}`
        zip.file(`${fileName}.csv`, createCSVContent(array))
      })

      zip.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(content, `EDM-${createShortNameFromPeriod(this.period)}.zip`)
      })
    },
  },
}
</script>
