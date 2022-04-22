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
          <span class="sampling-label mr-1">Sampling:</span>
          <BFormSelect
            v-model="sampling"
            size="sm"
            :options="samplingOptions"
          />
          <MoreMenu right class="ml-2">
            <BDropdownItem @click="downloadData"> Download Data </BDropdownItem>
          </MoreMenu>
        </div>
      </div>
      <DChart ref="chart" :options="chartOptions" class="chart" manual-update />
      <div v-if="isTiltmeterBorehole" class="mt-2">
        <input
          v-model="midMode"
          type="checkbox"
          id="useCustomHourAgg"
          name="useCustomHourAgg"
        />
        <label
          for="useCustomHourAgg"
          class="small ml-1"
          v-b-hover
          title="Use custom hour range daily aggregation at 00-01 AM instead of using a whole day data."
          >Use custom hour range daily aggregation (00-01 AM)</label
        >
      </div>
    </BCard>
  </div>
</template>

<script>
import moment from 'moment'

import { mapState, mapActions, mapMutations } from 'vuex'
import {
  BCard,
  BDropdownItem,
  BFormSelect,
  BLink,
  VBHover,
} from 'bootstrap-vue'

import { DATE_FORMAT } from '@/constants/date'
import { SamplingTypes } from '@/constants/tiltmeter'
import { toUnixMiliSeconds } from '@/utils/series'

import chartMixin from '@/components/mixins/charts'
import DChart from '@/components/echarts/chart/DChart'
import ErrorMessage from '@/components/error-message'
import RangeSelector from '@/components/range-selector'
import EventAnnotation from '@/components/event-annotation'
import {
  baseChartOptions,
  createSeries,
  createXAxis,
  mediaQuery,
  tooltipFormatter,
} from '@/components/echarts/chart-options/tiltmeter'

import stationOptions from '@/store/tiltmeter/station-options'
import rangeSelectorDay, {
  maxCustomDuration as maxCustomDurationDay,
} from '@/store/tiltmeter/range-selector-day'
import rangeSelectorMinute, {
  maxCustomDuration as maxCustomDurationMinute,
} from '@/store/tiltmeter/range-selector-minute'
import {
  SET_END_TIME,
  SET_PERIOD,
  SET_START_TIME,
  SET_ANNOTATION_OPTIONS,
} from '@/store/base/mutations'
import { UPDATE_ANNOTATIONS } from '@/store/base/actions'
import { SET_SAMPLING, SET_MID_MODE } from '@/store/tiltmeter/mutations'
import { UPDATE_TILTMETER } from '@/store/tiltmeter/actions'
import { createCSVContent, createShortNameFromPeriod } from '@/utils/bulletin'
import MoreMenu from '@/components/more-menu'
import { saveAs } from '@/lib/file-saver'

export default {
  name: 'TiltmeterChart',
  components: {
    BCard,
    BDropdownItem,
    BFormSelect,
    BLink,
    DChart,
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
    type: {
      type: String,
      required: true,
    },
    station: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      sampling: SamplingTypes.DAY,
      samplingOptions: [
        { value: SamplingTypes.DAY, text: 'Daily' },
        { value: SamplingTypes.MINUTE, text: 'Minutely' },
      ],
    }
  },
  computed: {
    ...mapState({
      data(state) {
        return state.tiltmeter[this.type][this.station].data
      },
      error(state) {
        return state.tiltmeter[this.type][this.station].error
      },
      period(state) {
        return state.tiltmeter[this.type][this.station].period
      },
      startTime(state) {
        return state.tiltmeter[this.type][this.station].startTime
      },
      endTime(state) {
        return state.tiltmeter[this.type][this.station].endTime
      },
      annotationOptions(state) {
        return state.tiltmeter[this.type][this.station].annotationOptions
      },
      annotations(state) {
        return state.tiltmeter[this.type][this.station].annotations
      },
      mid(state) {
        return state.tiltmeter[this.type][this.station].mid
      },
    }),
    namespace() {
      return `tiltmeter/${this.type}/${this.station}`
    },
    rangeSelector() {
      return this.sampling === SamplingTypes.DAY
        ? rangeSelectorDay
        : rangeSelectorMinute
    },
    maxCustomDuration() {
      return this.sampling === SamplingTypes.DAY
        ? maxCustomDurationDay
        : maxCustomDurationMinute
    },
    isTiltmeterBorehole() {
      return this.type === 'borehole'
    },
    midMode: {
      get: function () {
        return this.mid
      },
      set: function (value) {
        return this.setMidMode(value)
      },
    },
    chartTitle() {
      return stationOptions.find(
        (v) => v.value === `${this.type}/${this.station}`
      ).chartTitle
    },
    chartOptions() {
      const options = {
        baseOption: {
          ...baseChartOptions,
          series: createSeries(this.data, {
            annotations: this.annotations,
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
            axisPointer: {
              type: 'cross',
              lineStyle: {
                type: 'dashed',
              },
            },
            formatter: tooltipFormatter(this.sampling),
          },
          xAxis: createXAxis(
            toUnixMiliSeconds(
              this.sampling === SamplingTypes.DAY
                ? moment(this.startTime.format(DATE_FORMAT))
                : this.startTime
            ),
            toUnixMiliSeconds(this.endTime)
          ),
        },
        media: mediaQuery,
      }
      return options
    },
  },
  watch: {
    sampling(value) {
      const period = this.rangeSelector[0]
      this.setSampling(value)
      this.setPeriod(period)
      this.$refs['range-selector'].setSelectedPeriod(period)
      this.update()
    },
    mid(_value) {
      this.update()
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
      setSampling(commit, sampling) {
        return commit(this.namespace + '/' + SET_SAMPLING, sampling)
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
      setMidMode(commit, value) {
        return commit(this.namespace + '/' + SET_MID_MODE, value)
      },
    }),
    ...mapActions({
      fetchData(dispatch) {
        return dispatch(this.namespace + '/' + UPDATE_TILTMETER)
      },
      updateAnnotations(dispatch) {
        return dispatch(this.namespace + '/' + UPDATE_ANNOTATIONS)
      },
    }),
    async downloadData() {
      const blob = new Blob([createCSVContent(this.data)], {
        type: 'text/csv;charset=utf-8',
      })
      saveAs(
        blob,
        `tiltmeter-${this.type}-${this.station}-${
          this.sampling
        }-${createShortNameFromPeriod(this.period)}.csv`
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.chart {
  min-height: 450px;
}

.sampling-label {
  color: #24292e;
  font-size: 0.875rem;
  font-style: normal;
  opacity: 0.75;
}

@media (max-width: 575.98px) {
  .sampling-label {
    display: none;
  }
}
</style>
