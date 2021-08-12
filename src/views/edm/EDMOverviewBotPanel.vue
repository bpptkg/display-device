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

import { getStatsInfo } from '@/components/echarts/chart-options/edm/overview/utils'
import fieldOptions from '@/store/edm/overview/field-options'

export default {
  name: 'EDMOverviewBotPanel',
  components: {
    BCard,
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
    ...mapState({
      data: (state) => state.edm.overview.data,
      startTime: (state) => state.edm.overview.startTime,
      endTime: (state) => state.edm.overview.endTime,
      edmOptions: (state) => state.edm.overview.edmOptions,
    }),
    statsInfo() {
      return getStatsInfo(this.data, this.edmOptions)
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
