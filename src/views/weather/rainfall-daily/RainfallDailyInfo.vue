<template>
  <div>
    <div v-for="station in rainfallStations" :key="station.stationId">
      <StatsPanelTable
        :title="station.stationName"
        :fields="fieldOptions"
        :items="getStatsInfo(station)"
        scrollable
        show-no-data-label
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { StatsPanelTable } from '@/components/sidepanel/panel/stats'
import { NAMESPACE } from '@/store/rainfall-daily'
import { min, max, mean } from 'lodash'
import fieldOptions from '@/store/rainfall-daily/field-options'
import { getSeriesByIndex } from '@/utils/series'

const findOriginalIndex = (stations, stationId) => {
  return stations.findIndex((v) => v.stationId === stationId)
}

export default {
  name: 'RainfallDailyInfo',
  components: {
    StatsPanelTable,
  },
  data() {
    return {
      fieldOptions,
    }
  },
  computed: {
    ...mapState(NAMESPACE, {
      data: (state) => state.data,
      stations: (state) => state.stations,
    }),
    rainfallStations() {
      return this.stations
    },
  },
  methods: {
    getStatsInfo(station) {
      const stats = []

      const dataIndex = findOriginalIndex(this.stations, station.stationId)
      const data = getSeriesByIndex(this.data, dataIndex, {
        defaultData: [],
      })
      const array = data.map((v) => v.rain_acc).filter((v) => v > 0)

      stats.push({
        station: station.stationName,
        min: min(array),
        max: max(array),
        mean: mean(array),
      })

      return stats
    },
  },
}
</script>
