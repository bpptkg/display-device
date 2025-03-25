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
          <ThermalAxisFilter
            class="ml-2"
            :items="areas"
            @change="handleFilterChange"
          />
          <BFormCheckbox v-model="enable_sky_filter" class="ml-2" size="sm"
            >Enable sky filter</BFormCheckbox
          >
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

      <div>
        <BFormCheckbox v-model="enableAutoUpdate" class="ml-2" size="sm"
          >Auto update</BFormCheckbox
        >
      </div>

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
import JSZip from 'jszip'
import { mapState, mapActions, mapMutations } from 'vuex'
import DChart from '@/components/echarts/chart/DChart'
import RangeSelector from '@/components/range-selector'
import fieldOptions from '@/store/thermal-axis/field-options'
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
  SET_AREAS,
  SET_VISIBLE,
  SET_SKY_FILTER,
  SET_AUTO_UPDATE,
  UPDATE_THERMAL_AXIS,
} from '@/store/thermal-axis'
import rangeSelectorDay, {
  maxCustomDuration as maxCustomDurationDay,
} from '@/store/thermal-axis/range-selector-day'
import rangeSelectorHour, {
  maxCustomDuration as maxCustomDurationHour,
} from '@/store/thermal-axis/range-selector-hour'
import rangeSelectorMinute, {
  maxCustomDuration as maxCustomDurationMinute,
} from '@/store/thermal-axis/range-selector-minute'
import { createThermalAxisChartOptions } from '@/components/echarts/chart-options/thermal-axis'
import { getStatsInfo } from '@/components/echarts/chart-options/thermal-axis/utils'
import ErrorMessage from '@/components/error-message'
import { toUnixMiliSeconds } from '@/utils/series'
import { DateRangeTypes } from '@/constants/date'
import ThermalAxisFilter from './ThermalAxisFilter'

export default {
  components: {
    BCard,
    BDropdownItem,
    BFormCheckbox,
    BFormSelect,
    BLink,
    DChart,
    ErrorMessage,
    EventAnnotation,
    MoreMenu,
    RangeSelector,
    SidepanelListDivider,
    SidepanelTab,
    SidepanelTabs,
    StatsPanelPeriod,
    StatsPanelTable,
    ThermalAxisFilter,
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
      station: 'kaliurang',
    }
  },
  computed: {
    ...mapState({
      data(state) {
        return state.thermalAxis[this.station].data
      },
      error(state) {
        return state.thermalAxis[this.station].error
      },
      startTime(state) {
        return state.thermalAxis[this.station].startTime
      },
      endTime(state) {
        return state.thermalAxis[this.station].endTime
      },
      period(state) {
        return state.thermalAxis[this.station].period
      },
      sampling(state) {
        return state.thermalAxis[this.station].sampling
      },
      annotationOptions(state) {
        return state.thermalAxis[this.station].annotationOptions
      },
      annotations(state) {
        return state.thermalAxis[this.station].annotations
      },
      areas(state) {
        return state.thermalAxis[this.station].areas
      },
      use_sky_filter(state) {
        return state.thermalAxis[this.station].use_sky_filter
      },
      autoUpdate(state) {
        return state.thermalAxis[this.station].autoUpdate
      },
    }),
    namespace() {
      return `thermalAxis/${this.station}`
    },
    samplingType: {
      get: function () {
        return this.sampling
      },
      set: function (value) {
        this.setSampling(value)
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
      const visibleIndices = this.areas
        .map((area, index) => (area.isVisible ? index : null))
        .filter((index) => index !== null)
      const data = this.data.filter((_, index) =>
        visibleIndices.includes(index)
      )
      const areas = this.areas.filter((_, index) =>
        visibleIndices.includes(index)
      )
      return createThermalAxisChartOptions(
        data,
        areas,
        this.annotations,
        toUnixMiliSeconds(this.startTime),
        toUnixMiliSeconds(this.endTime),
        this.sampling,
        {
          title: 'Thermal Axis Kaliurang',
        }
      )
    },
    statsInfo() {
      const visibleIndices = this.areas
        .map((area, index) => (area.isVisible ? index : null))
        .filter((index) => index !== null)
      const data = this.data.filter((_, index) =>
        visibleIndices.includes(index)
      )
      const areas = this.areas.filter((_, index) =>
        visibleIndices.includes(index)
      )
      return getStatsInfo(data, areas)
    },
    enable_sky_filter: {
      get() {
        return this.use_sky_filter
      },
      set(value) {
        this.setSkyFilter(value)
        this.update()
      },
    },
    enableAutoUpdate: {
      get() {
        return this.autoUpdate
      },
      set(value) {
        this.setAutoUpdate(value)
        this.handleAutoUpdate(value)
      },
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
      setAreas(commit, areas) {
        return commit(this.namespace + '/' + SET_AREAS, areas)
      },
      setVisible(commit, { index, isVisible }) {
        return commit(this.namespace + '/' + SET_VISIBLE, { index, isVisible })
      },
      setSkyFilter(commit, value) {
        return commit(this.namespace + '/' + SET_SKY_FILTER, value)
      },
      setAutoUpdate(commit, value) {
        return commit(this.namespace + '/' + SET_AUTO_UPDATE, value)
      },
    }),

    ...mapActions({
      fetchData(dispatch) {
        return dispatch(this.namespace + '/' + UPDATE_THERMAL_AXIS)
      },
      updateAnnotations(dispatch) {
        return dispatch(this.namespace + '/' + UPDATE_ANNOTATIONS)
      },
    }),

    async downloadData() {
      const zip = new JSZip()
      this.data.forEach((array, index) => {
        zip.file(`${this.areas[index].name}.csv`, createCSVContent(array))
      })

      zip.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(
          content,
          `thermal-axis-${this.station}-${createShortNameFromPeriod(
            this.period
          )}.zip`
        )
      })
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
        this.areas.forEach((area) => (area.isVisible = isVisible))
      } else {
        this.setVisible({ index, isVisible })
      }

      this.refresh()
    },

    handleAutoUpdate(value) {
      if (value) {
        this.interval = setInterval(() => {
          this.update()
        }, 1000 * 60)
      } else {
        if (this.interval) {
          clearInterval(this.interval)
        }
      }
    },
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
  min-height: 600px;
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
</style>
