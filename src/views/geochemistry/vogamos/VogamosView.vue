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
      <div class="chart-wrapper">
        <DChart
          ref="chart"
          :options="chartOptions"
          class="chart"
          manual-update
        />
      </div>
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
import JSZip from 'jszip'
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
  createYAxis,
  createSeries,
} from '@/components/echarts/chart-options/vogamos'
import { getStatsInfo } from '@/components/echarts/chart-options/vogamos/utils'
import rangeSelector, {
  maxCustomDuration,
} from '@/store/geochemistry/vogamos/range-selector'
import fieldOptions from '@/store/geochemistry/vogamos/field-options'
import {
  SET_PERIOD,
  SET_START_TIME,
  SET_END_TIME,
  SET_ANNOTATION_OPTIONS,
} from '@/store/base/mutations'
import { UPDATE_ANNOTATIONS } from '@/store/base/actions'
import { UPDATE_EMISSION } from '@/store/geochemistry/vogamos/actions'

const NAMESPACE = 'geochemistry/vogamos'

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
  data() {
    return {
      fieldOptions,
      maxCustomDuration,
      rangeSelector,
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
      annotationOptions: (state) => state.annotationOptions,
      annotations: (state) => state.annotations,
    }),
    chartOptions() {
      const options = {
        ...baseChartOptions(),
        series: createSeries(this.data, {
          annotations: this.annotations,
        }),
        xAxis: createXAxis(
          toUnixMiliSeconds(this.startTime),
          toUnixMiliSeconds(this.endTime)
        ),
        yAxis: createYAxis(),
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
    }),
    ...mapActions({
      fetchData(dispatch) {
        return dispatch(NAMESPACE + '/' + UPDATE_EMISSION)
      },
      updateAnnotations(dispatch) {
        return dispatch(NAMESPACE + '/' + UPDATE_ANNOTATIONS)
      },
    }),
    async downloadData() {
      const zip = new JSZip()
      const names = ['temperature', 'co2']
      this.data.forEach((array, index) => {
        zip.file(`${names[index]}.csv`, createCSVContent(array))
      })

      zip.generateAsync({ type: 'blob' }).then((content) => {
        saveAs(content, `vogamos-${createShortNameFromPeriod(this.period)}.zip`)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/layout-monkey';

.chart {
  min-width: 400px;
  height: 500px;
}

.chart-wrapper {
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

@media (min-width: 991.98px) {
  .bot-panel {
    display: none;
  }
}
</style>
