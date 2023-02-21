<template>
  <div>
    <div class="toolbar d-flex flex-wrap align-items-center">
      <RangeSelector
        ref="range-selector"
        size="sm"
        class="mb-1"
        custom-cache-key="display-device:seismic/hypocenter/rangeSelector"
        custom-enabled
        :selected="period"
        :items="rangeSelector"
        :max-custom-duration="maxCustomDuration"
        @period-selected="onPeriodChange"
      />

      <div class="d-flex mx-1 mb-1">
        <DButtonIcon
          v-b-tooltip.hover
          title="Refresh"
          :icon="RefreshIcon"
          :busy="isRefreshing"
          no-border
          no-shadow
          @click.native="refresh"
        />
        <DButtonIcon
          v-b-tooltip.hover
          title="Chart Settings"
          :icon="SettingIcon"
          no-border
          no-shadow
          @click.native="$refs['chart-settings'].show()"
        />
        <DButtonIcon
          v-b-tooltip.hover
          :title="
            view === VIEWS.table ? 'Toggle Chart View' : 'Toggle Table View'
          "
          :icon="TableChartIcon"
          no-border
          no-shadow
          :active="view === VIEWS.table"
          @click.native="toggleTableView"
        />
        <DButtonIcon
          v-b-tooltip.hover
          :busy="busy"
          :icon="SaveAltIcon"
          no-border
          no-shadow
          title="Download Chart"
          @click.native="saveAsImage"
        />
      </div>

      <div class="d-flex mb-1">
        <BFormSelect
          v-model="hypocenterMode"
          v-b-tooltip.hover
          title="Hypocenter Mode"
          :options="hypocenterModeOptions"
          size="sm"
          class="sm-4"
        ></BFormSelect>

        <RangeFilter
          class="ml-1"
          :min="rmsMin"
          :max="rmsMax"
          :value="rmsFilterValue"
          :interval="rmsInterval"
          :default="DEFAULT_RMS_RANGE"
          content-title="RMS"
          title="RMS Filter"
          size="sm"
          :disabled="!settings.useBtbbHypo"
          @change="handleRMSFilter"
        />

        <EventFilter
          class="ml-1"
          :events="eventFilter"
          @change="handleEventFilter"
        />
      </div>
    </div>

    <div v-show="view === VIEWS.table" class="table-view">
      <HypocenterTableStats :event-info="eventInfo" />

      <div class="d-flex justify-content-end mt-3">
        <HypocenterTableDownloader />
      </div>

      <EventTableViewer
        class="mt-3"
        :fields="fieldOptions"
        :events="eventData"
      />
    </div>

    <div v-show="view === VIEWS.chart" class="hypo-view">
      <ErrorMessage v-if="error">
        <p>Unable to load data.</p>
        <p>Error: {{ error.message }}</p>
        <p>
          <BLink @click="update"> Try again </BLink>
        </p>
      </ErrorMessage>
      <DGLChart
        v-show="!error"
        id="hypocenter"
        ref="chart"
        :options="chartOptions"
        class="chart"
        manual-update
      />
    </div>
    <HypocenterChartSettings
      ref="chart-settings"
      @settings-changed="onSettingsChanged"
    />
  </div>
</template>

<script>
import { BLink, VBTooltip, BFormSelect } from 'bootstrap-vue'
import { mapMutations, mapActions, mapState, mapGetters } from 'vuex'

import { DateRangeTypes } from '@/constants/date'
import { toUnixMiliSeconds } from '@/utils/series'

import { RefreshIcon } from '@/components/icons/navigation'
import { SaveAltIcon } from '@/components/icons/content'
import { SettingIcon } from '@/components/icons/action'
import { TableChartIcon } from '@/components/icons/editor'
import DButtonIcon from '@/components/base/button-icon/DButtonIcon'
import DGLChart from '@/components/echarts/chart/DGLChart'
import ErrorMessage from '@/components/error-message'
import EventTableViewer from '@/components/viewer/EventTableViewer'
import RangeSelector from '@/components/range-selector'
import RangeFilter from '@/components/range-filter'
import EventFilter from '@/components/event-filter'

import {
  baseChartOptions,
  createSeries,
  createVisualMap,
  mediaQuery,
} from '@/components/echarts/chart-options/hypocenter'

