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
          <BFormSelect
            class="mr-1"
            v-if="isTiltmeterPlatform"
            v-b-tooltip.hover
            v-model="filterDataType"
            size="sm"
            :options="filterDataTypes"
            title="Data Type"
          />
          <BFormSelect
            v-b-tooltip.hover
            v-model="samplingType"
            size="sm"
            :options="samplingOptions"
            title="Sampling"
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
    <div>
      <BFormCheckbox v-model="useAutoUpdate">Auto Update</BFormCheckbox>
    </div>
    <DNote> Last updated <TimeAgo :date="lastUpdated"></TimeAgo>. </DNote>
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
  VBTooltip,
  BFormCheckbox,
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
import {
  SET_SAMPLING,
  SET_MID_MODE,
  SET_FILTER_DATA_TYPE,
  SET_AUTO_UPDATE,
} from '@/store/tiltmeter/mutations'
import { UPDATE_TILTMETER } from '@/store/tiltmeter/actions'
import { createCSVContent, createShortNameFromPeriod } from '@/utils/bulletin'
import MoreMenu from '@/components/more-menu'
import { saveAs } from '@/lib/file-saver'
import { DataTypes } from '../../constants/tiltmeter'
import { FilterDataType } from '../../store/tiltmeter'
import DNote from '@/components/base/note/DNote'
import TimeAgo from '@/components/time-ago'

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
    DNote,
    TimeAgo,
    BFormCheckbox,
  },
  directives: {
    'b-hover': VBHover,
    'b-tooltip': VBTooltip,
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
      interval: null,
      samplingOptions: [
        { value: SamplingTypes.DAY, text: 'Daily' },
        { value: SamplingTypes.MINUTE, text: 'Minutely' },
      ],
      filterDataTypes: [
        { value: FilterDataType.FILTERED, text: 'Filtered' },
        { value: FilterDataType.RAW, text: 'Raw' },
      ],
    }
  },
  beforeDestroy() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  },
  computed: {
    ...mapState({
      lastUpdated(state) {
        return state.tiltmeter[this.type][this.station].lastUpdated
      },
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
      dataType(state) {
        return state.tiltmeter[this.type][this.station].dataType
      },
      autoUpdate(state) {
        return state.tiltmeter[this.type][this.station].autoUpdate
      },
      sampling(state) {
        return state.tiltmeter[this.type][this.station].sampling
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
    isTiltmeterPlatform() {
      return this.type === DataTypes.PLATFORM
    },
    midMode: {
      get: function () {
        return this.mid
      },
      set: function (value) {
        return this.setMidMode(value)
      },
    },
    filterDataType: {
      get: function () {
        return this.dataType
      },
      set: function (value) {
        return this.setFilterDataType(value)
      },
    },
    useAutoUpdate: {
      get: function () {
        return this.autoUpdate
      },
      set: function (value) {
        return this.setAutoUpdate(value)
      },
    },
    samplingType: {
      get: function () {
        return this.sampling
      },
      set: function (value) {
        this.setSampling(value)
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
    sampling(_value) {
      const period = this.rangeSelector[0]
      this.setPeriod(period)
      this.$refs['range-selector'].setSelectedPeriod(period)
      this.update()
    },
    mid(_value) {
      this.update()
    },
    filterDataType(_value) {
      this.update()
    },
    useAutoUpdate(value) {
      if (value) {
        this.registerAutoUpdate()
      } else {
        this.clearAutoUpdate()
      }
    },
  },
  mounted() {
    this.update()

    if (this.useAutoUpdate) {
      this.registerAutoUpdate()
    }
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
      setFilterDataType(commit, value) {
        return commit(this.namespace + '/' + SET_FILTER_DATA_TYPE, value)
      },
      setAutoUpdate(commit, value) {
        return commit(this.namespace + '/' + SET_AUTO_UPDATE, value)
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
    registerAutoUpdate() {
      this.interval = setInterval(() => {
        this.update()
      }, 1000 * 15)
    },
    clearAutoUpdate() {
      if (this.interval) {
        clearInterval(this.interval)
      }
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
