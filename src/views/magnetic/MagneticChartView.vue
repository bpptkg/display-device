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
        <RangeSelector
          ref="range-selector"
          size="sm"
          custom-enabled
          :selected="period"
          :items="rangeSelector"
          :max-custom-duration="maxCustomDuration"
          @period-selected="onPeriodChange"
        />
        <MoreMenu right class="ml-2">
          <BDropdownItem @click="downloadData"> Download Data </BDropdownItem>
        </MoreMenu>
      </div>

      <DChart ref="chart" class="chart" :options="chartOptions" manual-update />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { BLink, BDropdownItem } from 'bootstrap-vue'
import { saveAs } from '@/lib/file-saver'
import { toUnixMiliSeconds } from '@/utils/series'
import { createCSVContent, createShortNameFromPeriod } from '@/utils/bulletin'

import ErrorMessage from '@/components/error-message'
import RangeSelector from '@/components/range-selector'
import DChart from '@/components/echarts/chart/DChart'
import MoreMenu from '@/components/more-menu'
import chartMixin from '@/components/mixins/charts'

import {
  baseChartOptions,
  createSeries,
  createXAxis,
  mediaQuery,
} from '@/components/echarts/chart-options/magnetic'
import rangeSelector, {
  maxCustomDuration,
} from '@/store/magnetic/range-selector'
import { UPDATE_MAGNETIC } from '@/store/magnetic/actions'
import {
  SET_PERIOD,
  SET_START_TIME,
  SET_END_TIME,
} from '@/store/base/mutations'
import stationOptions from '@/store/magnetic/station-options'

export default {
  name: 'MagneticView',
  components: {
    BDropdownItem,
    BLink,
    DChart,
    ErrorMessage,
    MoreMenu,
    RangeSelector,
  },
  mixins: [chartMixin],
  props: {
    station: String,
  },
  data() {
    return {
      maxCustomDuration,
      rangeSelector,
    }
  },
  computed: {
    ...mapState({
      data(state) {
        return state.magnetic[this.station].data
      },
      period(state) {
        return state.magnetic[this.station].period
      },
      error(state) {
        state.magnetic[this.station].error
      },
      startTime(state) {
        return state.magnetic[this.station].startTime
      },
      endTime(state) {
        return state.magnetic[this.station].endTime
      },
    }),

    namespace() {
      return `magnetic/${this.station}`
    },

    chartTitle() {
      return stationOptions.find((v) => v.value === this.station).chartTitle
    },

    chartOptions() {
      const options = {
        baseOption: {
          ...baseChartOptions,
          series: createSeries(this.data),
          xAxis: createXAxis(
            toUnixMiliSeconds(this.startTime),
            toUnixMiliSeconds(this.endTime)
          ),
          title: {
            text: this.chartTitle,
            left: 'center',
            align: 'right',
            textStyle: {
              fontSize: 16,
              fontWeight: 'bold',
            },
            subtextStyle: {
              color: '#363636',
            },
          },
        },
        media: mediaQuery,
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
        return dispatch(this.namespace + '/' + UPDATE_MAGNETIC)
      },
    }),

    updateAnnotations() {
      // This chart doesn't use annotations but this method is called in the
      // chartMixin.
    },

    async downloadData() {
      const blob = new Blob([createCSVContent(this.data)], {
        type: 'text/csv;charset=utf-8',
      })
      saveAs(
        blob,
        `magnetic-${this.station}-${createShortNameFromPeriod(this.period)}.csv`
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.view {
  margin-top: 60px;
}

.chart {
  min-height: 700px !important;
}
</style>
