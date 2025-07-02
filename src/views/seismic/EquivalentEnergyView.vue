<template>
  <div class="content">
    <div
      class="d-flex justify-content-between align-items-center flex-wrap mb-3"
    >
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
      </div>
      <div class="d-flex align-items-center">
        <MoreMenu right class="ml-2">
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
    <BCard v-show="!error" class="chart-container">
      <div class="chart-wrapper">
        <DChart
          ref="chart"
          :options="chartOptions"
          class="chart"
          manual-update
        />
      </div>
    </BCard>

    <BCard title="Statistics" title-tag="h6" class="stats-panel mt-3">
      <StatsPanelPeriod
        :start="startTime"
        :end="endTime"
        scrollable
        show-no-data-label
      />
      <StatsPanelTable
        :fields="fieldOptions"
        :items="statsInfo"
        scrollable
        show-no-data-label
      />
    </BCard>

    <SidepanelTabs class="secondary-nav">
      <SidepanelTab title="Statistics" :icon="TimelineIcon" active no-body>
        <StatsPanelPeriod
          :start="startTime"
          :end="endTime"
          scrollable
          show-no-data-label
        />
        <StatsPanelTable
          :fields="fieldOptions"
          :items="statsInfo"
          scrollable
          show-no-data-label
        />
      </SidepanelTab>
    </SidepanelTabs>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { BCard, BDropdownItem, VBTooltip, BLink } from 'bootstrap-vue'
import { saveAs } from '@/lib/file-saver'

import { createCSVContent, createShortNameFromPeriod } from '@/utils/bulletin'
import MoreMenu from '@/components/more-menu'

import {
  baseChartOptions,
  createSeries,
  createXAxis,
  mediaQuery,
} from '@/components/echarts/chart-options/seismic/equivalent-energy'

import {
  StatsPanelPeriod,
  StatsPanelTable,
} from '@/components/sidepanel/panel/stats'
import { SidepanelTabs, SidepanelTab } from '@/components/sidepanel'

import { getStatsInfo } from '@/components/echarts/chart-options/seismic/equivalent-energy/utils'

import DChart from '@/components/echarts/chart/DChart'
import ErrorMessage from '@/components/error-message'
import RangeSelector from '@/components/range-selector'
import chartMixin from '@/components/mixins/charts'

import { toUnixMiliSeconds } from '@/utils/series'

import rangeSelector, {
  maxCustomDuration,
} from '@/store/seismic/equivalent-energy/range-selector'

import {
  SET_END_TIME,
  SET_PERIOD,
  SET_START_TIME,
} from '@/store/base/mutations'
import fieldOptions from '@/store/seismic/equivalent-energy/field-options'
import { UPDATE_ENERGY } from '@/store/seismic/equivalent-energy/actions'
import { NAMESPACE } from '@/store/seismic/equivalent-energy'
import { TimelineIcon } from '@/components/icons/content'
import { SET_CHANNEL } from '../../store/seismic/equivalent-energy'

export default {
  name: 'EquivalentEnergyview',
  components: {
    BCard,
    BDropdownItem,
    BLink,
    DChart,
    ErrorMessage,
    MoreMenu,
    RangeSelector,
    SidepanelTab,
    SidepanelTabs,
    StatsPanelPeriod,
    StatsPanelTable,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  mixins: [chartMixin],
  data() {
    return {
      rangeSelector,
      maxCustomDuration,
      fieldOptions,
      TimelineIcon,
    }
  },
  computed: {
    ...mapState(NAMESPACE, {
      data: (state) => state.data,
      error: (state) => state.error,
      period: (state) => state.period,
      startTime: (state) => state.startTime,
      endTime: (state) => state.endTime,
      channelOptions: (state) => state.channelOptions,
    }),

    chartOptions() {
      const options = {
        baseOption: {
          ...baseChartOptions(),
          series: createSeries(this.data),
          xAxis: createXAxis(
            toUnixMiliSeconds(this.startTime),
            toUnixMiliSeconds(this.endTime)
          ),
        },
        media: mediaQuery(),
      }

      return options
    },

    statsInfo() {
      return getStatsInfo(this.data)
    },
  },
  mounted() {
    this.update()
  },
  watch: {
    channel() {
      this.update()
    },
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
      setChannel(commit, channel) {
        return commit(NAMESPACE + '/' + SET_CHANNEL, channel)
      },
    }),

    ...mapActions({
      fetchData(dispatch) {
        return dispatch(NAMESPACE + '/' + UPDATE_ENERGY)
      },
      updateAnnotations(dispatch) {
        // This chart doesn't use annotations but this method is called in the
        // chartMixin.
      },
    }),

    async downloadData() {
      const blob = new Blob([createCSVContent(this.data)], {
        type: 'text/csv;charset=utf-8',
      })
      saveAs(blob, `rf-ap-energy-${createShortNameFromPeriod(this.period)}.csv`)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/layout-monkey';

@media (min-width: 991.98px) {
  .stats-panel {
    display: none;
  }
}

@media (max-width: 575.98px) {
  .chart {
    width: 450px;
  }
}

.chart-wrapper {
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
