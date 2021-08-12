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
import { getStatsInfo } from '@/components/echarts/chart-options/tiltmeter/utils'
import fieldOptions from '@/store/tiltmeter/field-options'

export default {
  name: 'TiltmeterStats',
  components: {
    SidepanelListDivider,
    StatsPanelPeriod,
    StatsPanelTable,
  },
  props: {
    type: {
      type: String,
      required: true,
    },
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
        return state.tiltmeter[this.type][this.station].data
      },
      startTime(state) {
        return state.tiltmeter[this.type][this.station].startTime
      },
      endTime(state) {
        return state.tiltmeter[this.type][this.station].endTime
      },
    }),
    namespace() {
      return `tiltmeter/${this.type}/${this.station}`
    },
    statsInfo() {
      return getStatsInfo(this.data)
    },
  },
}
</script>
