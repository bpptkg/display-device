<template>
  <SidepanelTabs class="secondary-nav">
    <SidepanelTab title="Statistics" :icon="TimelineIcon" active no-body>
      <StatsPanelPeriod :start="startTime" :end="endTime" />
      <SidepanelListDivider />
      <StatsPanelTable
        :fields="fieldOptions"
        :items="statsInfo"
        scrollable
        show-no-data-label
      />
    </SidepanelTab>
  </SidepanelTabs>
</template>

<script>
import { mapState } from 'vuex'

import {
  SidepanelListDivider,
  SidepanelTab,
  SidepanelTabs,
} from '@/components/sidepanel'
import {
  StatsPanelPeriod,
  StatsPanelTable,
} from '@/components/sidepanel/panel/stats'

import { TimelineIcon } from '@/components/icons/content'
import { getStatsInfo } from '@/components/echarts/chart-options/edm/overview/utils'
import fieldOptions from '@/store/edm/overview/field-options'

export default {
  name: 'EDMOverviewStats',
  components: {
    SidepanelListDivider,
    SidepanelTab,
    SidepanelTabs,
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
