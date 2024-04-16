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
          ref="visibilityChart"
          :options="visibilityChartOptions"
          class="chart"
          manual-update
        />
      </BCard>

      <BCard class="mt-3">
        <DChart
          ref="weatherChart"
          :options="weatherChartOptions"
          class="chart"
          manual-update
        />
      </BCard>

      <BCard class="mt-3">
        <DChart
          ref="smokeChart"
          :options="smokeChartOptions"
          class="smoke-chart"
          manual-update
        />
      </BCard>

      <BCard class="mt-3">
        <DChart
          ref="soundChart"
          :options="soundChartOptions"
          class="chart"
          manual-update
        />
      </BCard>

      <BCard class="mt-3">
        <DChart
          ref="staticFireChart"
          :options="staticFireChartOptions"
          class="chart"
          manual-update
        />
      </BCard>

      <BCard class="mt-3">
        <DChart
          ref="shakeChart"
          :options="shakeChartOptions"
          class="chart"
          manual-update
        />
      </BCard>

      <BCard class="mt-3">
        <DChart
          ref="lavaChart"
          :options="lavaChartOptions"
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
  createSoundChart,
  createStaticFireChart,
  createShakeChart,
  createLavaChart,
} from '../../components/echarts/chart-options/visual'
import { getSeriesByIndex } from '../../utils/series'

export default {
  name: 'VisualChart',

  components: {
    DChart,
    RangeSelector,
    BCard,
    BLink,
    ErrorMessage,
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

    soundChartOptions() {
      const rawData = getSeriesByIndex(this.data, DataIndex.SOUND)
      return createSoundChart(rawData)
    },

    staticFireChartOptions() {
      const rawData = getSeriesByIndex(this.data, DataIndex.STATIC_FIRE)
      return createStaticFireChart(rawData)
    },

    shakeChartOptions() {
      const rawData = getSeriesByIndex(this.data, DataIndex.SHAKE)
      return createShakeChart(rawData)
    },

    lavaChartOptions() {
      const rawData = getSeriesByIndex(this.data, DataIndex.LAVA)
      return createLavaChart(rawData)
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

      const soundChart = this.$refs.soundChart.$refs.chart
      soundChart.clear()
      soundChart.showLoading()

      const staticFireChart = this.$refs.staticFireChart.$refs.chart
      staticFireChart.clear()
      staticFireChart.showLoading()

      const shakeChart = this.$refs.shakeChart.$refs.chart
      shakeChart.clear()
      shakeChart.showLoading()

      const lavaChart = this.$refs.lavaChart.$refs.chart
      lavaChart.clear()
      lavaChart.showLoading()

      Promise.all([this.fetchData()]).finally(() => {
        visibilityChart.hideLoading()
        visibilityChart.mergeOptions(this.visibilityChartOptions)

        weatherChart.hideLoading()
        weatherChart.mergeOptions(this.weatherChartOptions)

        smokeChart.hideLoading()
        smokeChart.mergeOptions(this.smokeChartOptions)

        soundChart.hideLoading()
        soundChart.mergeOptions(this.soundChartOptions)

        staticFireChart.hideLoading()
        staticFireChart.mergeOptions(this.staticFireChartOptions)

        shakeChart.hideLoading()
        shakeChart.mergeOptions(this.shakeChartOptions)

        lavaChart.hideLoading()
        lavaChart.mergeOptions(this.lavaChartOptions)
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
