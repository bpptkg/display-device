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
          <BDropdown
            v-b-tooltip.hover
            title="Chart Options"
            text="Chart"
            class="ml-2 edm-chart-btn"
            size="sm"
          >
            <BDropdownItem
              :active="chartView === CHART_VIEWS.slope_distance"
              @click="showChartSlopeDistance"
            >
              Slope Distance
            </BDropdownItem>
            <BDropdownItem
              :active="chartView === CHART_VIEWS.slope_distance_and_rate"
              @click="showChartSlopeDistanceAndRate"
            >
              Slope Distance and Rate
            </BDropdownItem>
            <BDropdownItem
              :active="chartView === CHART_VIEWS.csd_and_rate"
              @click="showChartCsdAndRate"
            >
              CSD and Rate
            </BDropdownItem>
          </BDropdown>
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
        :options="flexibleChartOptions"
        :style="style"
        manual-update
      />
      <BTabs v-show="isVectorSupported" class="mt-4" no-fade>
        <BTab
          v-for="reflector in reflectors"
          :key="reflector"
          :title="reflector"
        >
          <DChart
            :ref="reflector"
            class="mt-4"
            :options="createCoordChartOptions(reflector)"
            :style="style"
          />
        </BTab>
      </BTabs>
    </div>

    <DNote v-if="chartView !== CHART_VIEWS.slope_distance" class="mt-3">
      &mdash; EDM slope distance rate is calculated using moving linear
      least-squares regression with 3 data samples per window. <br />
      &mdash; CSD stands for Change of Slope Distance (CSD).
    </DNote>
  </div>
</template>

<script>
import JSZip from 'jszip'
import { mapState, mapActions, mapMutations } from 'vuex'
import {
  BLink,
  BDropdown,
  BDropdownItem,
  BTabs,
  BTab,
  VBTooltip,
} from 'bootstrap-vue'

import { saveAs } from '@/lib/file-saver'
import { toUnixMiliSeconds, getSeriesByIndex } from '@/utils/series'
import { createSubplotGrid } from '@/utils/echarts/grid'
import { createCSVContent, createShortNameFromPeriod } from '@/utils/bulletin'

import EventAnnotation from '@/components/event-annotation'
import rangeSelectorMixin from '@/components/mixins/range-selector'
import ErrorMessage from '@/components/error-message'
import RangeSelector from '@/components/range-selector'
import DChart from '@/components/echarts/chart/DChart'
import MoreMenu from '@/components/more-menu'
import DNote from '@/components/base/note/DNote'
import {
  baseChartOptions,
  calculateAdaptiveHeight,
  createSeries,
  createRegressionSeries,
  createXAxis,
  createYAxis,
  CHART_VIEWS,
  tooltipFormatter,
} from '@/components/echarts/chart-options/edm'
import {
  baseChartOptions as coordBaseChartOptions,
  createSeries as coordCreateSeries,
  createXAxis as coordCreateXAxis,
  mediaQuery as coordMediaQuery,
} from '@/components/echarts/chart-options/edm/coordinate'
import { getLinearRegressionInfo } from '@/components/echarts/chart-options/edm/utils'
import { createDataZoom } from '@/components/echarts/chart-options/common/datazoom'

import benchmarkOptions from '@/store/edm/benchmark-options'
import rangeSelector, { maxCustomDuration } from '@/store/edm/range-selector'
import { UPDATE_EDM } from '@/store/edm/actions'
import {
  SET_PERIOD,
  SET_START_TIME,
  SET_END_TIME,
  SET_ANNOTATION_OPTIONS,
} from '@/store/base/mutations'
import { UPDATE_ANNOTATIONS } from '@/store/base/actions'
import { SET_CHART_VIEW } from '@/store/edm/mutations'

