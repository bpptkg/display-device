<template>
  <div class="bot-panel mt-3">
    <BCard title="Statistics" title-tag="h6">
      <StatsPanelPeriod :start="startTime" :end="endTime" />
      <SidepanelListDivider />
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
import { mapState } from 'vuex'
import { BCard } from 'bootstrap-vue'

import { SidepanelListDivider } from '@/components/sidepanel'
import {
  StatsPanelPeriod,
  StatsPanelTable,
} from '@/components/sidepanel/panel/stats'

import { TimelineIcon } from '@/components/icons/content'
import { getStatsInfo } from '@/components/echarts/chart-options/tiltmeter/overview/utils'
import fieldOptions from '@/store/tiltmeter/overview/field-options'

export default {
  name: 'TiltmeterOverviewStats',
  components: {
    BCard,
    SidepanelListDivider,
    StatsPanelPeriod,
    StatsPanelTable,
  },
  data() {
    return {
      TimelineIcon,
      fieldOptions,
    }
  },
  computed: {
    ...mapState({
      data: (state) => state.tiltmeter.overview.data,
      startTime: (state) => state.tiltmeter.overview.startTime,
      endTime: (state) => state.tiltmeter.overview.endTime,
      tiltOptions: (state) => state.tiltmeter.overview.tiltOptions,
    }),
    statsInfo() {
      return getStatsInfo(this.data, this.tiltOptions)
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
