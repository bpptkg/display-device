<template>
  <div class="w-100">
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
      <div class="d-flex justify-content-between flex-wrap mb-3">
        <div class="d-flex align-items-center">
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
      <DChart ref="chart" :options="chartOptions" class="chart" manual-update />

      <div class="mt-2">
        <input v-model="showStdDev" type="checkbox" />
        <label for="checkbox" class="ml-2">
          <small>Plot max. temperature standard deviation value</small>
        </label>
      </div>
    </BCard>
    <DNote>
      &mdash; Density refer to percentage of pixel area whose temperature value
      >30&deg;C compared to all pixels in the particular area.
    </DNote>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { BCard, BDropdownItem, BLink, VBHover } from 'bootstrap-vue'

import { toUnixMiliSeconds } from '@/utils/series'

import chartMixin from '@/components/mixins/charts'
import DChart from '@/components/echarts/chart/DChart'
import ErrorMessage from '@/components/error-message'
import RangeSelector from '@/components/range-selector'
import EventAnnotation from '@/components/event-annotation'
import DNote from '@/components/base/note/DNote'
import {
  baseChartOptions,
  createSeries,
  createXAxis,
  mediaQuery,
  createTooltipFormatter,
  DENSITY_FILTER_THRESHOLD,
} from '@/components/echarts/chart-options/thermal'

import stationOptions from '@/store/thermal/station-options'
import rangeSelector, {
  maxCustomDuration,
} from '@/store/thermal/range-selector'
import {
  SET_END_TIME,
  SET_PERIOD,
  SET_START_TIME,
  SET_ANNOTATION_OPTIONS,
} from '@/store/base/mutations'
import { UPDATE_ANNOTATIONS } from '@/store/base/actions'
import { UPDATE_THERMAL } from '@/store/thermal/actions'
import { SET_STD_DEV } from '@/store/thermal/mutations'
import { createCSVContent, createShortNameFromPeriod } from '@/utils/bulletin'
import MoreMenu from '@/components/more-menu'
import { saveAs } from '@/lib/file-saver'
import JSZip from 'jszip'
import { AREAS_STATION_MAP } from '../../store/thermal'

export default {
  name: 'ThermalChart',
  components: {
    BCard,
    BDropdownItem,
    BLink,
    DChart,
    DNote,
    ErrorMessage,
    EventAnnotation,
    MoreMenu,
    RangeSelector,
  },
  directives: {
    'b-hover': VBHover,
  },
  mixins: [chartMixin],
  props: {
    station: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      rangeSelector,
      maxCustomDuration,
      DENSITY_FILTER_THRESHOLD,
    }
  },
  computed: {
    ...mapState({
      data(state) {
        return state.thermal[this.station].data
      },
      error(state) {
        return state.thermal[this.station].error
      },
      period(state) {
        return state.thermal[this.station].period
      },
      startTime(state) {
        return state.thermal[this.station].startTime
      },
      endTime(state) {
        return state.thermal[this.station].endTime
      },
      annotationOptions(state) {
        return state.thermal[this.station].annotationOptions
      },
      annotations(state) {
        return state.thermal[this.station].annotations
      },
      plotStdDev(state) {
        return state.thermal[this.station].plotStdDev
      },
    }),
    namespace() {
      return `thermal/${this.station}`
    },
    chartTitle() {
      return stationOptions.find((v) => v.value === this.station).chartTitle
    },
    chartOptions() {
      const options = {
        baseOption: {
          ...baseChartOptions({ plotStdDev: this.plotStdDev }),
          series: createSeries(this.data, AREAS_STATION_MAP[this.station], {
            annotations: this.annotations,
            plotStdDev: this.plotStdDev,
          }),
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
            formatter: createTooltipFormatter(AREAS_STATION_MAP[this.station]),
          },
          xAxis: createXAxis(
            toUnixMiliSeconds(this.startTime),
            toUnixMiliSeconds(this.endTime)
          ),
        },
        media: mediaQuery,
      }
      return options
    },
    showStdDev: {
      get() {
        return this.plotStdDev
      },
      set(value) {
        return this.setStdDev(value)
      },
    },
  },
  watch: {
    plotStdDev() {
      this.reupdateChart()
    },
  },
  mounted() {
    this.update()
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
      setStdDev(commit, value) {
        return commit(this.namespace + '/' + SET_STD_DEV, value)
      },
    }),
    ...mapActions({
      fetchData(dispatch) {
        return dispatch(this.namespace + '/' + UPDATE_THERMAL)
      },
      updateAnnotations(dispatch) {
        return dispatch(this.namespace + '/' + UPDATE_ANNOTATIONS)
      },
    }),
    async downloadData() {
      const zip = new JSZip()
      const areas = AREAS_STATION_MAP[this.station]
      this.data.forEach((array, index) => {
        zip.file(`${areas[index].name}.csv`, createCSVContent(array))
      })

      zip.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(
          content,
          `${this.station}-${createShortNameFromPeriod(this.period)}.zip`
        )
      })
    },
    reupdateChart() {
      const chart = this.$refs.chart.$refs.chart
      chart.clear()
      chart.mergeOptions(this.chartOptions)
    },
  },
}
</script>

<style lang="scss" scoped>
.chart {
  min-height: 500px;
}
</style>
