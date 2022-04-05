<template>
  <BContainer>
    <div class="view">
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
          class="
            d-flex
            justify-content-between
            align-items-center
            flex-wrap
            mb-3
          "
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

        <DChart
          ref="chart"
          class="chart"
          :options="chartOptions"
          manual-update
        />
      </div>
    </div>
  </BContainer>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { BLink, BDropdownItem, BContainer } from 'bootstrap-vue'
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

const NAMESPACE = 'magnetic/imogiri'

export default {
  name: 'MagneticImogiriView',
  components: {
    BContainer,
    BDropdownItem,
    BLink,
    DChart,
    ErrorMessage,
    MoreMenu,
    RangeSelector,
  },
  mixins: [chartMixin],
  data() {
    return {
      maxCustomDuration,
      rangeSelector,
    }
  },
  computed: {
    ...mapState(NAMESPACE, {
      data: (state) => state.data,
      period: (state) => state.period,
      error: (state) => state.error,
      startTime: (state) => state.startTime,
      endTime: (state) => state.endTime,
    }),

    chartOptions() {
      const options = {
        baseOption: {
          ...baseChartOptions,
          series: createSeries(this.data),
          xAxis: createXAxis(
            toUnixMiliSeconds(this.startTime),
            toUnixMiliSeconds(this.endTime)
          ),
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
        return dispatch(NAMESPACE + '/' + UPDATE_MAGNETIC)
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
        `magnetic-imogiri-${createShortNameFromPeriod(this.period)}.csv`
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
