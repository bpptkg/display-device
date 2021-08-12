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
import { FIELDS } from '@/constants/gps'
import { StatisticalInfo } from '@/constants/stats'
import { StatisticalInformation } from '@/utils/statistics'
import { SidepanelListDivider } from '@/components/sidepanel'
import {
  StatsPanelPeriod,
  StatsPanelTable,
} from '@/components/sidepanel/panel/stats'
import fieldOptions from '@/store/gps/coordinate/field-options'

export default {
  name: 'GPSCoordinateStats',
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
        return state.gps.coordinate[this.station].data
      },
      startTime(state) {
        return state.gps.coordinate[this.station].startTime
      },
      endTime(state) {
        return state.gps.coordinate[this.station].endTime
      },
    }),
    namespace() {
      return `gps/coordinate/${this.station}`
    },
    statsInfo() {
      const stats = new StatisticalInformation(
        this.data.filter((v) => v.east > 0 && (v.north > 0) & (v.up > 0)),
        { featureName: true }
      )
      return stats.getInfo(
        [StatisticalInfo.MIN, StatisticalInfo.MAX, StatisticalInfo.MEAN],
        FIELDS.east,
        FIELDS.north,
        FIELDS.up
      )
    },
  },
}
</script>
