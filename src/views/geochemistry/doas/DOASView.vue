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
        <div class="d-flex align-items-center flex-wrap mb-3">
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
          <MoreMenu right class="ml-2">
            <BDropdownItem @click="downloadData"> Download Data </BDropdownItem>
          </MoreMenu>
        </div>
      </div>
      <DChart ref="chart" :options="chartOptions" class="chart" manual-update />
    </BCard>
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
</template>

<script>
import { BCard, BLink, BDropdownItem } from 'bootstrap-vue'
import { mapState, mapActions, mapMutations } from 'vuex'

import { saveAs } from '@/lib/file-saver'
import { toUnixMiliSeconds } from '@/utils/series'
import { createCSVContent, createShortNameFromPeriod } from '@/utils/bulletin'
import { TimelineIcon } from '@/components/icons/content'
import MoreMenu from '@/components/more-menu'
import ErrorMessage from '@/components/error-message'
import {
  SidepanelListDivider,
  SidepanelTab,
  SidepanelTabs,
} from '@/components/sidepanel'
import {
  StatsPanelPeriod,
  StatsPanelTable,
} from '@/components/sidepanel/panel/stats'
import RangeSelector from '@/components/range-selector'
import EventAnnotation from '@/components/event-annotation'
import chartMixin from '@/components/mixins/charts'
import DChart from '@/components/echarts/chart/DChart'
import {
  baseChartOptions,
  createXAxis,
  createSeries,
  mediaQuery,
} from '@/components/echarts/chart-options/doas'
import { getStatsInfo } from '@/components/echarts/chart-options/doas/utils'
import rangeSelector, {
  maxCustomDuration,
} from '@/store/geochemistry/doas/range-selector'
import fieldOptions from '@/store/geochemistry/doas/field-options'
import {
  SET_PERIOD,
  SET_START_TIME,
  SET_END_TIME,
  SET_ANNOTATION_OPTIONS,
} from '@/store/base/mutations'
import { UPDATE_ANNOTATIONS } from '@/store/base/actions'
import { UPDATE_DOAS } from '@/store/geochemistry/doas/actions'

export default {
  name: 'WeatherPasarbubarView',
  components: {
    BCard,
    BDropdownItem,
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
  },
  mixins: [chartMixin],
  props: {
    station: {
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
        return state.geochemistry.doas[this.station].data
      },
      error(state) {
        return state.geochemistry.doas[this.station].error
      },
      period(state) {
        return state.geochemistry.doas[this.station].period
      },
      startTime(state) {
        return state.geochemistry.doas[this.station].startTime
      },
      endTime(state) {
        return state.geochemistry.doas[this.station].endTime
      },
      annotationOptions(state) {
        return state.geochemistry.doas[this.station].annotationOptions
      },
      annotations(state) {
        return state.geochemistry.doas[this.station].annotations
      },
    }),
    namespace() {
      return `geochemistry/doas/${this.station}`
    },
    chartOptions() {
      const options = {
        baseOption: {
          ...baseChartOptions(),
          series: createSeries(this.data, {
            annotations: this.annotations,
          }),
          xAxis: createXAxis(
            toUnixMiliSeconds(this.startTime),
            toUnixMiliSeconds(this.endTime)
          ),
        },
        media: mediaQuery,
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
      setAnnotationOptions(commit, options) {
        return commit(this.namespace + '/' + SET_ANNOTATION_OPTIONS, options)
      },
    }),
    ...mapActions({
      fetchData(dispatch) {
        return dispatch(this.namespace + '/' + UPDATE_DOAS)
      },
      updateAnnotations(dispatch) {
        return dispatch(this.namespace + '/' + UPDATE_ANNOTATIONS)
      },
    }),
    async downloadData() {
      const blob = new Blob([createCSVContent(this.data)], {
        type: 'text/csv;charset=utf-8',
      })
      saveAs(
        blob,
        `doas-${this.station}-${createShortNameFromPeriod(this.period)}.csv`
      )
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/layout-monkey';

.chart {
  height: 500px;
}

@media (min-width: 991.98px) {
  .bot-panel {
    display: none;
  }
}
</style>
