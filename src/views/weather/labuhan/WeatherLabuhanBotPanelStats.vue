<template>
  <div class="bot-panel mt-3">
    <BCard title="Statistics" title-tag="h6">
      <StatsPanelPeriod :start="startTime" :end="endTime" />
      <StatsPanelTable
        :fields="fieldOptions"
        :items="statsInfo"
        scrollable
        show-no-data-label
      />
    </BCard>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { BCard } from 'bootstrap-vue'
import {
  StatsPanelPeriod,
  StatsPanelTable,
} from '@/components/sidepanel/panel/stats'
import { getStatsInfo } from '@/components/echarts/chart-options/weather-labuhan/utils'

import { NAMESPACE } from '@/store/weather/labuhan/rainfall'
import fieldOptions from '@/store/weather/labuhan/rainfall/field-options'

export default {
  name: 'WeatherLabuhanBotPanelStats',
  components: {
    StatsPanelPeriod,
    StatsPanelTable,
    BCard,
  },
  data() {
    return {
      fieldOptions,
    }
  },
  computed: {
    ...mapState(NAMESPACE, {
      startTime: (state) => state.startTime,
      endTime: (state) => state.endTime,
      data: (state) => state.data,
    }),
    ...mapGetters(NAMESPACE, ['rainfallData']),
    statsInfo() {
      return getStatsInfo(this.rainfallData)
    },
  },
}
</script>

<style lang="scss" scoped>
@media (min-width: 991.98px) {
  .bot-panel {
    display: none;
  }
}
</style>
