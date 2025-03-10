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

    <div v-show="!error">
      <div class="d-flex justify-content-between flex-wrap mb-3">
        <div class="d-flex align-items-center">
          <RangeSelector
            ref="range-selector"
            size="sm"
            :custom-enabled="true"
            :selected="period"
            :items="rangeSelector"
            :max-custom-duration="maxCustomDuration"
            @period-selected="onPeriodChange"
            class="form-label"
          />
          <EventAnnotation
            class="ml-2"
            :annotations="annotationOptions"
            @change="handleUpdateAnnotations"
          />
          <GBInsarAxisFilter
            class="ml-2"
            :items="series"
            @change="handleFilterChange"
          />
        </div>
        <div class="d-flex align-items-center justify-content-end mt-2">
          <BFormSelect
            v-model="samplingType"
            size="sm"
            :options="samplingOptions"
            title="Sampling"
          />
          <MoreMenu right class="ml-2">
            <BDropdownItem @click="downloadData">Download Data</BDropdownItem>
          </MoreMenu>
        </div>
      </div>

      <DChart ref="chart" :options="chartOptions" class="chart" manual-update />

      <BFormCheckbox v-model="useAutoUpdate" class="mb-2">
        <small>Auto update</small>
      </BFormCheckbox>

      <div class="bot-panel mt-3">
        <BCard title="Statistics" title-tag="h6">
          <StatsPanelPeriod :start="startTime" :end="endTime" />
          <SidepanelListDivider />
          <StatsPanelTable
            :fields="fieldOptions"
            :items="statsInfo"
            scrollable
            show-no-data-label
          />
        </BCard>
      </div>

      <SidepanelTabs sidepanel-class="secondary-nav">
        <SidepanelTab title="Statistics" :icon="TimelineIcon" active no-body>
          <StatsPanelPeriod :start="startTime" :end="endTime" />
          <SidepanelListDivider />
          <StatsPanelTable
            :fields="fieldOptions"
            :items="statsInfo"
            scrollable
            show-no-data-label
          />
        </SidepanelTab>
      </SidepanelTabs>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import DChart from '@/components/echarts/chart/DChart'
import RangeSelector from '@/components/range-selector'
import fieldOptions from '@/store/gbinsar/field-options'
import {
  BCard,
  BDropdownItem,
  BFormSelect,
  BLink,
  BFormCheckbox,
} from 'bootstrap-vue'
import {
  SidepanelListDivider,
  SidepanelTab,
  SidepanelTabs,
} from '@/components/sidepanel'
import {
  StatsPanelPeriod,
  StatsPanelTable,
} from '@/components/sidepanel/panel/stats'
import {
  getStatsPointInfo,
  getStatsAreaInfo,
} from '@/components/echarts/chart-options/gbinsar/utils'
import { TimelineIcon } from '@/components/icons/content'
import { createCSVContent, createShortNameFromPeriod } from '@/utils/bulletin'
import { saveAs } from '@/lib/file-saver'
import MoreMenu from '@/components/more-menu'
import EventAnnotation from '@/components/event-annotation'
import {
  SET_END_TIME,
  SET_PERIOD,
  SET_START_TIME,
  SET_ANNOTATION_OPTIONS,
} from '@/store/base/mutations'
import { UPDATE_ANNOTATIONS } from '@/store/base/actions'
import {
  SET_SAMPLING,
  SET_VISIBLE,
  SET_AUTO_UPDATE,
  UPDATE_GBINSAR,
} from '@/store/gbinsar'
import rangeSelectorDay, {
  maxCustomDuration as maxCustomDurationDay,
} from '@/store/gbinsar/range-selector-day'
import rangeSelectorHour, {
  maxCustomDuration as maxCustomDurationHour,
} from '@/store/gbinsar/range-selector-hour'
import rangeSelectorMinute, {
  maxCustomDuration as maxCustomDurationMinute,
} from '@/store/gbinsar/range-selector-minute'
import {
  createBabadanAreaChartOptions,
  BabadanAreas,
} from '@/components/echarts/chart-options/gbinsar/babadanarea'
import {
  createBabadanPointChartOptions,
  BabadanPoints,
} from '@/components/echarts/chart-options/gbinsar/babadanpoint'
import {
  createTurgoAreaChartOptions,
  TurgoAreas,
} from '@/components/echarts/chart-options/gbinsar/turgoarea'
import ErrorMessage from '@/components/error-message'
import { toUnixMiliSeconds } from '@/utils/series'
import { DateRangeTypes } from '@/constants/date'
import GBInsarAxisFilter from './GBInsarAxisFilter.vue'