export default {
  name: 'EDMBenchmarkChart',
  components: {
    BDropdown,
    BDropdownItem,
    BLink,
    BTab,
    BTabs,
    DChart,
    DNote,
    ErrorMessage,
    EventAnnotation,
    MoreMenu,
    RangeSelector,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  mixins: [rangeSelectorMixin],
  props: {
    benchmark: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      interval: null,
      maxCustomDuration,
      rangeSelector,
      CHART_VIEWS,
    }
  },
  computed: {
    ...mapState({
      data(state) {
        return state.edm[this.benchmark].data
      },
      reflectors(state) {
        return state.edm[this.benchmark].reflectors
      },
      period(state) {
        return state.edm[this.benchmark].period
      },
      error(state) {
        return state.edm[this.benchmark].error
      },
      startTime(state) {
        return state.edm[this.benchmark].startTime
      },
      endTime(state) {
        return state.edm[this.benchmark].endTime
      },
      showRegressionLine(state) {
        return state.edm[this.benchmark].showRegressionLine
      },
      annotationOptions(state) {
        return state.edm[this.benchmark].annotationOptions
      },
      annotations(state) {
        return state.edm[this.benchmark].annotations
      },
      chartView(state) {
        return state.edm[this.benchmark].chartView
      },
    }),

    namespace() {
      return `edm/${this.benchmark}`
    },

    chartTitle() {
      return benchmarkOptions.find((v) => v.value === this.benchmark).chartTitle
    },

    coordChartTitle() {
      return benchmarkOptions.find((v) => v.value === this.benchmark)
        .coordChartTitle
    },

    isVectorSupported() {
      return benchmarkOptions.find((v) => v.value === this.benchmark)
        .isVectorSupported
    },

    chartOptions() {
      const reflectorLength = this.reflectors.length

      const options = {
        baseOption: {
          ...baseChartOptions,
          dataZoom: createDataZoom(reflectorLength, {
            bottom: 30,
          }),
          grid: createSubplotGrid(
            reflectorLength,
            calculateAdaptiveHeight(reflectorLength),
            {
              margin: 20,
              top: 55,
              right: this.chartView === CHART_VIEWS.slope_distance ? 20 : 65,
              bottom: 80,
              left: 65,
            }
          ),
          title: {
            text: this.chartTitle,
            left: 'center',
            align: 'right',
            textStyle: {
              fontSize: 16,
              fontWeight: 'bold',
            },
            subtextStyle: {
              color: '#363636',
            },
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              lineStyle: {
                type: 'dashed',
              },
            },
            formatter: tooltipFormatter(this.chartView),
          },
          series: createSeries(this.data, this.reflectors, {
            annotations: this.annotations,
            chartView: this.chartView,
          }),
          xAxis: createXAxis(
            reflectorLength,
            toUnixMiliSeconds(this.startTime),
            toUnixMiliSeconds(this.endTime)
          ),
          yAxis: createYAxis(this.reflectors, { chartView: this.chartView }),
        },
        media: [
          {
            query: {
              maxWidth: 575.98,
            },
            option: {
              grid: createSubplotGrid(
                reflectorLength,
                calculateAdaptiveHeight(reflectorLength),
                {
                  margin: 20,
                  top: 75,
                  right:
                    this.chartView === CHART_VIEWS.slope_distance ? 20 : 55,
                  bottom: 80,
                  left: 60,
                }
              ),
              title: {
                top: 25,
              },
            },
          },
        ],
      }
      return options
    },

    chartOptionsWithRegression() {
      const info = getLinearRegressionInfo(this.data, this.reflectors)
      const options = {
        ...this.chartOptions,
        baseOption: {
          ...this.chartOptions.baseOption,
          series: [
            ...this.chartOptions.baseOption.series,
            ...createRegressionSeries(info, { chartView: this.chartView }),
          ],
        },
      }
      return options
    },

    flexibleChartOptions() {
      if (this.chartView === CHART_VIEWS.slope_distance) {
        return this.showRegressionLine
          ? this.chartOptionsWithRegression
          : this.chartOptions
      } else {
        return this.chartOptions
      }
    },

    style() {
      return {
        height: `${calculateAdaptiveHeight(this.reflectors.length)}px`,
      }
    },
  },
  watch: {
    showRegressionLine(show) {
      this.updateChartWithRegression(show)
    },
  },
  beforeDestroy() {
    if (this.interval !== null) {
      clearInterval(this.interval)
    }
  },
  mounted() {
    this.update()
    this.interval = setInterval(this.update, 180000)
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
      setChartView(commit, value) {
        return commit(this.namespace + '/' + SET_CHART_VIEW, value)
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
        if (this.chartView === CHART_VIEWS.slope_distance) {
          if (this.showRegressionLine) {
            chart.mergeOptions(this.chartOptionsWithRegression)
          } else {
            chart.mergeOptions(this.chartOptions)
          }
        } else {
          chart.mergeOptions(this.chartOptions)
        }
      })
    },

    updateChartWithRegression(value) {
      if (this.chartView === CHART_VIEWS.slope_distance) {
        const chart = this.$refs.chart.$refs.chart
        chart.clear()
        if (value) {
          chart.mergeOptions(this.chartOptionsWithRegression)
        } else {
          chart.mergeOptions(this.chartOptions)
        }
      }
    },

    handleUpdateAnnotations(options) {
      const chart = this.$refs.chart.$refs.chart
      chart.clear()
      chart.showLoading()

      this.setAnnotationOptions(options)
      this.updateAnnotations().finally(() => {
        chart.hideLoading()
        if (this.chartView === CHART_VIEWS.slope_distance) {
          if (this.showRegressionLine) {
            chart.mergeOptions(this.chartOptionsWithRegression)
          } else {
            chart.mergeOptions(this.chartOptions)
          }
        } else {
          chart.mergeOptions(this.chartOptions)
        }
      })
    },

    async downloadData() {
      const zip = new JSZip()
      this.data.forEach((array, index) => {
        zip.file(`${this.reflectors[index]}.csv`, createCSVContent(array))
      })

      zip.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(
          content,
          `EDM-${this.benchmark}-${createShortNameFromPeriod(this.period)}.zip`
        )
      })
    },

    createCoordChartOptions(reflector) {
      const refIndex = this.reflectors.findIndex((v) => v === reflector)
      const options = {
        baseOption: {
          ...coordBaseChartOptions,
          title: {
            text: `EDM Coordinate ${reflector}`,
            left: 'center',
            align: 'right',
            textStyle: {
              fontSize: 16,
              fontWeight: 'bold',
            },
            subtextStyle: {
              color: '#363636',
            },
          },
          series: coordCreateSeries(getSeriesByIndex(this.data, refIndex), {
            annotations: this.annotations,
          }),
          xAxis: coordCreateXAxis(
            toUnixMiliSeconds(this.startTime),
            toUnixMiliSeconds(this.endTime)
          ),
        },
        media: coordMediaQuery,
      }
      return options
    },

    refreshChart() {
      const chart = this.$refs.chart.$refs.chart
      chart.clear()
      switch (this.chartView) {
        case CHART_VIEWS.slope_distance:
          if (this.showRegressionLine) {
            chart.mergeOptions(this.chartOptionsWithRegression)
          } else {
            chart.mergeOptions(this.chartOptions)
          }
          break
        case CHART_VIEWS.slope_distance_and_rate:
        case CHART_VIEWS.csd_and_rate:
          chart.mergeOptions(this.chartOptions)
          break
      }
    },

    showChartSlopeDistance() {
      this.setChartView(CHART_VIEWS.slope_distance)
      this.refreshChart()
    },

    showChartSlopeDistanceAndRate() {
      this.setChartView(CHART_VIEWS.slope_distance_and_rate)
      this.refreshChart()
    },

    showChartCsdAndRate() {
      this.setChartView(CHART_VIEWS.csd_and_rate)
      this.refreshChart()
    },
  },
}
</script>

<style lang="scss">
.edm-chart-btn {
  & > button {
    color: #24292e;
    background-color: #fff;
    border-color: rgba(27, 31, 35, 0.15);
    border-radius: 5px;
    box-shadow: 0 1px 0 rgba(27, 31, 35, 0.04),
      inset 0 1px 0 hsla(0, 0%, 100%, 0.25);

    &:active,
    &:focus,
    &:hover {
      color: #24292e;
      background-color: #f3f4f6;
      border-color: rgba(27, 31, 35, 0.15);
    }
  }
  &.show {
    & > button {
      color: #24292e !important;
      background-color: #f3f4f6 !important;
      border-color: rgba(27, 31, 35, 0.15) !important;
    }
    & .dropdown-toggle::after {
      color: #24292e !important;
    }
  }
}
</style>
