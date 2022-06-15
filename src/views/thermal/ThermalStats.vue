<template>
  <div>
    <StatsPanelPeriod :start="startTime" :end="endTime" />
    <SidepanelListDivider />
    <StatsPanelTable
      :title="'Max. Temperature (\u00B0C)'"
      :fields="fieldOptions"
      :items="statsInfo"
      scrollable
      show-no-data-label
    />
    <StatsPanelTable
      title="Density (%)"
      :fields="fieldOptions"
      :items="densityStatsInfo"
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
import {
  getStatsInfo,
  getDensityStatsInfo,
} from '@/components/echarts/chart-options/thermal/utils'
import fieldOptions from '@/store/thermal/field-options'

export default {
  name: 'ThermalStats',
  components: {
    SidepanelListDivider,
    StatsPanelPeriod,
    StatsPanelTable,
  },
  props: {
    station: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      fieldOptions,
    }
  },
  computed: {
    ...mapState({
      data(state) {
        return state.thermal[this.station].data
      },
      startTime(state) {
        return state.thermal[this.station].startTime
      },
      endTime(state) {
        return state.thermal[this.station].endTime
      },
    }),
    namespace() {
      return `thermal/${this.station}`
    },
    statsInfo() {
      return getStatsInfo(this.data, this.station)
    },
    densityStatsInfo() {
      return getDensityStatsInfo(this.data, this.station)
    },
  },
}
</script>
