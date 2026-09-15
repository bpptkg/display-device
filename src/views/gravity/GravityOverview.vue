<template>
  <div class="gravity-view">
    <BCard v-if="error">
      <ErrorMessage>
        <p>Unable to load data.</p>
        <p>Error: {{ error.message }}</p>
        <p>
          <BLink @click="update"> Try again </BLink>
        </p>
      </ErrorMessage>
    </BCard>

    <div v-show="!error">
      <div class="d-flex justify-content-between flex-wrap mb-3">
        <div class="d-flex align-items-center">
          <RangeSelector
            ref="range-selector"
            size="sm"
            :custom-enabled="true"
            :selected="period"
            :items="rangeSelector"
            :max-custom-duration="maxCustomDuration"
            @period-selected="onPeriodChange"
            class="form-label"
          />
          <EventAnnotation
            class="ml-2"
            :annotations="annotationOptions"
            @change="handleUpdateAnnotations"
          />
        </div>
        <div class="d-flex align-items-center justify-content-end mt-2">
          <MoreMenu right class="ml-2">
            <BDropdownItem @click="update">Refresh</BDropdownItem>
          </MoreMenu>
        </div>
      </div>
      <DChart
        ref="chart"
        :options="chartOptions"
        :style="{ height: `${chartHeight}px` }"
        class="chart"
        manual-update
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { BCard, BLink, BDropdownItem } from 'bootstrap-vue'

import chartMixins from '@/components/mixins/charts'
import DChart from '@/components/echarts/chart/DChart'
import ErrorMessage from '@/components/error-message'
import EventAnnotation from '@/components/event-annotation'
import MoreMenu from '@/components/more-menu'
import RangeSelector from '@/components/range-selector'

import {
  createGravityOverviewChartOptions,
  getGravityChartHeight,
  getStationTimeRanges,
} from '@/components/echarts/chart-options/gravity/overview'

import { NAMESPACE, UPDATE_GRAVITY } from '@/store/gravity-overview'
import rangeSelector, {
  maxCustomDuration,
} from '@/store/gravity-overview/range-selector'
import {
  SET_PERIOD,
  SET_START_TIME,
  SET_END_TIME,
  SET_ANNOTATION_OPTIONS,
} from '@/store/base/mutations'
import { UPDATE_ANNOTATIONS } from '@/store/base/actions'

export default {
  name: 'GravityOverview',
  components: {
    BCard,
    BLink,
    BDropdownItem,
    DChart,
    ErrorMessage,
    EventAnnotation,
    MoreMenu,
    RangeSelector,
  },
  mixins: [chartMixins],
  data() {
    return {
      maxCustomDuration,
      rangeSelector,
    }
  },
  computed: {
    ...mapState({
      data(state) {
        return state[NAMESPACE].data
      },
      error(state) {
        return state[NAMESPACE].error
      },
      period(state) {
        return state[NAMESPACE].period
      },
      startTime(state) {
        return state[NAMESPACE].startTime
      },
      endTime(state) {
        return state[NAMESPACE].endTime
      },
      annotationOptions(state) {
        return state[NAMESPACE].annotationOptions
      },
      annotations(state) {
        return state[NAMESPACE].annotations
      },
    }),
    chartHeight() {
      return getGravityChartHeight(this.data.length)
    },
    chartOptions() {
      return createGravityOverviewChartOptions({
        data: this.data,
        annotations: this.annotations,
      })
    },
    timeRanges() {
      return getStationTimeRanges(this.data)
    },
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
        return dispatch(NAMESPACE + '/' + UPDATE_GRAVITY)
      },
      updateAnnotations(dispatch) {
        return dispatch(NAMESPACE + '/' + UPDATE_ANNOTATIONS)
      },
    }),
    handleMouseMove(event) {
      const chart = this.$refs.chart && this.$refs.chart.$refs.chart
      const el = this.$refs.chart && this.$refs.chart.$el
      if (!chart || !el) return

      const rect = el.getBoundingClientRect()
      const point = [event.clientX - rect.left, event.clientY - rect.top]

      let matchedGrid = -1
      for (let i = 0; i < this.data.length; i++) {
        if (chart.containPixel({ gridIndex: i }, point)) {
          matchedGrid = i
          break
        }
      }

      if (matchedGrid === -1) {
        this.hideTooltip()
        return
      }

      const xValue = chart.convertFromPixel(
        { xAxisIndex: matchedGrid },
        point[0]
      )
      const range = this.timeRanges[matchedGrid]

      if (!range || xValue < range.min || xValue > range.max) {
        this.hideTooltip()
      }
    },
    hideTooltip() {
      const chart = this.$refs.chart && this.$refs.chart.$refs.chart
      if (chart) {
        chart.dispatchAction({ type: 'hideTip' })
      }
    },
  },
  mounted() {
    this.update()
    const el = this.$refs.chart && this.$refs.chart.$el
    if (el) {
      el.addEventListener('mousemove', this.handleMouseMove)
    }
  },
  beforeDestroy() {
    const el = this.$refs.chart && this.$refs.chart.$el
    if (el) {
      el.removeEventListener('mousemove', this.handleMouseMove)
    }
  },
}
</script>

<style lang="scss" scoped>
.gravity-view {
  margin-top: 60px;
  padding-left: 10px;
  padding-right: 10px;
  margin-bottom: 40px;
}
</style>
