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
import { getStatsInfo } from '@/components/echarts/chart-options/gps/baseline/utils'
import fieldOptions from '@/store/gps/baseline/field-options'

export default {
  name: 'GPSBaselineStats',
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
    return { fieldOptions }
  },
  computed: {
    ...mapState({
      data(state) {
        return state.gps.baseline[this.station].data
      },
      references(state) {
        return state.gps.baseline[this.station].references
      },
      startTime(state) {
        return state.gps.baseline[this.station].startTime
      },
      endTime(state) {
        return state.gps.baseline[this.station].endTime
      },
    }),
    namespace() {
      return `gps/baseline/${this.station}`
    },
    statsInfo() {
      return getStatsInfo(this.data, this.references)
    },
  },
}
</script>