export default {
  components: {
    BCard,
    BDropdownItem,
    BFormSelect,
    BFormCheckbox,
    BLink,
    DChart,
    ErrorMessage,
    EventAnnotation,
    GBInsarAxisFilter,
    MoreMenu,
    RangeSelector,
    SidepanelListDivider,
    SidepanelTab,
    SidepanelTabs,
    StatsPanelPeriod,
    StatsPanelTable,
  },
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      samplingOptions: [
        { value: 'day', text: 'Daily' },
        { value: 'hour', text: 'Hourly' },
        { value: 'minute', text: 'Minutely' },
      ],
      fieldOptions,
      TimelineIcon,
      interval: null,
    }
  },
  computed: {
    ...mapState({
      data(state) {
        return state.gbinsar[this.type].data
      },
      error(state) {
        return state.gbinsar[this.type].error
      },
      startTime(state) {
        return state.gbinsar[this.type].startTime
      },
      endTime(state) {
        return state.gbinsar[this.type].endTime
      },
      period(state) {
        return state.gbinsar[this.type].period
      },
      sampling(state) {
        return state.gbinsar[this.type].sampling
      },
      annotationOptions(state) {
        return state.gbinsar[this.type].annotationOptions
      },
      annotations(state) {
        return state.gbinsar[this.type].annotations
      },
      series(state) {
        return state.gbinsar[this.type].series
      },
      autoUpdate(state) {
        return state.gbinsar[this.type].autoUpdate
      },
    }),
    namespace() {
      return `gbinsar/${this.type}`
    },
    samplingType: {
      get: function () {
        return this.sampling
      },
      set: function (value) {
        this.setSampling(value)
      },
    },
    useAutoUpdate: {
      get: function () {
        return this.autoUpdate
      },
      set: function (value) {
        this.handleAutoUpdate(value)
        return this.setAutoUpdate(value)
      },
    },
    rangeSelector() {
      if (this.sampling === 'day') {
        return rangeSelectorDay
      } else if (this.sampling === 'hour') {
        return rangeSelectorHour
      } else {
        return rangeSelectorMinute
      }
    },
    maxCustomDuration() {
      if (this.sampling === 'day') {
        return maxCustomDurationDay
      } else if (this.sampling === 'hour') {
        return maxCustomDurationHour
      } else {
        return maxCustomDurationMinute
      }
    },
    chartOptions() {
      if (this.type === 'babadanarea') {
        return createBabadanAreaChartOptions(
          this.data,
          this.series,
          this.annotations,
          toUnixMiliSeconds(this.startTime),
          toUnixMiliSeconds(this.endTime),
          this.sampling
        )
      } else if (this.type === 'babadanpoint') {
        return createBabadanPointChartOptions(
          this.data,
          this.series,
          this.annotations,
          toUnixMiliSeconds(this.startTime),
          toUnixMiliSeconds(this.endTime),
          this.sampling
        )
      } else if (this.type === 'turgoarea') {
        return createTurgoAreaChartOptions(
          this.data,
          this.series,
          this.annotations,
          toUnixMiliSeconds(this.startTime),
          toUnixMiliSeconds(this.endTime),
          this.sampling
        )
      } else {
        return {}
      }
    },
    statsInfo() {
      if (this.type === 'babadanarea') {
        return getStatsAreaInfo(BabadanAreas, this.data)
      } else if (this.type === 'babadanpoint') {
        return getStatsPointInfo(BabadanPoints, this.data)
      } else if (this.type === 'turgoarea') {
        return getStatsAreaInfo(TurgoAreas, this.data)
      } else {
        return []
      }
    },
  },
  watch: {
    sampling(_value) {
      const period = this.rangeSelector[0]
      this.setPeriod(period)
      this.$refs['range-selector'].setSelectedPeriod(period)
      this.update()
    },
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
      setVisible(commit, { index, isVisible }) {
        return commit(this.namespace + '/' + SET_VISIBLE, { index, isVisible })
      },
      setAutoUpdate(commit, value) {
        return commit(this.namespace + '/' + SET_AUTO_UPDATE, value)
      },
    }),
    ...mapActions({
      fetchData(dispatch) {
        return dispatch(this.namespace + '/' + UPDATE_GBINSAR)
      },
      updateAnnotations(dispatch) {
        return dispatch(this.namespace + '/' + UPDATE_ANNOTATIONS)
      },
    }),

    async downloadData() {
      const blob = new Blob([createCSVContent(this.data)], {
        type: 'text/csv;charset=utf-8',
      })
      if (this.type === 'babadanarea') {
        saveAs(
          blob,
          `gbinsarbabadanarea-${createShortNameFromPeriod(this.period)}.csv`
        )
      } else if (this.type === 'babadanpoint') {
        saveAs(
          blob,
          `gbinsarbabadanpoint-${createShortNameFromPeriod(this.period)}.csv`
        )
      } else if (this.type === 'turgoarea') {
        saveAs(
          blob,
          `gbinsarturgoarea-${createShortNameFromPeriod(this.period)}.csv`
        )
      }
    },

    update() {
      const chart = this.$refs.chart.$refs.chart
      chart.clear()
      chart.showLoading()

      Promise.all([this.fetchData(), this.updateAnnotations()]).finally(() => {
        chart.hideLoading()
        chart.mergeOptions(this.chartOptions)
      })
    },

    onPeriodChange(period, { startTime, endTime }) {
      if (period.type === DateRangeTypes.CUSTOM) {
        this.setPeriod(period)
        this.setStartTime(startTime)
        this.setEndTime(endTime)
        this.update()
      } else {
        this.setPeriod(period)
        this.update()
      }
    },

    handleUpdateAnnotations(options) {
      const chart = this.$refs.chart.$refs.chart
      chart.clear()
      chart.showLoading()

      this.setAnnotationOptions(options)
      this.updateAnnotations().finally(() => {
        chart.hideLoading()
        chart.mergeOptions(this.chartOptions)
      })
    },

    refresh() {
      const chart = this.$refs.chart.$refs.chart
      chart.clear()
      chart.mergeOptions(this.chartOptions)
    },

    handleFilterChange({ index, isVisible }) {
      if (index === -1) {
        this.series.forEach((series) => (series.isVisible = isVisible))
      } else {
        this.setVisible({ index, isVisible })
      }
      this.refresh()
    },

    handleAutoUpdate(value) {
      if (value) {
        this.interval = setInterval(() => {
          this.update()
        }, 60 * 1000)
      } else {
        if (this.interval) {
          clearInterval(this.interval)
        }
      }
    },
  },

  beforeDestroy() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  },

  mounted() {
    this.update()

    this.handleAutoUpdate(this.autoUpdate)
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/layout-monkey';

.chart {
  min-height: 500px;
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

@media (min-width: 991.98px) {
  .bot-panel {
    display: none;
  }
}

@media (min-width: 2560px) {
  .chart {
    width: 100%;
    height: calc(100vh - 200px);
  }
}
</style>
