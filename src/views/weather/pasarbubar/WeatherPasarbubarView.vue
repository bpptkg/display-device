<template>
  <div>
    <div class="chart-container">
      <RangeSelector
        ref="range-selector"
        class="mb-3"
        size="sm"
        custom-enabled
        :selected="period"
        :items="rangeSelector"
        :max-custom-duration="maxCustomDuration"
        @period-selected="onPeriodChange"
      />
      <RainfallChart ref="rainfallChart" class="mb-3" />
      <PressureChart ref="pressureChart" class="mb-3" />
      <WindRoseChart class="mb-3" />
    </div>

    <SidepanelTabs v-model="tabIndex" sidepanel-class="secondary-nav">
      <SidepanelTab
        title="Statistics"
        :icon="TimelineIcon"
        no-body
        :active="tabIndex === 0"
      >
        <WeatherPasarbubarStats />
      </SidepanelTab>

      <SidepanelTab
        title="Rainfall Information"
        :icon="InfoIcon"
        no-body
        :active="tabIndex === 1"
      >
        <RainfallInfo />
      </SidepanelTab>
    </SidepanelTabs>

    <WeatherPasarbubarBotPanelStats />
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { DateRangeTypes } from '@/constants/date'
import { InfoIcon, TimelineIcon } from '@/components/icons/content'
import { SidepanelTabs, SidepanelTab } from '@/components/sidepanel'
import RangeSelector from '@/components/range-selector'

import rangeSelector, {
  maxCustomDuration,
} from '@/store/weather/pasarbubar/rainfall/range-selector'
import {
  SET_PERIOD,
  SET_START_TIME,
  SET_END_TIME,
} from '@/store/base/mutations'
import { NAMESPACE as RAINFALL_NAMESPACE } from '@/store/weather/pasarbubar/rainfall'
import { NAMESPACE as WINDROSE_NAMESPACE } from '@/store/weather/pasarbubar/wind-rose'
import { UPDATE_METEOROLOGY } from '@/store/weather/pasarbubar/rainfall/actions'
import { UPDATE_WIND_ROSE } from '@/store/weather/pasarbubar/wind-rose/actions'

import PressureChart from './PressureChart'
import RainfallChart from './RainfallChart'
import RainfallInfo from './RainfallInfo'
import WeatherPasarbubarStats from './WeatherPasarbubarStats'
import WeatherPasarbubarBotPanelStats from './WeatherPasarbubarBotPanelStats'
import WindRoseChart from './WindRoseChart'

export default {
  name: 'WeatherPasarbubarView',
  components: {
    PressureChart,
    RainfallChart,
    RainfallInfo,
    RangeSelector,
    SidepanelTab,
    SidepanelTabs,
    WeatherPasarbubarStats,
    WeatherPasarbubarBotPanelStats,
    WindRoseChart,
  },
  data() {
    return {
      InfoIcon,
      maxCustomDuration,
      rangeSelector,
      tabIndex: 0,
      TimelineIcon,
    }
  },
  computed: {
    ...mapState(RAINFALL_NAMESPACE, {
      period: (state) => state.period,
    }),
  },
  mounted() {
    this.update()
  },
  methods: {
    ...mapMutations({
      setPeriod(commit, namespace, period) {
        return commit(namespace + '/' + SET_PERIOD, period)
      },
      setStartTime(commit, namespace, value) {
        return commit(namespace + '/' + SET_START_TIME, value)
      },
      setEndTime(commit, namespace, value) {
        return commit(namespace + '/' + SET_END_TIME, value)
      },
    }),
    ...mapActions({
      fetchMeteoData(dispatch) {
        return dispatch(RAINFALL_NAMESPACE + '/' + UPDATE_METEOROLOGY)
      },
      fetchWindRoseData(dispatch) {
        return dispatch(WINDROSE_NAMESPACE + '/' + UPDATE_WIND_ROSE)
      },
    }),
    update() {
      const rainfallChart = this.$refs.rainfallChart
      const pressureChart = this.$refs.pressureChart

      rainfallChart.clear()
      pressureChart.clear()
      rainfallChart.showLoading()
      pressureChart.showLoading()

      this.fetchMeteoData().finally(() => {
        rainfallChart.hideLoading()
        pressureChart.hideLoading()
      })

      this.fetchWindRoseData()
    },
    onPeriodChange(period, { startTime, endTime }) {
      const namespaces = [RAINFALL_NAMESPACE, WINDROSE_NAMESPACE]

      if (period.type === DateRangeTypes.CUSTOM) {
        namespaces.forEach((namespace) => {
          this.setPeriod(namespace, period)
          this.setStartTime(namespace, startTime)
          this.setEndTime(namespace, endTime)
        })
        this.update()
      } else {
        namespaces.forEach((namespace) => {
          this.setPeriod(namespace, period)
        })
        this.update()
      }
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/layout-monkey';
</style>
