<template>
  <div class="content">
    <div class="chart-view">
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
            <div class="d-flex align-items-center">
              <span class="sampling-label mr-1">Sampling:</span>
              <BFormSelect
                v-model="sampling"
                size="sm"
                :options="samplingOptions"
              />
            </div>
            <MoreMenu right class="ml-2">
              <BDropdownItem @click="downloadData">
                Download Data
              </BDropdownItem>
            </MoreMenu>
          </div>
        </div>

        <DChart
          ref="chart"
          class="chart"
          :options="chartOptions"
          manual-update
        />

        <DNote>
          &mdash; RF and AP data on the chart above are obtained from visual
          observation. <br />
        </DNote>

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
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { BCard, BDropdownItem, BFormSelect, BLink } from 'bootstrap-vue'

import { saveAs } from '@/lib/file-saver'
import { toUnixMiliSeconds } from '@/utils/series'

import {
  SidepanelListDivider,
  SidepanelTab,
  SidepanelTabs,
} from '@/components/sidepanel'
import {
  StatsPanelPeriod,
  StatsPanelTable,
} from '@/components/sidepanel/panel/stats'

import DNote from '@/components/base/note/DNote'
import ErrorMessage from '@/components/error-message'
import RangeSelector from '@/components/range-selector'
import DChart from '@/components/echarts/chart/DChart'
import MoreMenu from '@/components/more-menu'
import chartMixin from '@/components/mixins/charts'
import { createCSVContent, createShortNameFromPeriod } from '@/utils/bulletin'
import { TimelineIcon } from '@/components/icons/content'

import { Sampling } from '@/constants/rfap-distance'
import {
  baseChartOptions,
  createSeries,
  createXAxis,
  mediaQuery,
} from '@/components/echarts/chart-options/rfap-distance'
import { getStatsInfo } from '@/components/echarts/chart-options/rfap-distance/utils'
import rangeSelectorDay, {
  maxCustomDuration as maxCustomDurationDay,
} from '@/store/rfap-distance/range-selector'
import rangeSelectorHour, {
  maxCustomDuration as maxCustomDurationHour,
} from '@/store/rfap-distance/range-selector-hour'
import fieldOptions from '@/store/rfap-distance/field-options'
import {
  SET_PERIOD,
  SET_START_TIME,
  SET_END_TIME,
} from '@/store/base/mutations'
import { SET_SAMPLING } from '@/store/rfap-distance/mutations'
import { NAMESPACE } from '@/store/rfap-distance'
import { UPDATE_DATA } from '@/store/rfap-distance/actions'

export default {
  name: 'RfapDistanceView',
  components: {
    BCard,
    BDropdownItem,
    BFormSelect,
    BLink,
    DChart,
    DNote,
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
  data() {
    return {
      fieldOptions,
      samplingOptions: [
        { value: Sampling.DAY, text: 'Daily' },
        { value: Sampling.HOUR, text: 'Hourly' },
      ],
      TimelineIcon,
    }
  },
  computed: {
    ...mapState({
      data: (state) => state.rfapDistance.data,
      error: (state) => state.rfapDistance.error,
      period: (state) => state.rfapDistance.period,
      startTime: (state) => state.rfapDistance.startTime,
      endTime: (state) => state.rfapDistance.endTime,
    }),

    sampling: {
      get: function () {
        return this.$store.state.rfapDistance.sampling
      },
      set: function (value) {
        this.setSampling(value)
      },
    },

    rangeSelector() {
      return this.sampling === Sampling.DAY
        ? rangeSelectorDay
        : rangeSelectorHour
    },

    maxCustomDuration() {
      return this.sampling === Sampling.DAY
        ? maxCustomDurationDay
        : maxCustomDurationHour
    },

    chartOptions() {
      const options = {
        baseOption: {
          ...baseChartOptions(this.sampling),
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
      setStartTime(commit, value) {
        return commit(NAMESPACE + '/' + SET_START_TIME, value)
      },
      setEndTime(commit, value) {
        return commit(NAMESPACE + '/' + SET_END_TIME, value)
      },
      setSampling(commit, value) {
        return commit(NAMESPACE + '/' + SET_SAMPLING, value)
      },
    }),

    ...mapActions({
      fetchData(dispatch) {
        return dispatch(NAMESPACE + '/' + UPDATE_DATA)
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
      saveAs(
        blob,
        `rfap-distance-${createShortNameFromPeriod(this.period)}.csv`
      )
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
</style>
