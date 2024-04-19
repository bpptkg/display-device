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

    <div v-show="!error">
      <div class="d-flex flex-wrap align-items-center mb-3">
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
      </div>

      <BCard>
        <DChart
          ref="smokeChart"
          :options="smokeChartOptions"
          class="chart"
          manual-update
        />
        <div class="d-flex justify-content-center align-items-center flex-wrap">
          <Bar label="Putih" color="#E3E3E3" />
          <Bar class="ml-2" label="Coklat" color="#D2691E" />
          <Bar class="ml-2" label="Kelabu" color="#808080" />
          <Bar class="ml-2" label="Hitam" color="#000000" />
        </div>
      </BCard>

      <BCard class="mt-3">
        <DChart
          ref="visibilityChart"
          :options="visibilityChartOptions"
          class="chart"
          manual-update
        />
        <div class="d-flex justify-content-center align-items-center flex-wrap">
          <Bar label="Tampak" color="blue" />
          <Bar class="ml-2" label="Kabut 01" color="yellow" />
          <Bar class="ml-2" label="Kabut 02" color="green" />
          <Bar class="ml-2" label="Kabut 03" color="red" />
        </div>
      </BCard>

      <BCard class="mt-3">
        <DChart
          ref="weatherChart"
          :options="weatherChartOptions"
          class="chart"
          manual-update
        />
        <div class="d-flex justify-content-center align-items-center flex-wrap">
          <Bar label="Cerah" color="blue" />
          <Bar class="ml-2" label="Berawan" color="yellow" />
          <Bar class="ml-2" label="Mendung" color="green" />
          <Bar class="ml-2" label="Hujan" color="red" />
        </div>
      </BCard>

      <BCard class="mt-3">
        <DChart
          ref="eventsChart"
          :options="eventsChartOptions"
          class="chart"
          manual-update
        />
      </BCard>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { BCard, BLink } from 'bootstrap-vue'
import DChart from '@/components/echarts/chart/DChart'
import RangeSelector from '@/components/range-selector'
import ErrorMessage from '@/components/error-message'

import {
  SET_END_TIME,
  SET_PERIOD,
  SET_START_TIME,
} from '../../store/base/mutations'
import { DateRangeTypes } from '../../constants/date'

import rangeSelector, {
  maxCustomDuration,
} from '../../store/visual/range-selector'
import {
  DataIndex,
  Stations,
  SET_STATION,
  UPDATE_VISUAL,
} from '../../store/visual/index'

import {
  createVisibilityChart,
  createWeatherChart,
  createSmokeChart,
  createEventsChart,
} from '../../components/echarts/chart-options/visual'
import { getSeriesByIndex } from '../../utils/series'
import Bar from '../../components/legend/Bar'

export default {
  name: 'VisualChart',

  components: {
    DChart,
    RangeSelector,
    BCard,
    BLink,
    ErrorMessage,
    Bar,
  },

  props: {
    station: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      stationOptions: Stations,
      rangeSelector,
      maxCustomDuration,
    }
  },

  computed: {
    ...mapState({
      data(state) {
        return state.visual[this.station].data
      },
      error(state) {
        return state.visual[this.station].error
      },
      startTime(state) {
        return state.visual[this.station].startTime
      },
      endTime(state) {
        return state.visual[this.station].endTime
      },
      period(state) {
        return state.visual[this.station].period
      },
    }),

    namespace() {
      return `visual/${this.station}`
    },

    selectedStation: {
      get() {
        return this.station
      },
      set(value) {
        this.setStation(value)
      },
    },

    visibilityChartOptions() {
      const rawData = getSeriesByIndex(this.data, DataIndex.WEATHER)
      return createVisibilityChart(rawData)
    },

    weatherChartOptions() {
      const rawData = getSeriesByIndex(this.data, DataIndex.WEATHER)
      return createWeatherChart(rawData)
    },

    smokeChartOptions() {
      const rawData = getSeriesByIndex(this.data, DataIndex.SMOKE)
      return createSmokeChart(rawData)
    },

    eventsChartOptions() {
      const soundRawData = getSeriesByIndex(this.data, DataIndex.SOUND)
      const staticFireRawData = getSeriesByIndex(
        this.data,
        DataIndex.STATIC_FIRE
      )
      const shakeRawData = getSeriesByIndex(this.data, DataIndex.SHAKE)
      const lavaRawData = getSeriesByIndex(this.data, DataIndex.LAVA)
      return createEventsChart(
        soundRawData,
        staticFireRawData,
        shakeRawData,
        lavaRawData
      )
    },
  },

  methods: {
    ...mapMutations({
      setPeriod(commit, period) {
        return commit(this.namespace + '/' + SET_PERIOD, period)
      },
      setStation(commit, sampling) {
        return commit(this.namespace + '/' + SET_STATION, sampling)
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
        return dispatch(this.namespace + '/' + UPDATE_VISUAL)
      },
    }),

    update() {
      const visibilityChart = this.$refs.visibilityChart.$refs.chart
      visibilityChart.clear()
      visibilityChart.showLoading()

      const weatherChart = this.$refs.weatherChart.$refs.chart
      weatherChart.clear()
      weatherChart.showLoading()

      const smokeChart = this.$refs.smokeChart.$refs.chart
      smokeChart.clear()
      smokeChart.showLoading()

      const eventsChart = this.$refs.eventsChart.$refs.chart
      eventsChart.clear()
      eventsChart.showLoading()

      Promise.all([this.fetchData()]).finally(() => {
        visibilityChart.hideLoading()
        visibilityChart.mergeOptions(this.visibilityChartOptions)

        weatherChart.hideLoading()
        weatherChart.mergeOptions(this.weatherChartOptions)

        smokeChart.hideLoading()
        smokeChart.mergeOptions(this.smokeChartOptions)

        eventsChart.hideLoading()
        eventsChart.mergeOptions(this.eventsChartOptions)
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
  },

  mounted() {
    this.update()
  },
}
</script>

<style lang="scss" scoped>
.chart {
  height: 350px;
}

.smoke-chart {
  height: 400px;
}
</style>
