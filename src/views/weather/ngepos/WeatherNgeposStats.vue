<template>
  <div>
    <StatsPanelPeriod :start="startTime" :end="endTime" />
    <SidepanelListDivider />
    <StatsPanelTable
      :fields="fieldOptions"
      :items="statsInfo"
      scrollable
      show-no-data-label
    />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { SidepanelListDivider } from '@/components/sidepanel'
import {
  StatsPanelPeriod,
  StatsPanelTable,
} from '@/components/sidepanel/panel/stats'
import { getStatsInfo } from '@/components/echarts/chart-options/weather-ngepos/utils'

import { NAMESPACE } from '@/store/weather/ngepos/rainfall'
import fieldOptions from '@/store/weather/ngepos/rainfall/field-options'

export default {
  name: 'WeatherNgeposStats',
  components: {
    SidepanelListDivider,
    StatsPanelPeriod,
    StatsPanelTable,
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
