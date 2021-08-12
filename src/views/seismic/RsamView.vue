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
        <EventAnnotation
          class="ml-2"
          :annotations="annotationOptions"
          @change="handleUpdateAnnotations"
        />
      </div>
      <div class="d-flex align-items-center">
        <span class="station-label mr-1">Station:</span>
        <BFormSelect
          v-model="rsamStation"
          size="sm"
          :options="stationOptions"
        />
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

    <BTabs v-show="!error" v-model="tab">
      <BTab title="Band 0-7" :active="tab === 0">
        <BCard class="chart-container mt-2">
          <DChart
            v-if="tab === 0"
            ref="chart"
            :options="chartOptions"
            class="chart"
            manual-update
          />
        </BCard>
      </BTab>

      <BTab title="Band 8-13" :active="tab === 1">
        <BCard class="chart-container mt-2">
          <DChart
            v-if="tab === 1"
            ref="chart"
            :options="chartOptions"
            class="chart"
            manual-update
          />
        </BCard>
      </BTab>
    </BTabs>

    <BCard title="Statistics" title-tag="h6" class="rsam-stats-panel mt-3">
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
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import {
  BCard,
  BDropdownItem,
  BFormSelect,
  BLink,
  BTab,
  BTabs,
  VBTooltip,
} from 'bootstrap-vue'
import JSZip from 'jszip'
import { saveAs } from '@/lib/file-saver'

import { createCSVContent, createShortNameFromPeriod } from '@/utils/bulletin'
import MoreMenu from '@/components/more-menu'

import {
  baseChartOptions,
  createSeries,
  createXAxis,
  BANDS1,
  BANDS2,
} from '@/components/echarts/chart-options/seismic/rsam'

import {
  StatsPanelPeriod,
  StatsPanelTable,
} from '@/components/sidepanel/panel/stats'
import { SidepanelTabs, SidepanelTab } from '@/components/sidepanel'

import { getStatsInfo } from '@/components/echarts/chart-options/seismic/rsam/utils'

import DChart from '@/components/echarts/chart/DChart'
import ErrorMessage from '@/components/error-message'
import RangeSelector from '@/components/range-selector'
import EventAnnotation from '@/components/event-annotation'
import chartMixin from '@/components/mixins/charts'

import { toUnixMiliSeconds } from '@/utils/series'

import rangeSelector, {
  maxCustomDuration,
} from '@/store/seismic/rsam/range-selector'

import {
  SET_END_TIME,
  SET_PERIOD,
  SET_START_TIME,
  SET_ANNOTATION_OPTIONS,
} from '@/store/base/mutations'
import { UPDATE_ANNOTATIONS } from '@/store/base/actions'
import { UPDATE_RSAM } from '@/store/seismic/rsam/actions'
import { SET_STATION } from '@/store/seismic/rsam/mutations'
import stationOptions from '@/store/seismic/rsam/station-options'
import fieldOptions from '@/store/seismic/rsam/field-options'
import { TimelineIcon } from '@/components/icons/content'

const NAMESPACE = 'seismic/rsam'

export default {
  name: 'RsamView',
  components: {
    BCard,
    BDropdownItem,
    BFormSelect,
    BLink,
    BTab,
    BTabs,
    DChart,
    ErrorMessage,
    EventAnnotation,
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
      tab: 0,
      rangeSelector,
      maxCustomDuration,
      stationOptions,
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
      station: (state) => state.station,
      annotationOptions: (state) => state.annotationOptions,
      annotations: (state) => state.annotations,
    }),

    ...mapGetters(NAMESPACE, ['rsamBands']),

    chartOptions() {
      const BANDS = this.tab === 0 ? BANDS1 : BANDS2

      const options = {
        baseOption: {
          ...baseChartOptions({ bands: BANDS, title: this.chartTitle }),
          series: createSeries(this.rsamBands, {
            annotations: this.annotations,
            bands: BANDS,
          }),
          xAxis: createXAxis(
            BANDS.length,
            toUnixMiliSeconds(this.startTime),
            toUnixMiliSeconds(this.endTime)
          ),
        },
      }
      return options
    },

    rsamStation: {
      get() {
        return this.station
      },
      set(value) {
        this.setStation(value)
      },
    },

    chartTitle() {
      return stationOptions.find((v) => v.value === this.station).chartTitle
    },

    statsInfo() {
      return getStatsInfo(this.data)
    },
  },
  watch: {
    rsamStation(value) {
      this.update()
    },
  },
  async mounted() {
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
      setAnnotationOptions(commit, options) {
        return commit(NAMESPACE + '/' + SET_ANNOTATION_OPTIONS, options)
      },
      setStation(commit, value) {
        return commit(NAMESPACE + '/' + SET_STATION, value)
      },
    }),

    ...mapActions({
      fetchData(dispatch) {
        return dispatch(NAMESPACE + '/' + UPDATE_RSAM)
      },
      updateAnnotations(dispatch) {
        return dispatch(NAMESPACE + '/' + UPDATE_ANNOTATIONS)
      },
    }),

    async downloadData() {
      const zip = new JSZip()
      zip.file(`${this.station}.csv`, createCSVContent(this.data))

      zip.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(
          content,
          `RSAM-${this.station}-${createShortNameFromPeriod(this.period)}.zip`
        )
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/layout-monkey';

.chart {
  min-height: 850px;
}

.nav-wrapper {
  flex-wrap: nowrap;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

.station-label {
  color: #24292e;
  font-size: 0.875rem;
  font-style: normal;
  opacity: 0.75;
}

@media (max-width: 575.98px) {
  .station-label {
    display: none;
  }
}

@media (min-width: 991.98px) {
  .rsam-stats-panel {
    display: none;
  }
}
</style>
