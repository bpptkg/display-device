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

    <div v-show="!error">
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
import moment from 'moment'

import { mapState, mapActions, mapMutations } from 'vuex'
import { BCard, BFormSelect, BLink, BDropdownItem } from 'bootstrap-vue'

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
} from '@/components/echarts/chart-options/tiltmeter/overview'
import { tooltipFormatter } from '@/components/echarts/chart-options/tiltmeter'

import rangeSelectorDay, {
  maxCustomDuration as maxCustomDurationDay,
} from '@/store/tiltmeter/overview/range-selector-day'
import rangeSelectorMinute, {
  maxCustomDuration as maxCustomDurationMinute,
} from '@/store/tiltmeter/overview/range-selector-minute'
import {
  SET_END_TIME,
  SET_PERIOD,
  SET_START_TIME,
  SET_ANNOTATION_OPTIONS,
} from '@/store/base/mutations'
import { UPDATE_ANNOTATIONS } from '@/store/base/actions'
import { SET_SAMPLING } from '@/store/tiltmeter/overview/mutations'
import { UPDATE_TILTMETER } from '@/store/tiltmeter/overview/actions'
import { createCSVContent, createShortNameFromPeriod } from '@/utils/bulletin'
import MoreMenu from '@/components/more-menu'
import { saveAs } from '@/lib/file-saver'
import tiltOptions from '@/components/echarts/chart-options/tiltmeter/overview/tilt-options'

export default {
  name: 'TiltmeterOverviewChart',
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
  mixins: [chartMixin],
  data() {
    return {
      samplingOptions: [
        { value: SamplingTypes.DAY, text: 'Daily' },
        { value: SamplingTypes.MINUTE, text: 'Minutely' },
      ],
    }
  },
  computed: {
    ...mapState({
      data: (state) => state.tiltmeter.overview.data,
      error: (state) => state.tiltmeter.overview.error,
      period: (state) => state.tiltmeter.overview.period,
      startTime: (state) => state.tiltmeter.overview.startTime,
      endTime: (state) => state.tiltmeter.overview.endTime,
      annotationOptions: (state) => state.tiltmeter.overview.annotationOptions,
      annotations: (state) => state.tiltmeter.overview.annotations,
      tiltOptions: (state) => state.tiltmeter.overview.tiltOptions,
      datasampling: (state) => state.tiltmeter.overview.sampling,
    }),
    namespace() {
      return `tiltmeter/overview`
    },
    sampling: {
      get() {
        return this.datasampling
      },
      set(value) {
        this.setSampling(value)
      },
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
    chartOptions() {
      const options = {
        baseOption: {
          ...baseChartOptions(this.tiltOptions),
          series: createSeries(this.data, this.tiltOptions, {
            annotations: this.annotations,
          }),
          title: {
            text: 'Tiltmeter',
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
            toUnixMiliSeconds(this.endTime),
            this.tiltOptions
          ),
        },
        media: mediaQuery(this.tiltOptions),
      }
      return options
    },
    style() {
      return {
        height: `${this.tiltOptions.length * 120}px`,
      }
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
      const zip = new JSZip()
      this.data.forEach((array, index) => {
        const { type, station } = tiltOptions[index]
        zip.file(`tiltmeter-${type}-${station}.csv`, createCSVContent(array))
      })

      zip.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(
          content,
          `tiltmeter-overview-${this.sampling}-${createShortNameFromPeriod(
            this.period
          )}.zip`
        )
      })
    },
  },
}
</script>

<style lang="scss" scoped>
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
