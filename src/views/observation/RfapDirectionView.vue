<template>
  <div class="content">
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
      </div>

      <BRow>
        <BCol md="6">
          <DChart
            ref="chart"
            class="chart"
            :options="chartOptions"
            manual-update
          />
        </BCol>
        <BCol md="6">
          <DChart
            ref="chartbar"
            class="chart"
            :options="chartOptionsBar"
            manual-update
          />
          <div>
            <BLink @click="toggleXAxisType">
              <small>
                Switch to
                {{ axis === SupportedXAxisType.COUNT ? 'distance' : 'count' }}
                axis
              </small>
            </BLink>
          </div>
        </BCol>
      </BRow>

      <DNote>
        &mdash; RF and AP data on the charts above are obtained from visual
        observation. <br />
      </DNote>
    </div>
  </div>
</template>

<script>
import { BRow, BCol, BLink } from 'bootstrap-vue'
import { mapState, mapActions, mapMutations, mapGetters } from 'vuex'
import ErrorMessage from '@/components/error-message'
import RangeSelector from '@/components/range-selector'
import DChart from '@/components/echarts/chart/DChart'
import DNote from '@/components/base/note/DNote'

import { DateRangeTypes } from '@/constants/date'
import { createPeriodText } from '@/utils/datetime'

import {
  SET_PERIOD,
  SET_START_TIME,
  SET_END_TIME,
} from '@/store/base/mutations'

import {
  baseChartOptions,
  createSeries,
  mediaQuery,
} from '@/components/echarts/chart-options/rfap-direction/rose'
import {
  baseChartOptions as baseChartOptionsBar,
  SupportedXAxisType,
} from '@/components/echarts/chart-options/rfap-direction/bar'

import { NAMESPACE } from '@/store/rfap-direction'
import { UPDATE_DATA } from '@/store/rfap-direction/actions'
import rangeSelector, {
  maxCustomDuration,
} from '@/store/rfap-direction/range-selector'

export default {
  name: 'RfapDirectionView',
  components: {
    RangeSelector,
    ErrorMessage,
    DChart,
    DNote,
    BRow,
    BCol,
    BLink,
  },
  data() {
    return {
      maxCustomDuration,
      rangeSelector,
      SupportedXAxisType,
      axis: SupportedXAxisType.COUNT,
    }
  },
  computed: {
    ...mapState({
      data: (state) => state.rfapDirection.data,
      error: (state) => state.rfapDirection.error,
      period: (state) => state.rfapDirection.period,
      startTime: (state) => state.rfapDirection.startTime,
      endTime: (state) => state.rfapDirection.endTime,
    }),
    ...mapGetters(NAMESPACE, ['rfapDirectionGroup', 'rfapDirectionSorted']),

    chartOptions() {
      return {
        baseOption: {
          ...baseChartOptions({
            title: { subtext: createPeriodText(this.startTime, this.endTime) },
          }),
          series: createSeries(this.rfapDirectionGroup),
        },
        media: mediaQuery(),
      }
    },

    chartOptionsBar() {
      return {
        baseOption: {
          ...baseChartOptionsBar(this.data, {
            axis: this.axis,
            title: { subtext: createPeriodText(this.startTime, this.endTime) },
          }),
        },
        media: [
          {
            query: {
              maxWidth: 575.98,
            },
            option: {
              grid: { left: 90 },
            },
          },
        ],
      }
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
        return dispatch(NAMESPACE + '/' + UPDATE_DATA)
      },
    }),

    update() {
      const chart = this.$refs.chart.$refs.chart
      const chartbar = this.$refs.chartbar.$refs.chart

      chart.clear()
      chartbar.clear()

      chart.showLoading()
      chartbar.showLoading()

      this.fetchData().finally(() => {
        chart.hideLoading()
        chartbar.hideLoading()

        chart.mergeOptions(this.chartOptions)
        chartbar.mergeOptions(this.chartOptionsBar)
      })
    },

    onPeriodChange(period, { startTime, endTime }) {
      if (period.type === DateRangeTypes.CUSTOM) {
        this.setPeriod(period)
        this.setStartTime(startTime)
        this.setEndTime(endTime)
        this.update()
      } else {
        this.setPeriod(period)
        this.update()
      }
    },

    toggleXAxisType() {
      if (this.axis === SupportedXAxisType.COUNT) {
        this.axis = SupportedXAxisType.DISTANCE
      } else {
        this.axis = SupportedXAxisType.COUNT
      }

      const chart = this.$refs.chartbar.$refs.chart
      chart.clear()
      chart.mergeOptions(this.chartOptionsBar)
    },
  },
}
</script>

<style lang="scss" scoped>
.content {
  margin-bottom: 50px;
  right: 0;
}

@media (max-width: 991.98px) {
  .content {
    margin-left: 15px;
    margin-right: 15px;
    margin-top: 60px;
  }
}

@media (min-width: 992px) {
  .content {
    left: 200px;
    padding: 1rem 1.25rem;
    position: absolute;
    top: 50px;
  }
}
</style>
