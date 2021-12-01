<template>
  <div class="dirview">
    <div
      class="
        d-flex
        justify-content-between
        align-items-end
        flex-wrap
        toolbar-sticky
        mb-3
      "
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
      <BCol md="6" class="mb-2">
        <div v-if="error">
          <ErrorMessage>
            <p>Unable to load the chart.</p>
            <p>Error: {{ error.message }}</p>
            <p>
              <BLink @click="update">Try again</BLink>
            </p>
          </ErrorMessage>
        </div>

        <div v-show="!error">
          <DChart
            ref="chart"
            class="chart"
            :options="chartOptions"
            manual-update
          />
        </div>
      </BCol>
      <BCol md="6">
        <div v-if="error">
          <ErrorMessage>
            <p>Unable to load the chart.</p>
            <p>Error: {{ error.message }}</p>
            <p>
              <BLink @click="update">Try again</BLink>
            </p>
          </ErrorMessage>
        </div>

        <div v-show="!error">
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
        </div>
      </BCol>
    </BRow>
    <BRow class="mt-3">
      <BCol>
        <div v-if="serror">
          <ErrorMessage>
            <p>Unable to load the chart.</p>
            <p>Error: {{ serror.message }}</p>
            <p>
              <BLink @click="updatestack">Try again</BLink>
            </p>
          </ErrorMessage>
        </div>

        <div v-show="!serror">
          <DChart
            ref="chartstack"
            class="chart"
            theme="tab20"
            :options="chartOptionsStack"
            manual-update
          />
          <div class="mt-2">
            <BLink @click="switchDirectionStack">
              <small>
                Show direction as
                {{ useDirectionGroup ? 'item' : 'group' }}
              </small>
            </BLink>
          </div>
        </div>
      </BCol>
    </BRow>

    <DNote class="mt-3">
      &mdash; RF and AP data on the charts above are obtained from visual
      observation. <br />
      &mdash; {{ directionNote }}. <br />
    </DNote>
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
import { toUnixMiliSeconds } from '@/utils/series'

import {
  SET_PERIOD,
  SET_START_TIME,
  SET_END_TIME,
} from '@/store/base/mutations'
import { UPDATE_DATA } from '@/store/base/actions'

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
import rangeSelector, {
  maxCustomDuration,
} from '@/store/rfap-direction/range-selector'

// Stack data.
import {
  baseChartOptions as baseChartOptionsStack,
  createSeries as createSeriesStack,
  createXAxis as createXAxisStack,
  mediaQuery as mediaQueryStack,
  createDirectionNote,
} from '@/components/echarts/chart-options/rfap-distdir'
import { NAMESPACE as NAMESPACE_STACK } from '@/store/rfap-distdir'

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
      directionNote: createDirectionNote(),
      useDirectionGroup: false,
    }
  },
  computed: {
    ...mapState({
      data: (state) => state.rfapDirection.data,
      error: (state) => state.rfapDirection.error,
      period: (state) => state.rfapDirection.period,
      startTime: (state) => state.rfapDirection.startTime,
      endTime: (state) => state.rfapDirection.endTime,
      // Stack data.
      sdata: (state) => state.rfapDistdir.data,
      serror: (state) => state.rfapDistdir.error,
      speriod: (state) => state.rfapDistdir.period,
      sstartTime: (state) => state.rfapDistdir.startTime,
      sendTime: (state) => state.rfapDistdir.endTime,
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

    chartOptionsStack() {
      return {
        baseOption: {
          ...baseChartOptionsStack(),
          series: createSeriesStack(this.sdata, {
            useDirectionGroup: this.useDirectionGroup,
          }),
          xAxis: createXAxisStack(
            toUnixMiliSeconds(this.sstartTime),
            toUnixMiliSeconds(this.sendTime)
          ),
        },
        media: mediaQueryStack(),
      }
    },
  },

  async mounted() {
    this.update()
    this.updatestack()
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
      // Stack data.
      ssetPeriod(commit, period) {
        return commit(NAMESPACE_STACK + '/' + SET_PERIOD, period)
      },
      ssetStartTime(commit, value) {
        return commit(NAMESPACE_STACK + '/' + SET_START_TIME, value)
      },
      ssetEndTime(commit, value) {
        return commit(NAMESPACE_STACK + '/' + SET_END_TIME, value)
      },
    }),

    ...mapActions({
      fetchData(dispatch) {
        return dispatch(NAMESPACE + '/' + UPDATE_DATA)
      },
      fetchDataStack(dispatch) {
        return dispatch(NAMESPACE_STACK + '/' + UPDATE_DATA)
      },
    }),

    async update() {
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

    async updatestack() {
      const chartstack = this.$refs.chartstack.$refs.chart
      chartstack.clear()
      chartstack.showLoading()
      this.fetchDataStack().finally(() => {
        chartstack.hideLoading()
        chartstack.mergeOptions(this.chartOptionsStack)
      })
    },

    onPeriodChange(period, { startTime, endTime }) {
      if (period.type === DateRangeTypes.CUSTOM) {
        this.setPeriod(period)
        this.setStartTime(startTime)
        this.setEndTime(endTime)
        this.update()

        // Stack data.
        this.ssetPeriod(period)
        this.ssetStartTime(startTime)
        this.ssetEndTime(endTime)
        this.updatestack()
      } else {
        this.setPeriod(period)
        this.update()
        // Stack data.
        this.ssetPeriod(period)
        this.updatestack()
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

    async switchDirectionStack() {
      const chart = this.$refs.chartstack.$refs.chart
      chart.clear()
      chart.showLoading()
      this.useDirectionGroup = !this.useDirectionGroup

      setTimeout(() => {
        chart.hideLoading()
        chart.mergeOptions(this.chartOptionsStack)
      }, 250)
    },

    async updateAll() {
      this.update()
      this.updatestack()
    },
  },
}
</script>

<style lang="scss" scoped>
.dirview {
  margin-bottom: 50px;
  right: 0;
}

.toolbar-sticky {
  position: sticky;
  height: 40px;
  top: 50px;
  z-index: 999;
  background-color: #fff;
}

@media (max-width: 991.98px) {
  .dirview {
    top: 50px;
    margin-left: 10px;
    margin-right: 10px;
    position: absolute;
  }
}

@media (min-width: 992px) {
  .dirview {
    left: 200px;
    padding: 0 1.25rem 1rem 1.25rem;
    position: absolute;
    top: 50px;
  }
}
</style>
