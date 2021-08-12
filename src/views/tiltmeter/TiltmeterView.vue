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
            :active="item === selected"
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
            :active="item === selected"
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
            :active="item === selected"
            round="left"
            @click.native="onItemClick(item)"
          >
            {{ item.text }}
          </SidepanelMenuItem>
        </div>
      </SidepanelScrollContainer>
    </Sidepanel>
    <div class="content">
      <div class="sidenav-select">
        <BFormGroup label="Station options">
          <BFormSelect v-model="station" @change="onItemChange">
            <BFormSelectOptionGroup label="Platform">
              <BFormSelectOption
                v-for="item in tiltPlatformStations"
                :key="item.value"
                :value="item.value"
              >
                {{ item.text }}
              </BFormSelectOption>
            </BFormSelectOptionGroup>
            <BFormSelectOptionGroup label="Borehole">
              <BFormSelectOption
                v-for="item in tiltBoreholeStations"
                :key="item.value"
                :value="item.value"
              >
                {{ item.text }}
              </BFormSelectOption>
            </BFormSelectOptionGroup>
            <BFormSelectOptionGroup label="TLR">
              <BFormSelectOption
                v-for="item in tiltTLRStations"
                :key="item.value"
                :value="item.value"
              >
                {{ item.text }}
              </BFormSelectOption>
            </BFormSelectOptionGroup>
          </BFormSelect>
        </BFormGroup>
      </div>
      <keep-alive>
        <router-view :key="$route.path"></router-view>
      </keep-alive>
      <div class="bot-panel mt-3 mb-3">
        <BCard title="Statistics" title-tag="h6">
          <router-view name="stats"></router-view>
        </BCard>
      </div>
    </div>
    <SidepanelTabs class="secondary-nav">
      <SidepanelTab title="Statistics" :icon="TimelineIcon" active no-body>
        <router-view name="stats"></router-view>
      </SidepanelTab>
    </SidepanelTabs>
  </div>
</template>

<script>
import {
  BCard,
  BFormGroup,
  BFormSelect,
  BFormSelectOption,
  BFormSelectOptionGroup,
} from 'bootstrap-vue'
import {
  Sidepanel,
  SidepanelMenuDivider,
  SidepanelMenuHeader,
  SidepanelMenuItem,
  SidepanelScrollContainer,
  SidepanelTab,
  SidepanelTabs,
} from '@/components/sidepanel'
import { TimelineIcon } from '@/components/icons/content'
import stationOptions from '@/store/tiltmeter/station-options'
import { DataTypes } from '@/constants/tiltmeter'

export default {
  name: 'TiltmeterView',
  components: {
    BCard,
    BFormGroup,
    BFormSelect,
    BFormSelectOption,
    BFormSelectOptionGroup,
    Sidepanel,
    SidepanelMenuDivider,
    SidepanelMenuHeader,
    SidepanelMenuItem,
    SidepanelScrollContainer,
    SidepanelTab,
    SidepanelTabs,
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
  mounted() {
    this.init()
  },
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
    init() {
      const { type, station } = this.$router.currentRoute.params
      this.selected = stationOptions.find(
        (v) => v.value === `${type}/${station}`
      )
      this.station = this.selected.value
    },
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
