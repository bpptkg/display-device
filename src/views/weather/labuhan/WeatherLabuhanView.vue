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
    </div>

    <SidepanelTabs v-model="tabIndex" sidepanel-class="secondary-nav">
      <SidepanelTab
        title="Statistics"
        :icon="TimelineIcon"
        no-body
        :active="tabIndex === 0"
      >
        <WeatherLabuhanStats />
      </SidepanelTab>
    </SidepanelTabs>

    <WeatherLabuhanBotPanelStats />
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
} from '@/store/weather/labuhan/rainfall/range-selector'
import {
  SET_PERIOD,
  SET_START_TIME,
  SET_END_TIME,
} from '@/store/base/mutations'
import { NAMESPACE as RAINFALL_NAMESPACE } from '@/store/weather/labuhan/rainfall'
import { UPDATE_METEOROLOGY } from '@/store/weather/labuhan/rainfall/actions'

import PressureChart from './PressureChart'
import RainfallChart from './RainfallChart'
import WeatherLabuhanStats from './WeatherLabuhanStats'
import WeatherLabuhanBotPanelStats from './WeatherLabuhanBotPanelStats'

export default {
  name: 'WeatherLabuhanView',
  components: {
    PressureChart,
    RainfallChart,
    RangeSelector,
    SidepanelTab,
    SidepanelTabs,
    WeatherLabuhanBotPanelStats,
    WeatherLabuhanStats,
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
      data: (state) => state.data,
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
    },
    onPeriodChange(period, { startTime, endTime }) {
      const namespaces = [RAINFALL_NAMESPACE]

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
