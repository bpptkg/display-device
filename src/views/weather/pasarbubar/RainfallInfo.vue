<template>
  <div>
    <SidepanelListHeader> Number of Events </SidepanelListHeader>
    <SidepanelListItem>
      {{ rainfallEventsCount }}
    </SidepanelListItem>
    <StatsPanelTable
      title="Rainfall Events"
      :fields="fieldEvents"
      :items="rainfallEvents"
      scrollable
      show-no-data-label
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { SidepanelListHeader, SidepanelListItem } from '@/components/sidepanel'
import { StatsPanelTable } from '@/components/sidepanel/panel/stats'

import { NAMESPACE } from '@/store/weather/pasarbubar/rainfall'
import fieldEvents from '@/store/weather/pasarbubar/rainfall/field-events'

export default {
  name: 'RainfallInfo',
  components: {
    SidepanelListHeader,
    SidepanelListItem,
    StatsPanelTable,
  },
  data() {
    return {
      fieldEvents,
    }
  },
  computed: {
    ...mapGetters(NAMESPACE, ['rainfallEvents', 'rainfallEventsCount']),
  },
}
</script>