import rangeSelector, {
  maxCustomDuration,
} from '@/store/seismic/hypocenter/range-selector'
import {
  SET_END_TIME,
  SET_PERIOD,
  SET_START_TIME,
} from '@/store/base/mutations'
import { NAMESPACE, DEFAULT_RMS_RANGE } from '@/store/seismic/hypocenter'
import {
  SET_SETTINGS,
  USE_HYPO_MODE,
  SET_RMS_FILTER,
  RESET_RMS_FILTER,
  SET_EVENT_FILTER,
} from '@/store/seismic/hypocenter/mutations'
import { UPDATE_HYPO, FETCH_TOPO } from '@/store/seismic/hypocenter/actions'

import fieldOptions from './hypocenter/field-options'
import HypocenterChartSettings from './HypocenterChartSettings'
import HypocenterTableStats from './HypocenterTableStats'
import HypocenterTableDownloader from './HypocenterTableDownloader'

const VIEWS = Object.freeze({
  chart: 'chart',
  table: 'table',
})

export default {
  name: 'Hypocenter',
  components: {
    BFormSelect,
    BLink,
    DButtonIcon,
    DGLChart,
    ErrorMessage,
    EventFilter,
    EventTableViewer,
    HypocenterChartSettings,
    HypocenterTableDownloader,
    HypocenterTableStats,
    RangeFilter,
    RangeSelector,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  data() {
    return {
      busy: false,
      fieldOptions,
      isRefreshing: false,
      maxCustomDuration,
      rangeSelector,
      RefreshIcon,
      SaveAltIcon,
      SettingIcon,
      TableChartIcon,
      view: VIEWS.chart,
      VIEWS,
      hypocenterModeOptions: [
        { value: 'manual', text: 'Manual' },
        { value: 'automatic', text: 'Automatic' },
      ],
      DEFAULT_RMS_RANGE,
    }
  },
  computed: {
    ...mapState(NAMESPACE, {
      data: (state) => state.data,
      endTime: (state) => state.endTime,
      error: (state) => state.error,
      period: (state) => state.period,
      settings: (state) => state.settings,
      startTime: (state) => state.startTime,
      topo: (state) => state.topo,
      rmsFilter: (state) => state.rmsFilter,
      eventFilter: (state) => state.eventFilter,
    }),
    ...mapGetters(NAMESPACE, [
      'plottableEvents',
      'locatableEvents',
      'btbbEvents',
      'btbbEventsUnfiltered',
      'rmsRange',
    ]),
    eventData() {
      return this.settings.useBtbbHypo
        ? this.btbbEvents
        : this.settings.onlyLocatable
        ? this.locatableEvents
        : this.plottableEvents
    },
    eventInfo() {
      return {
        plottableEvents: this.settings.useBtbbHypo
          ? this.btbbEventsUnfiltered
          : this.plottableEvents,
        currentlyPlotted: this.eventData,
        startTime: this.startTime,
        endTime: this.endTime,
      }
    },
    chartOptions() {
      const baseOptions = {
        ...baseChartOptions(this.settings),
        series: createSeries(
          this.topo,
          this.settings.useBtbbHypo
            ? this.btbbEvents
            : this.settings.onlyLocatable
            ? this.locatableEvents
            : this.plottableEvents,
          this.settings
        ),
      }

      if (this.data.length) {
        baseOptions.visualMap = createVisualMap({
          ...this.settings,
          timeMin: toUnixMiliSeconds(this.startTime),
          timeMax: toUnixMiliSeconds(this.endTime),
        })
      }
      return {
        baseOption: baseOptions,
        media: mediaQuery,
      }
    },
    hypocenterMode: {
      get: function () {
        return this.settings.useBtbbHypo ? 'automatic' : 'manual'
      },
      set: function (value) {
        this.useHypoMode(value)
      },
    },
    rmsMin() {
      const value = isFinite(this.rmsRange[0]) ? this.rmsRange[0] : 0
      return value
    },
    rmsMax() {
      const value = isFinite(this.rmsRange[1]) ? this.rmsRange[1] : 1
      return value
    },
    rmsFilterValue() {
      const defaultValue = [0, null]
      if (Array.isArray(this.rmsFilter)) {
        if (isFinite(this.rmsFilter[0]) && isFinite(this.rmsFilter[1])) {
          return this.rmsFilter
        } else {
          return defaultValue
        }
      } else if (isFinite(this.rmsMin) && isFinite(this.rmsMax)) {
        return [this.rmsMin, this.rmsMax]
      } else {
        return defaultValue
      }
    },
    rmsInterval() {
      if (isFinite(this.rmsMin) && isFinite(this.rmsMax)) {
        return Math.abs(this.rmsMax - this.rmsMin) / 20
      } else {
        return 0.01
      }
    },
  },
  watch: {
    hypocenterMode() {
      this.mergeOptions()
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    ...mapMutations({
      setPeriod(commit, period) {
        return commit(NAMESPACE + '/' + SET_PERIOD, period)
      },
      setStartTime(commit, value) {
        return commit(NAMESPACE + '/' + SET_START_TIME, value)
      },
      setEndTime(commit, value) {
        return commit(NAMESPACE + '/' + SET_END_TIME, value)
      },
      setSettings(commit, settings) {
        return commit(NAMESPACE + '/' + SET_SETTINGS, settings)
      },
      useHypoMode(commit, value) {
        return commit(NAMESPACE + '/' + USE_HYPO_MODE, value)
      },
      setRMSFilter(commit, value) {
        return commit(NAMESPACE + '/' + SET_RMS_FILTER, value)
      },
      resetRMSFilter(commit) {
        return commit(NAMESPACE + '/' + RESET_RMS_FILTER)
      },
      setEventFilter(commit, value) {
        return commit(NAMESPACE + '/' + SET_EVENT_FILTER, value)
      },
    }),
    ...mapActions({
      fetchData(dispatch) {
        return dispatch(NAMESPACE + '/' + UPDATE_HYPO)
      },
      fetchTopo(dispatch) {
        return dispatch(NAMESPACE + '/' + FETCH_TOPO)
      },
    }),
    update() {
      const chart = this.$refs.chart.$refs.chart
      chart.showLoading()
      this.fetchData().finally(() => {
        chart.hideLoading()
        chart.mergeOptions(this.chartOptions)
      })
    },
    refresh() {
      this.isRefreshing = true
      const chart = this.$refs.chart.$refs.chart
      chart.showLoading()
      this.fetchData().finally(() => {
        this.isRefreshing = false
        chart.hideLoading()
        chart.mergeOptions(this.chartOptions)
      })
    },
    mergeOptions() {
      const chart = this.$refs.chart.$refs.chart
      chart.clear()
      chart.mergeOptions(this.chartOptions)
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
    onSettingsChanged(settings) {
      this.setSettings(settings)
      this.mergeOptions()
    },
    init() {
      const chart = this.$refs.chart.$refs.chart
      chart.clear()
      chart.showLoading()

      Promise.all([
        this.$store.dispatch(NAMESPACE + '/' + FETCH_TOPO),
        this.$store.dispatch(NAMESPACE + '/' + UPDATE_HYPO),
      ]).finally(() => {
        chart.hideLoading()
        chart.mergeOptions(this.chartOptions)
      })
    },
    async flattenCanvas() {
      const pixelRatio = 2

      const canvasList = document.querySelectorAll('#hypocenter canvas')
      if (!canvasList.length) return new Error('Unable to get chart elements.')

      const { width, height } = canvasList[0]

      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = width * pixelRatio
      canvas.height = height * pixelRatio

      canvasList.forEach((c) => {
        ctx.drawImage(c, 0, 0, c.width * pixelRatio, c.height * pixelRatio)
      })

      return canvas.toDataURL('image/png')
    },
    async saveAsImage() {
      this.busy = true
      this.flattenCanvas()
        .then((image) => {
          const a = document.createElement('a')
          a.href = image
          a.download = 'Hypocenter.png'
          a.click()
        })
        .catch((error) => {
          alert(error)
          console.error(error)
        })
        .finally(() => {
          this.busy = false
        })
    },
    toggleTableView() {
      this.view = this.view === VIEWS.table ? VIEWS.chart : VIEWS.table
    },
    handleRMSFilter(value) {
      ;(async () => {
        this.setRMSFilter(value)
        this.mergeOptions()
      })()
    },
    handleEventFilter(events) {
      ;(async () => {
        this.setEventFilter(events)
        this.update()
      })()
    },
  },
}
</script>

<style lang="scss" scoped>
.toolbar {
  background-color: #fff;
  padding-left: 10px;
  padding-right: 10px;
  position: relative;
}

.chart {
  width: 100%;
  height: 100%;
}

.hypo-view {
  display: block;
  position: absolute;
  height: auto;
  bottom: 0;
  top: 0;
  left: 0;
  right: 0;
}

.table-view {
  overflow-x: hidden;
  position: relative;
  padding: 15px;
  font-size: 0.8rem;
}

@media (max-width: 991.98px) {
  .hypo-view {
    margin: 160px 0 0 0;
  }
}

@media (min-width: 992px) {
  .hypo-view {
    margin: 100px 0 0 200px;
  }

  .toolbar {
    margin: 50px 0 0 200px;
  }

  .table-view {
    margin-left: 200px;
  }
}
</style>
