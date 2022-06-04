<template>
  <div class="view">
    <Sidepanel class="main-nav p-0">
      <SidepanelScrollContainer>
        <SidepanelMenuHeader small bold> THERMAL </SidepanelMenuHeader>

        <div class="ml-2">
          <SidepanelMenuItem
            v-for="item in stationOptions"
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
            <BFormSelectOption
              v-for="item in stationOptions"
              :key="item.value"
              :value="item.value"
            >
              {{ item.text }}
            </BFormSelectOption>
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
} from 'bootstrap-vue'
import {
  Sidepanel,
  SidepanelMenuHeader,
  SidepanelMenuItem,
  SidepanelScrollContainer,
  SidepanelTab,
  SidepanelTabs,
} from '@/components/sidepanel'
import { TimelineIcon } from '@/components/icons/content'
import stationOptions from '@/store/thermal/station-options'

export default {
  name: 'ThermalView',
  components: {
    BCard,
    BFormGroup,
    BFormSelect,
    BFormSelectOption,
    Sidepanel,
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
  computed: {},
  mounted() {
    this.init()
  },
  methods: {
    onItemClick(item) {
      this.selected = item
      this.station = item.value
      this.$router.push({
        name: 'thermal-chart',
        params: { station: item.value },
      })
    },
    onItemChange(value) {
      this.$router.push({ path: value })
    },
    init() {
      const { station } = this.$router.currentRoute.params
      this.station = station
      this.selected = stationOptions.find((v) => v.value === station)
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
