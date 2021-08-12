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
import { getStatsInfo } from '@/components/echarts/chart-options/tiltmeter/overview/utils'
import fieldOptions from '@/store/tiltmeter/overview/field-options'

export default {
  name: 'TiltmeterOverviewStats',
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
