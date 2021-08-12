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
import { LavaDome } from '@/constants/lava-domes'

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
import { getStatsInfo } from '@/components/echarts/chart-options/lava-domes/utils'
import fieldOptions from '@/store/lava-domes/field-options'

const getNamespaceLocation = (loc) => {
  switch (loc) {
    case LavaDome.DOME_SOUTHWEST:
      return 'domeSouthwest'
    case LavaDome.DOME_CENTER:
      return 'domeCenter'
    default:
      return 'domeSouthwest'
  }
}

export default {
  name: 'LavaDomeStatsView',
  components: {
    SidepanelListDivider,
    SidepanelTab,
    SidepanelTabs,
    StatsPanelPeriod,
    StatsPanelTable,
  },
  props: {
    location: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      TimelineIcon,
      fieldOptions,
    }
  },
  computed: {
    ...mapState({
      data(state) {
        return state.lavaDome[this.namespaceLocation].data
      },
      error(state) {
        return state.lavaDome[this.namespaceLocation].error
      },
      period(state) {
        return state.lavaDome[this.namespaceLocation].period
      },
      startTime(state) {
        return state.lavaDome[this.namespaceLocation].startTime
      },
      endTime(state) {
        return state.lavaDome[this.namespaceLocation].endTime
      },
    }),

    namespaceLocation() {
      return getNamespaceLocation(this.location)
    },

    statsInfo() {
      return getStatsInfo(this.data)
    },
  },
}
</script>
