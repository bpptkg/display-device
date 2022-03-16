<template>
  <div class="content">
    <BNav tabs class="nav-wrapper">
      <BNavItem
        v-for="event in eventTypes"
        :key="event.code"
        :to="buildUri(event.code)"
        exact-active-class="active"
      >
        {{ event.label }}
      </BNavItem>
    </BNav>

    <BCard v-if="error">
      <ErrorMessage>
        <p>Unable to load data.</p>
        <p>Error: {{ error.message }}</p>
        <p>
          <BLink @click="update"> Try again </BLink>
        </p>
      </ErrorMessage>
    </BCard>

    <BCard v-show="!error" class="chart-container mt-3">
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
      <div v-show="!numClusters">
        <ErrorIcon color="#3c4043" />
        <span>No data available</span>
      </div>
    </BCard>

    <div class="bot-panel mt-3">
      <BCard title="Statistics" title-tag="h6">
        <StatsPanelPeriod
          :start="startTime"
          :end="endTime"
          scrollable
          show-no-data-label
        />
        <SidepanelListDivider />
        <ClusterSidepanelSnippet :cluster-group="clusterGroup" />
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
        <ClusterSidepanelSnippet :cluster-group="clusterGroup" />
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
import JSZip from 'jszip'
import { saveAs } from '@/lib/file-saver'
import {
  BNav,
  BNavItem,
  BCard,
  BFormSelect,
  BLink,
  BDropdownItem,
} from 'bootstrap-vue'
import eventTypes from '@/components/echarts/chart-options/seismic/seismicity/event-types'

import moment from 'moment'
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'

import { ErrorIcon } from '@/components/icons/alert'
import { DATE_FORMAT } from '@/constants/date'
import { SamplingTypes } from '@/constants/seismicity'
import { toUnixMiliSeconds } from '@/utils/series'
import { createCSVContent, createShortNameFromPeriod } from '@/utils/bulletin'

import {
  SidepanelTab,
  SidepanelTabs,
  SidepanelListDivider,
} from '@/components/sidepanel'

import {
  StatsPanelPeriod,
  StatsPanelTable,
} from '@/components/sidepanel/panel/stats'
import { TimelineIcon, SaveAltIcon } from '@/components/icons/content'
import DChart from '@/components/echarts/chart/DChart'
import ErrorMessage from '@/components/error-message'
import RangeSelector from '@/components/range-selector'
import MoreMenu from '@/components/more-menu'
import chartMixin from '@/components/mixins/charts'

import {
  baseChartOptions,
  createSeries,
  createXAxis,
  createLegend,
  mediaQuery,
  tooltipFormatter,
} from '@/components/echarts/chart-options/seismic/cluster/stackedbar'
import { getStatsInfo } from '@/components/echarts/chart-options/seismic/cluster/utils'

import rangeSelector, {
  maxCustomDuration,
} from '@/store/seismic/cluster/range-selector'
import rangeSelectorHour, {
  maxCustomDuration as maxCustomDurationHour,
} from '@/store/seismic/cluster/range-selector-hour'

import {
  SET_END_TIME,
  SET_PERIOD,
  SET_START_TIME,
  SET_ANNOTATION_OPTIONS,
} from '@/store/base/mutations'
import { UPDATE_ANNOTATIONS } from '@/store/base/actions'
import { SET_SAMPLING } from '@/store/seismic/seismicity/mutations'
import { SET_EVENT_TYPE } from '@/store/seismic/cluster/mutations'
import { UPDATE_SEISMICITY } from '@/store/seismic/seismicity/actions'
import fieldOptions from '@/store/seismic/cluster/field-options'
import fieldOptionsHour from '@/store/seismic/cluster/field-options-hour'

// Custom components
import ClusterSidepanelSnippet from './ClusterSidepanelSnippet'

const NAMESPACE = 'seismic/cluster'

export default {
  name: 'ClusterView',
  components: {
    BNav,
    BNavItem,
    BCard,
    BFormSelect,
    BLink,
    DChart,
    ClusterSidepanelSnippet,
    ErrorMessage,
    RangeSelector,
    SidepanelListDivider,
    SidepanelTab,
    SidepanelTabs,
    StatsPanelPeriod,
    StatsPanelTable,
    MoreMenu,
    BDropdownItem,
    ErrorIcon,
  },
  mixins: [chartMixin],
  props: {
    eventType: {
      type: String,
      default: 'VTA',
    },
  },
  data() {
    return {
      interval: null,
      eventTypes,
      samplingOptions: [
        { value: SamplingTypes.DAY, text: 'Daily' },
        { value: SamplingTypes.HOUR, text: 'Hourly' },
      ],
      TimelineIcon,
      SaveAltIcon,
    }
  },
  computed: {
    ...mapState(NAMESPACE, {
      data: (state) => state.data,
      error: (state) => state.error,
      period: (state) => state.period,
      startTime: (state) => state.startTime,
      endTime: (state) => state.endTime,
      annotationOptions: (state) => state.annotationOptions,
      annotations: (state) => state.annotations,
    }),
    ...mapGetters(NAMESPACE, [
      'eventItems',
      'duration',
      'clusterGroup',
      'numClusters',
    ]),
    sampling: {
      get() {
        return this.$store.state.seismic.cluster.sampling
      },
      set(value) {
        this.setSampling(value)
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
    fieldOptions() {
      return this.sampling === SamplingTypes.DAY
        ? fieldOptions
        : fieldOptionsHour
    },
    style() {
      return {
        height: '400px',
      }
    },
    chartOptions() {
      // Return empty options when clusterGroup is empty.
      if (!this.clusterGroup.length) return {}
      const options = {
        baseOption: {
          ...baseChartOptions(),
          series: createSeries(this.clusterGroup),
          legend: createLegend(this.clusterGroup),
          tooltip: {
            trigger: 'item',
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
        media: mediaQuery(),
      }
      return options
    },
    statsInfo() {
      return getStatsInfo(this.clusterGroup, this.duration, this.sampling)
    },
  },
  watch: {
    sampling(value) {
      const period = this.rangeSelector[0]
      this.setPeriod(period)
      this.$refs['range-selector'].setSelectedPeriod(period)
      this.update()
    },
    eventType(value) {
      this.setEventType(value)
      this.update()
    },
  },
  beforeDestroy() {
    if (this.interval !== null) {
      clearInterval(this.interval)
    }
  },
  mounted() {
    this.setEventType(this.eventType)
    this.update()
    this.interval = setInterval(this.update, 900000)
  },
  methods: {
    ...mapMutations({
      setPeriod(commit, period) {
        return commit(NAMESPACE + '/' + SET_PERIOD, period)
      },
      setSampling(commit, sampling) {
        return commit(NAMESPACE + '/' + SET_SAMPLING, sampling)
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
      setEventType(commit, value) {
        return commit(NAMESPACE + '/' + SET_EVENT_TYPE, value)
      },
    }),
    ...mapActions({
      fetchData(dispatch) {
        return dispatch(NAMESPACE + '/' + UPDATE_SEISMICITY)
      },
      updateAnnotations(dispatch) {
        return dispatch(NAMESPACE + '/' + UPDATE_ANNOTATIONS)
      },
    }),
    buildUri(eventType) {
      return `/seismic/cluster?eventType=${eventType}`
    },
    async downloadData() {
      const zip = new JSZip()
      this.clusterGroup.forEach((group, index) => {
        zip.file(`cluster-${group.cluster}.csv`, createCSVContent(group.data))
      })

      zip.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(content, `Cluster-${createShortNameFromPeriod(this.period)}.zip`)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/layout-monkey';

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
