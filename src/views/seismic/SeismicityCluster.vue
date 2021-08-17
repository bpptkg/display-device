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

    <BCard v-show="!error" class="chart-container">
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
      <DChart ref="chart" :options="chartOptions" class="chart" manual-update />
    </BCard>

    <DNote>
      &mdash; Seismicity cluster is still experimental and the results may be
      inaccurate.
    </DNote>

    <div class="bot-panel mt-3">
      <BCard title="Statistics" title-tag="h6">
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
</template>

<script>
/**
 * TODO(indra): Most of this code is a duplicate of Seismicity component. We
 * just use it and modify some codes to quickly make it works. We are in
 * progress to refactor the Seismicity component to be more generic and
 * reuseable.
 */
import moment from 'moment'
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import {
  BCard,
  BFormSelect,
  BLink,
  BDropdownItem,
  VBTooltip,
} from 'bootstrap-vue'

import { DATE_FORMAT } from '@/constants/date'
import { SamplingTypes } from '@/constants/seismicity'
import { toUnixMiliSeconds } from '@/utils/series'
import { createCSVContent } from '@/utils/bulletin'

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
import EventAnnotation from '@/components/event-annotation'
import chartMixin from '@/components/mixins/charts'
import DNote from '@/components/base/note/DNote'

import {
  baseChartOptions,
  createSeries,
  createXAxis,
  mediaQuery,
  tooltipFormatter,
} from '@/components/echarts/chart-options/seismic/seismicity'
import { getStatsInfo } from '@/components/echarts/chart-options/seismic/seismicity/utils'
import eventTypes from '@/components/echarts/chart-options/seismic/seismicity/event-types'

import rangeSelector, {
  maxCustomDuration,
} from '@/store/seismic/seismicity/range-selector'
import rangeSelectorHour, {
  maxCustomDuration as maxCustomDurationHour,
} from '@/store/seismic/seismicity/range-selector-hour'

import {
  SET_END_TIME,
  SET_PERIOD,
  SET_START_TIME,
  SET_ANNOTATION_OPTIONS,
} from '@/store/base/mutations'
import { UPDATE_ANNOTATIONS } from '@/store/base/actions'
import { SET_SAMPLING } from '@/store/seismic/seismicity/mutations'
import { UPDATE_SEISMICITY_CLUSTER } from '@/store/seismic/seismicity/actions'
import fieldOptions from '@/store/seismic/seismicity/field-options'
import fieldOptionsHour from '@/store/seismic/seismicity/field-options-hour'

const NAMESPACE = 'seismic/seismicityCluster'

export default {
  name: 'SeismicityCluster',
  components: {
    BCard,
    BFormSelect,
    BLink,
    DChart,
    ErrorMessage,
    EventAnnotation,
    RangeSelector,
    SidepanelListDivider,
    SidepanelTab,
    SidepanelTabs,
    StatsPanelPeriod,
    StatsPanelTable,
    MoreMenu,
    BDropdownItem,
    DNote,
  },
  directives: {
    'b-tooltip': VBTooltip,
  },
  mixins: [chartMixin],
  data() {
    return {
      samplingOptions: [
        { value: SamplingTypes.DAY, text: 'Day' },
        { value: SamplingTypes.HOUR, text: 'Hour' },
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
    ...mapGetters(NAMESPACE, ['eventItems', 'duration']),
    sampling: {
      get() {
        return this.$store.state.seismic.seismicity.sampling
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
    chartOptions() {
      const options = {
        baseOption: {
          ...baseChartOptions(),
          series: createSeries(this.data, {
            annotations: this.annotations,
          }),
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'line',
              lineStyle: {
                type: 'dashed',
              },
            },
            formatter: tooltipFormatter(this.sampling),
          },
          xAxis: createXAxis(
            eventTypes.length,
            toUnixMiliSeconds(
              this.sampling === SamplingTypes.DAY
                ? moment(this.startTime.format(DATE_FORMAT))
                : this.startTime
            ),
            toUnixMiliSeconds(this.endTime)
          ),
        },
        media: mediaQuery,
      }
      return options
    },
    statsInfo() {
      return getStatsInfo(this.data, this.duration, this.sampling)
    },
  },
  watch: {
    sampling(value) {
      const period = this.rangeSelector[0]
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
    }),
    ...mapActions({
      fetchData(dispatch) {
        return dispatch(NAMESPACE + '/' + UPDATE_SEISMICITY_CLUSTER)
      },
      updateAnnotations(dispatch) {
        return dispatch(NAMESPACE + '/' + UPDATE_ANNOTATIONS)
      },
    }),
    async downloadData() {
      const doDownloadAsync = async (data, exportFilename) => {
        const blob = new Blob([createCSVContent(data)], {
          type: 'text/csv;charset=utf-8',
        })

        if (navigator.msSaveBlob) {
          navigator.msSaveBlob(blob, exportFilename)
        } else {
          const link = document.createElement('a')
          if (link.download !== undefined) {
            const url = URL.createObjectURL(blob)
            link.setAttribute('href', url)
            link.setAttribute('download', exportFilename)
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
        }
      }

      doDownloadAsync(this.eventItems, 'seismicity-cluster.csv')
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/layout-monkey';

.chart {
  min-height: 700px !important;
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
