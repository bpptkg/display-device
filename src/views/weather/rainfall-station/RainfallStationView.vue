<template>
  <div>
    <div class="chart-container">
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
        <div class="d-flex justify-content-end">
          <MoreMenu right>
            <BDropdownItem @click="downloadData"> Download Data </BDropdownItem>
          </MoreMenu>
        </div>
        <DChart ref="chart" :options="chartOptions" class="chart" />
      </BCard>

      <DNote>
        &mdash; Rainfall event may be clipped if rainfall duration greater than
        time period selected. Using longer time period is recommended to avoid
        this clipping issue.
      </DNote>
    </div>

    <SidepanelTabs v-model="tabIndex" sidepanel-class="secondary-nav">
      <SidepanelTab
        title="Rainfall Information"
        :icon="InfoIcon"
        no-body
        :active="tabIndex === 0"
      >
        <RainfallStationInfo />
      </SidepanelTab>
    </SidepanelTabs>

    <RainfallStationInfoBotPanel />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { BCard, BLink, BDropdownItem } from 'bootstrap-vue'

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

import {
  baseChartOptions,
  createSeries,
  mediaQuery,
  createTooltip,
} from '@/components/echarts/chart-options/rainfall-station'

import rangeSelector, {
  maxCustomDuration,
} from '@/store/rainfall-station/range-selector'
import { NAMESPACE } from '@/store/rainfall-station'

import {
  SET_PERIOD,
  SET_START_TIME,
  SET_END_TIME,
} from '@/store/base/mutations'
import { UPDATE_RAINFALL } from '@/store/rainfall-station/actions'

import RainfallStationInfo from './RainfallStationInfo'
import RainfallStationInfoBotPanel from './RainfallStationInfoBotPanel'

import { DateRangeTypes } from '@/constants/date'

import DNote from '@/components/base/note/DNote'

export default {
  name: 'RainfallStationView',
  components: {
    RangeSelector,
    BCard,
    BDropdownItem,
    BLink,
    DChart,
    ErrorMessage,
    MoreMenu,
    SidepanelTab,
    SidepanelTabs,
    RainfallStationInfo,
    RainfallStationInfoBotPanel,
    DNote,
  },
  data() {
    return {
      InfoIcon,
      maxCustomDuration,
      rangeSelector,
      tabIndex: 0,
    }
  },
  computed: {
    ...mapState(NAMESPACE, {
      period: (state) => state.period,
      error: (state) => state.error,
      data: (state) => state.data,
      stations: (state) => state.stations,
    }),

    chartOptions() {
      const options = {
        baseOption: {
          ...baseChartOptions(this.stations),
          series: createSeries(this.data, this.stations),
          tooltip: createTooltip(this.data, this.stations),
        },
        media: mediaQuery(this.stations),
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
        return commit(NAMESPACE + '/' + SET_PERIOD, period)
      },
      setStartTime(commit, value) {
        return commit(NAMESPACE + '/' + SET_START_TIME, value)
      },
      setEndTime(commit, value) {
        return commit(NAMESPACE + '/' + SET_END_TIME, value)
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
          `rainfall-station-${createShortNameFromPeriod(this.period)}.zip`
        )
      })
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
