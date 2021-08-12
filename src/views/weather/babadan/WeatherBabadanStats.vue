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
import { mapState } from 'vuex'
import { SidepanelListDivider } from '@/components/sidepanel'
import {
  StatsPanelPeriod,
  StatsPanelTable,
} from '@/components/sidepanel/panel/stats'
import { getStatsInfo } from '@/components/echarts/chart-options/weather-babadan/utils'

import { NAMESPACE } from '@/store/weather/babadan/rainfall'
import fieldOptions from '@/store/weather/babadan/rainfall/field-options'

export default {
  name: 'WeatherBabadanStats',
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
    statsInfo() {
      return getStatsInfo(this.data)
    },
  },
}
</script>
