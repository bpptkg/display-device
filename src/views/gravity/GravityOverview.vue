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
          <GravityOverviewFilter
            class="ml-2"
            :items="seriesFilter"
            @change="handleFilterChange"
          />
        </div>
        <div class="d-flex align-items-center justify-content-end mt-2">
          <MoreMenu right class="ml-2">
            <BDropdownItem @click="update">Refresh</BDropdownItem>
          </MoreMenu>
        </div>
      </div>
      <DChart :options="chartOptions" class="chart" ref="chart" manual-update />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { BCard, BLink, BDropdownItem } from 'bootstrap-vue'
import DChart from '../../components/echarts/chart/DChart.vue'
import {
  FETCH_GRAVITY_TIMESERIES,
  NAMESPACE,
  SET_PERIOD,
  SET_START_TIME,
  SET_END_TIME,
  SET_VISIBLE,
} from '../../store/gravity-overview'
import { createGravityOverviewChartOptions } from '../../components/echarts/chart-options/gravity/overview'
import ErrorMessage from '../../components/error-message/ErrorMessage.vue'
import MoreMenu from '../../components/more-menu/MoreMenu.vue'
import rangeSelector, {
  maxCustomDuration,
} from '../../store/gravity-overview/range-selector'
import GravityOverviewFilter from './GravityOverviewFilter.vue'
import RangeSelector from '../../components/range-selector'

export default {
  name: 'GravityOverview',
  components: {
    DChart,
    BCard,
    BLink,
    ErrorMessage,
    BDropdownItem,
    MoreMenu,
    RangeSelector,
    GravityOverviewFilter,
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
      series(state) {
        return state[NAMESPACE].series
      },
    }),
    seriesFilter() {
      return this.data.map((sta) => {
        let isVisible = true
        if (sta.sta_fid in this.series) {
          isVisible = this.series[sta.sta_fid]
        }
        return {
          id: sta.sta_fid,
          name: `${sta.sta} (${sta.sta_fid})`,
          isVisible,
        }
      })
    },
    chartOptions() {
      return this.getChartOptions()
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
      setVisible(commit, data) {
        return commit(NAMESPACE + '/' + SET_VISIBLE, data)
      },
    }),
    ...mapActions({
      fetchGravityTimeSeries(dispatch) {
        return dispatch(NAMESPACE + '/' + FETCH_GRAVITY_TIMESERIES)
      },
    }),
    async update() {
      const chart = this.$refs.chart.$refs.chart
      chart.clear()
      chart.showLoading()

      this.fetchGravityTimeSeries().finally(() => {
        chart.hideLoading()
        chart.mergeOptions(this.getChartOptions())
      })
    },
    onPeriodChange(period, { startTime, endTime }) {
      this.setPeriod(period)
      this.setStartTime(startTime)
      this.setEndTime(endTime)
      this.update()
    },
    handleFilterChange({ id, isVisible }) {
      if (id === '') {
        this.seriesFilter.forEach((f) => {
          this.series[f.id] = isVisible
        })
      } else {
        this.setVisible({ id, isVisible })
      }
      this.refresh()
    },
    refresh() {
      const chart = this.$refs.chart.$refs.chart
      chart.clear()
      chart.mergeOptions(this.getChartOptions())
    },
    getChartOptions() {
      return createGravityOverviewChartOptions({
        data: this.data.filter((sta) => {
          if (sta.sta_fid in this.series) {
            return this.series[sta.sta_fid]
          }
          return true
        }),
      })
    },
  },
  mounted() {
    this.update()
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
.chart {
  min-height: 500px;
}
</style>
