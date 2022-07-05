<template>
  <div>
    <div v-for="station in stations" :key="station.stationId">
      <SidepanelListHeader> {{ station.stationName }} </SidepanelListHeader>
      <StatsPanelTable
        :title="`Rainfall Events (${getRainfallEventsCount(station)})`"
        :fields="fieldEvents"
        :items="getRainfallEvents(station)"
        scrollable
        show-no-data-label
      />
    </div>
  </div>
</template>

<script>
import { get } from 'lodash'
import { mapState } from 'vuex'
import { SidepanelListHeader } from '@/components/sidepanel'
import { StatsPanelTable } from '@/components/sidepanel/panel/stats'

import { NAMESPACE } from '@/store/rainfall-station'

// Use schema from Pasarbubar rainfall because we have the same data structure.
import fieldEvents from '@/store/weather/pasarbubar/rainfall/field-events'
import { getSeriesByIndex } from '../../../utils/series'

export default {
  name: 'RainfallStationInfo',
  components: {
    SidepanelListHeader,
    StatsPanelTable,
  },
  data() {
    return {
      fieldEvents,
    }
  },
  computed: {
    ...mapState(NAMESPACE, {
      data: (state) => state.data,
      stations: (state) => state.stations,
    }),
  },
  methods: {
    getRainfallEventsCount(station) {
      const events = this.getRainfallEvents(station)
      return events.length
    },
    getRainfallEvents(station) {
      const index = this.stations.findIndex(
        (s) => s.stationId === station.stationId
      )
      if (index !== -1) {
        const res = getSeriesByIndex(this.data, index)
        return get(res, 'events.data', [])
      } else {
        return []
      }
    },
  },
}
</script>
