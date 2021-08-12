<template>
  <div class="view">
    <Sidepanel class="main-nav p-0">
      <SidepanelScrollContainer>
        <SidepanelMenuHeader small bold> GPS COORDINATE </SidepanelMenuHeader>
        <div class="ml-2">
          <SidepanelMenuItem
            v-for="(item, index) in stationOptions"
            :key="index"
            round="left"
            :to="item.value"
          >
            {{ item.text }}
          </SidepanelMenuItem>
        </div>
      </SidepanelScrollContainer>
    </Sidepanel>
    <div class="content">
      <div class="sidenav-select">
        <BFormGroup label="Station options">
          <BFormSelect
            v-model="station"
            :options="stationOptions"
            @change="onItemChange"
          >
          </BFormSelect>
        </BFormGroup>
      </div>
      <keep-alive>
        <router-view :key="$route.path"></router-view>
      </keep-alive>
      <div class="bot-panel mt-3 mb-3">
        <BCard title="Statistic" title-tag="h6">
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
import { BFormGroup, BFormSelect, BCard } from 'bootstrap-vue'
import {
  Sidepanel,
  SidepanelMenuHeader,
  SidepanelMenuItem,
  SidepanelScrollContainer,
  SidepanelTab,
  SidepanelTabs,
} from '@/components/sidepanel'
import { TimelineIcon } from '@/components/icons/content'
import stationOptions from '@/store/gps/coordinate/station-options'

export default {
  name: 'GPSCoordinateView',
  components: {
    BFormGroup,
    BFormSelect,
    Sidepanel,
    SidepanelMenuHeader,
    SidepanelMenuItem,
    SidepanelScrollContainer,
    SidepanelTab,
    SidepanelTabs,
    BCard,
  },
  data() {
    return {
      station: null,
      stationOptions,
      TimelineIcon,
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    onItemChange(value) {
      this.$router.push({ path: value })
    },
    init() {
      const { station } = this.$router.currentRoute.params
      this.station = station
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/layout-gorilla';
@media (min-width: 991.98px) {
  .bot-panel {
    display: none;
  }
}
</style>
