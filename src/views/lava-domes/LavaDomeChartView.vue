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
      <div
        class="d-flex justify-content-between align-items-center flex-wrap mb-3"
      >
        <div class="d-flex align-items-center flex-wrap">
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

      <div class="chart-wrapper">
        <DChart
          ref="chart"
          class="chart"
          :options="chartOptions"
          manual-update
        />
      </div>

      <BCard title="Statistics" title-tag="h6" class="stats-panel mt-3">
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

    <SidepanelTabs class="secondary-nav">
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
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { BCard, BDropdownItem, BLink } from 'bootstrap-vue'

import { saveAs } from '@/lib/file-saver'
import { LavaDome } from '@/constants/lava-domes'
import { toUnixMiliSeconds } from '@/utils/series'
import { createPeriodText } from '@/utils/datetime'

import {
  SidepanelListDivider,
  SidepanelTab,
  SidepanelTabs,
} from '@/components/sidepanel'
import {
  StatsPanelPeriod,
  StatsPanelTable,
} from '@/components/sidepanel/panel/stats'

import ErrorMessage from '@/components/error-message'
import RangeSelector from '@/components/range-selector'
import DChart from '@/components/echarts/chart/DChart'
import MoreMenu from '@/components/more-menu'
import chartMixin from '@/components/mixins/charts'
import { createCSVContent, createShortNameFromPeriod } from '@/utils/bulletin'
import { TimelineIcon } from '@/components/icons/content'

import {
  baseChartOptions,
  createSeries,
  createXAxis,
  mediaQuery,
} from '@/components/echarts/chart-options/lava-domes'
import { getStatsInfo } from '@/components/echarts/chart-options/lava-domes/utils'
import rangeSelector, {
  maxCustomDuration,
} from '@/store/lava-domes/range-selector'
import fieldOptions from '@/store/lava-domes/field-options'
import {
  SET_PERIOD,
  SET_START_TIME,
  SET_END_TIME,
} from '@/store/base/mutations'
import { UPDATE_DATA } from '@/store/lava-domes/actions'

const getNamespaceLocation = (loc) => {
  switch (loc) {
    case LavaDome.DOME_SOUTHWEST:
      return 'domeSouthwest'
    case LavaDome.DOME_CENTER:
      return 'domeCenter'
    default:
      return 'domeSouthwest'
  }
}

const getTitlebyLocation = (loc) => {
  switch (loc) {
    case LavaDome.DOME_SOUTHWEST:
      return 'Lava Dome Growth (Barat Daya)'
    case LavaDome.DOME_CENTER:
      return 'Lava Dome Growth (Tengah Kawah)'
    default:
      return 'Lava Dome Growth'
  }
}

export default {
  name: 'LavaDomeChartView',
  components: {
    BCard,
    BDropdownItem,
    BLink,
    DChart,
    ErrorMessage,
    MoreMenu,
    RangeSelector,
    SidepanelListDivider,
    SidepanelTab,
    SidepanelTabs,
    StatsPanelPeriod,
    StatsPanelTable,
  },
  mixins: [chartMixin],
  props: {
    location: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      fieldOptions,
      maxCustomDuration,
      rangeSelector,
      TimelineIcon,
    }
  },
  computed: {
    ...mapState({
      data(state) {
        return state.lavaDome[this.namespaceLocation].data
      },
      error(state) {
        return state.lavaDome[this.namespaceLocation].error
      },
      period(state) {
        return state.lavaDome[this.namespaceLocation].period
      },
      startTime(state) {
        return state.lavaDome[this.namespaceLocation].startTime
      },
      endTime(state) {
        return state.lavaDome[this.namespaceLocation].endTime
      },
    }),

    namespace() {
      return `lavaDome/${this.namespaceLocation}`
    },

    namespaceLocation() {
      return getNamespaceLocation(this.location)
    },

    chartOptions() {
      const options = {
        baseOption: {
          ...baseChartOptions(),
          series: createSeries(this.data),
          xAxis: createXAxis(
            toUnixMiliSeconds(this.startTime),
            toUnixMiliSeconds(this.endTime)
          ),
          title: {
            text: getTitlebyLocation(this.location),
            left: 'center',
            align: 'right',
            textStyle: {
              fontSize: 16,
              fontWeight: 'bold',
            },
            subtext: createPeriodText(this.startTime, this.endTime),
            subtextStyle: { color: '#363636' },
          },
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
    }),

    ...mapActions({
      fetchData(dispatch) {
        return dispatch(this.namespace + '/' + UPDATE_DATA)
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
      saveAs(blob, `lava-dome-${createShortNameFromPeriod(this.period)}.csv`)
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/layout-monkey';

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

@media (min-width: 991.98px) {
  .stats-panel {
    display: none;
  }
}
</style>
