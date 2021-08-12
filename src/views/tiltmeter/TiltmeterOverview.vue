<template>
  <div class="view">
    <Sidepanel class="main-nav p-0">
      <SidepanelScrollContainer>
        <SidepanelMenuHeader small bold> TILTMETER </SidepanelMenuHeader>
        <div class="ml-2">
          <SidepanelMenuItem round="left" to="/tiltmeter-overview">
            Overview
          </SidepanelMenuItem>
        </div>
        <SidepanelMenuDivider />

        <SidepanelMenuHeader small bold> PLATFORM </SidepanelMenuHeader>
        <div class="ml-2">
          <SidepanelMenuItem
            v-for="item in tiltPlatformStations"
            :key="item.value"
            round="left"
            @click.native="onItemClick(item)"
          >
            {{ item.text }}
          </SidepanelMenuItem>
        </div>
        <SidepanelMenuDivider />

        <SidepanelMenuHeader small bold> BOREHOLE </SidepanelMenuHeader>
        <div class="ml-2">
          <SidepanelMenuItem
            v-for="item in tiltBoreholeStations"
            :key="item.value"
            round="left"
            @click.native="onItemClick(item)"
          >
            {{ item.text }}
          </SidepanelMenuItem>
        </div>
        <SidepanelMenuDivider />

        <SidepanelMenuHeader small bold> TLR </SidepanelMenuHeader>
        <div class="ml-2">
          <SidepanelMenuItem
            v-for="item in tiltTLRStations"
            :key="item.value"
            round="left"
            @click.native="onItemClick(item)"
          >
            {{ item.text }}
          </SidepanelMenuItem>
        </div>
      </SidepanelScrollContainer>
    </Sidepanel>

    <div class="content">
      <keep-alive>
        <TiltmeterOverviewChart />
      </keep-alive>

      <TiltmeterOverviewBotPanel />
    </div>

    <TiltmeterOverviewStats />
  </div>
</template>

<script>
import {
  Sidepanel,
  SidepanelMenuDivider,
  SidepanelMenuHeader,
  SidepanelMenuItem,
  SidepanelScrollContainer,
} from '@/components/sidepanel'
import { TimelineIcon } from '@/components/icons/content'
import stationOptions from '@/store/tiltmeter/station-options'
import { DataTypes } from '@/constants/tiltmeter'

import TiltmeterOverviewChart from './TiltmeterOverviewChart'
import TiltmeterOverviewStats from './TiltmeterOverviewStats'
import TiltmeterOverviewBotPanel from './TiltmeterOverviewBotPanel'

export default {
  name: 'TiltmeterOverview',
  components: {
    Sidepanel,
    SidepanelMenuDivider,
    SidepanelMenuHeader,
    SidepanelMenuItem,
    SidepanelScrollContainer,
    TiltmeterOverviewBotPanel,
    TiltmeterOverviewChart,
    TiltmeterOverviewStats,
  },
  data() {
    return {
      station: null,
      selected: null,
      stationOptions,
      TimelineIcon,
    }
  },
  computed: {
    tiltPlatformStations() {
      return this.filterStationByDataType(stationOptions, DataTypes.PLATFORM)
    },
    tiltBoreholeStations() {
      return this.filterStationByDataType(stationOptions, DataTypes.BOREHOLE)
    },
    tiltTLRStations() {
      return this.filterStationByDataType(stationOptions, DataTypes.TLR)
    },
  },
  mounted() {},
  methods: {
    filterStationByDataType(stations, type) {
      return stations.filter((v) => v.value.split('/')[0] === type)
    },
    onItemClick(item) {
      this.selected = item
      this.station = item.value
      const [type, station] = this.station.split('/')
      this.$router.push({
        name: 'tiltmeter-chart',
        params: { type, station },
      })
    },
    onItemChange(value) {
      this.selected = stationOptions.find((v) => v.value === value)
      const [type, station] = value.split('/')
      this.$router.push({
        name: 'tiltmeter-chart',
        params: { type, station },
      })
    },
    init() {},
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/layout-gorilla';

@media (min-width: 991.98px) {
  .tilt-top-nav {
    display: none;
  }
}

@media (min-width: 991.98px) {
  .bot-panel {
    display: none;
  }
}
</style>
