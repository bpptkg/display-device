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
      <div class="d-flex flex-wrap align-items-center mb-3">
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
      <DChart ref="chart" :options="chartOptions" class="chart" manual-update />
    </div>
  </div>
</template>

<script>
import { BLink } from 'bootstrap-vue'
import { mapState, mapActions, mapMutations } from 'vuex'

import { toUnixMiliSeconds } from '@/utils/series'
import { createRowGrid } from '@/utils/echarts/grid'

import chartMixins from '@/components/mixins/charts'
import ErrorMessage from '@/components/error-message'
import RangeSelector from '@/components/range-selector'
import DChart from '@/components/echarts/chart/DChart'
import EventAnnotation from '@/components/event-annotation'
import {
  baseChartOptions,
  createDataZoom,
  createSeries,
  createXAxis,
  createYAxis,
} from '@/components/echarts/chart-options/gps/baseline'

import stationOptions from '@/store/gps/baseline/station-options'
import rangeSelector, {
  maxCustomDuration,
} from '@/store/gps/baseline/range-selector'
import { UPDATE_GPS_BASELINE } from '@/store/gps/baseline/actions'
import {
  SET_PERIOD,
  SET_START_TIME,
  SET_END_TIME,
  SET_ANNOTATION_OPTIONS,
} from '@/store/base/mutations'
import { UPDATE_ANNOTATIONS } from '@/store/base/actions'

export default {
  name: 'GPSBaselineChart',
  components: {
    BLink,
    DChart,
    ErrorMessage,
    RangeSelector,
    EventAnnotation,
  },
  mixins: [chartMixins],
  props: {
    station: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      maxCustomDuration,
      rangeSelector,
    }
  },
  computed: {
    ...mapState({
      data(state) {
        return state.gps.baseline[this.station].data
      },
      references(state) {
        return state.gps.baseline[this.station].references
      },
      period(state) {
        return state.gps.baseline[this.station].period
      },
      error(state) {
        return state.gps.baseline[this.station].error
      },
      startTime(state) {
        return state.gps.baseline[this.station].startTime
      },
      endTime(state) {
        return state.gps.baseline[this.station].endTime
      },
      annotationOptions(state) {
        return state.gps.baseline[this.station].annotationOptions
      },
      annotations(state) {
        return state.gps.baseline[this.station].annotations
      },
    }),
    namespace() {
      return `gps/baseline/${this.station}`
    },
    chartTitle() {
      return stationOptions.find((v) => v.value === this.station).chartTitle
    },
    chartOptions() {
      const options = {
        baseOption: {
          ...baseChartOptions,
          dataZoom: createDataZoom(this.references.length),
          grid: createRowGrid(this.references.length, { bottom: 8 }),
          title: {
            text: this.chartTitle,
            left: 'center',
            align: 'right',
            textStyle: {
              fontSize: 14,
              fontWeight: 'normal',
            },
          },
          series: createSeries(this.data, this.references, {
            annotations: this.annotations,
          }),
          xAxis: createXAxis(
            this.references.length,
            toUnixMiliSeconds(this.startTime),
            toUnixMiliSeconds(this.endTime)
          ),
          yAxis: createYAxis(this.references),
        },
        media: [
          {
            query: {
              maxWidth: 575.98,
            },
            option: {
              grid: createRowGrid(this.references.length, {
                left: 22,
                top: 10,
                bottom: 8,
              }),
              title: {
                top: 25,
                textStyle: {
                  fontSize: 12,
                },
              },
            },
          },
        ],
      }
      return options
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
    }),
    ...mapActions({
      fetchData(dispatch) {
        return dispatch(this.namespace + '/' + UPDATE_GPS_BASELINE)
      },
      updateAnnotations(dispatch) {
        return dispatch(this.namespace + '/' + UPDATE_ANNOTATIONS)
      },
    }),
  },
}
</script>

<style lang="scss" scoped>
.chart {
  min-height: 850px;
}
</style>
