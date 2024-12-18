<template>
  <div>
    <div class="chart-container">
      <div class="d-flex justify-content-between align-items-center flex-wrap">
        <RangeSelector
          ref="range-selector"
          class="mb-3"
          size="sm"
          custom-enabled
          :selected="period"
          :items="rangeSelector"
          :max-custom-duration="maxCustomDuration"
          @period-selected="onPeriodChange"
        />

        <div class="d-flex align-items-center">
          <div class="d-flex align-items-center">
            <span class="sampling-label mr-1">Sampling:</span>
            <BFormSelect
              v-model="samplingValue"
              size="sm"
              :options="samplingOptions"
            />
          </div>
          <MoreMenu right class="ml-1">
            <BDropdownItem @click="downloadData"> Download Data </BDropdownItem>
          </MoreMenu>
        </div>
      </div>

      <BCard v-if="error">
        <ErrorMessage>
          <p>Unable to load data.</p>
          <p>Error: {{ error.message }}</p>
          <p>
            <BLink @click="update"> Try again </BLink>
          </p>
        </ErrorMessage>
      </BCard>

      <BCard v-show="!error" title-tag="h5">
        <DChart ref="chart" :options="chartOptions" class="chart" />
      </BCard>

      <BFormCheckbox v-model="useAutoUpdate" class="mb-2">
        <small>Auto update</small>
      </BFormCheckbox>

      <DNote>
        &mdash; All rainfall stations above are using Vaisala sensors.
      </DNote>
    </div>

    <SidepanelTabs v-model="tabIndex" sidepanel-class="secondary-nav">
      <SidepanelTab
        title="Rainfall Information"
        :icon="InfoIcon"
        no-body
        :active="tabIndex === 0"
      >
        <RainfallDailyInfo />
      </SidepanelTab>
    </SidepanelTabs>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import {
  BCard,
  BLink,
  BDropdownItem,
  BFormCheckbox,
  BFormSelect,
} from 'bootstrap-vue'

import { InfoIcon } from '@/components/icons/content'
import { SidepanelTabs, SidepanelTab } from '@/components/sidepanel'

import ErrorMessage from '@/components/error-message'
import DChart from '@/components/echarts/chart/DChart'
import MoreMenu from '@/components/more-menu'
import RangeSelector from '@/components/range-selector'

import { get } from 'lodash'
import JSZip from 'jszip'
import { createCSVContent, createShortNameFromPeriod } from '@/utils/bulletin'
import { saveAs } from '@/lib/file-saver'

import { createChartOptions } from '@/components/echarts/chart-options/rainfall-daily'

import rangeSelector, {
  maxCustomDuration,
} from '@/store/rainfall-daily/range-selector'
import rangeSelectorHour, {
  maxCustomDuration as maxCustomDurationHour,
} from '@/store/rainfall-daily/range-selector-hour'
import { NAMESPACE, SamplingTypes } from '@/store/rainfall-daily'

import {
  SET_PERIOD,
  SET_START_TIME,
  SET_END_TIME,
} from '@/store/base/mutations'
import { UPDATE_RAINFALL } from '@/store/rainfall-daily/actions'
import {
  SET_AUTO_UPDATE,
  SET_IS_VISIBLE,
  SET_SAMPLING,
} from '@/store/rainfall-daily/mutations'

import RainfallDailyInfo from './RainfallDailyInfo'
import { DateRangeTypes } from '@/constants/date'
import DNote from '@/components/base/note/DNote'

export default {
  name: 'RainfallStationView',
  components: {
    BCard,
    BDropdownItem,
    BFormCheckbox,
    BFormSelect,
    BLink,
    DChart,
    DNote,
    ErrorMessage,
    MoreMenu,
    RainfallDailyInfo,
    RangeSelector,
    SidepanelTab,
    SidepanelTabs,
  },
  data() {
    return {
      InfoIcon,
      tabIndex: 0,
      interval: null,
      samplingOptions: [
        { value: SamplingTypes.DAY, text: 'Daily' },
        { value: SamplingTypes.HOUR, text: 'Hourly' },
      ],
    }
  },
  computed: {
    ...mapState(NAMESPACE, {
      period: (state) => state.period,
      error: (state) => state.error,
      data: (state) => state.data,
      stations: (state) => state.stations,
      autoUpdate: (state) => state.autoUpdate,
      sampling: (state) => state.sampling,
    }),

    samplingValue: {
      get() {
        return this.sampling
      },
      set(value) {
        this.setSampling(value)
        const period = this.rangeSelector[0]
        this.setPeriod(period)
        this.$refs['range-selector'].setSelectedPeriod(period)
        this.update()
      },
    },

    rangeSelector() {
      return this.sampling === SamplingTypes.DAY
        ? rangeSelector
        : rangeSelectorHour
    },

    maxCustomDuration() {
      return this.sampling === SamplingTypes.DAY
        ? maxCustomDuration
        : maxCustomDurationHour
    },

    chartOptions() {
      return createChartOptions({ data: this.data, stations: this.stations })
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
      setAutoUpdate(commit, value) {
        return commit(NAMESPACE + '/' + SET_AUTO_UPDATE, value)
      },
      setIsVisible(commit, value) {
        return commit(NAMESPACE + '/' + SET_IS_VISIBLE, value)
      },
      setSampling(commit, sampling) {
        return commit(NAMESPACE + '/' + SET_SAMPLING, sampling)
      },
    }),
    ...mapActions({
      fetchData(dispatch) {
        return dispatch(NAMESPACE + '/' + UPDATE_RAINFALL)
      },
    }),
    update() {
      this.showLoading()
      this.fetchData().finally(() => {
        this.hideLoading()
      })
    },
    delegateMethod(name, ...args) {
      const chart = this.$refs.chart.$refs.chart
      return chart[name](...args)
    },
    showLoading(type, options) {
      this.delegateMethod('showLoading', type, options)
    },
    hideLoading() {
      this.delegateMethod('hideLoading')
    },
    clear() {
      this.delegateMethod('clear')
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
    async downloadData() {
      const zip = new JSZip()
      this.data.forEach((array, index) => {
        zip.file(
          `${this.stations[index].stationId}.csv`,
          createCSVContent(get(array, 'data', []))
        )
      })

      zip.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(
          content,
          `rainfall-daily-${createShortNameFromPeriod(this.period)}.zip`
        )
      })
    },
    handleFilterChange({ index, isVisible }) {
      this.setIsVisible({ index, isVisible })
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
}
</script>

<style lang="scss" scoped>
@import '@/scss/layout-monkey';

.chart {
  min-height: 650px !important;
}
</style>
