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
      <div class="d-flex align-items-center flex-wrap mb-3">
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

import chartMixins from '@/components/mixins/charts'
import ErrorMessage from '@/components/error-message'
import RangeSelector from '@/components/range-selector'
import DChart from '@/components/echarts/chart/DChart'
import EventAnnotation from '@/components/event-annotation'
import {
  baseChartOptions,
  createSeries,
  createXAxis,
  mediaQuery,
} from '@/components/echarts/chart-options/gps/coordinate'

import stationOptions from '@/store/gps/coordinate/station-options'
import rangeSelector, {
  maxCustomDuration,
} from '@/store/gps/coordinate/range-selector'
import { UPDATE_GPS_COORDINATE } from '@/store/gps/coordinate/actions'
import {
  SET_PERIOD,
  SET_START_TIME,
  SET_END_TIME,
  SET_ANNOTATION_OPTIONS,
} from '@/store/base/mutations'
import { UPDATE_ANNOTATIONS } from '@/store/base/actions'

export default {
  name: 'GPSCoordinateChart',
  components: {
    BLink,
    DChart,
    ErrorMessage,
    EventAnnotation,
    RangeSelector,
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
      interval: null,
      maxCustomDuration,
      rangeSelector,
    }
  },
  computed: {
    ...mapState({
      data(state) {
        return state.gps.coordinate[this.station].data
      },
      period(state) {
        return state.gps.coordinate[this.station].period
      },
      error(state) {
        return state.gps.coordinate[this.station].error
      },
      startTime(state) {
        return state.gps.coordinate[this.station].startTime
      },
      endTime(state) {
        return state.gps.coordinate[this.station].endTime
      },
      annotationOptions(state) {
        return state.gps.coordinate[this.station].annotationOptions
      },
      annotations(state) {
        return state.gps.coordinate[this.station].annotations
      },
    }),
    namespace() {
      return `gps/coordinate/${this.station}`
    },
    chartTitle() {
      return stationOptions.find((v) => v.value === this.station).chartTitle
    },
    chartOptions() {
      const options = {
        baseOption: {
          ...baseChartOptions,
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
          series: createSeries(
            this.data.filter((v) => v.east > 0 && v.north > 0 && v.up > 0),
            {
              annotations: this.annotations,
            }
          ),
          xAxis: createXAxis(
            toUnixMiliSeconds(this.startTime),
            toUnixMiliSeconds(this.endTime)
          ),
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
    this.update()
    this.interval = setInterval(this.update, 900000)
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
        return dispatch(this.namespace + '/' + UPDATE_GPS_COORDINATE)
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
  min-height: 500px;
}
</style>
