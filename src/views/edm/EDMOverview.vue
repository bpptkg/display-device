<template>
  <div class="view">
    <Sidepanel class="main-nav p-0">
      <SidepanelScrollContainer>
        <SidepanelMenuHeader small bold> EDM </SidepanelMenuHeader>
        <div class="ml-2">
          <SidepanelMenuItem key="edmOverview" to="/edm-overview" round="left">
            Overview
          </SidepanelMenuItem>
        </div>
        <SidepanelMenuDivider />

        <SidepanelMenuHeader small bold> BENCHMARKS </SidepanelMenuHeader>
        <div class="ml-2">
          <SidepanelMenuItem
            v-for="(item, index) in benchmarkOptions"
            :key="index"
            round="left"
            :to="`/edm/${item.value}`"
          >
            {{ item.text }}
          </SidepanelMenuItem>
        </div>
      </SidepanelScrollContainer>
    </Sidepanel>

    <div class="content">
      <keep-alive>
        <EDMOverviewChart />
      </keep-alive>

      <EDMOverviewBotPanel />
    </div>

    <EDMOverviewStats />
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
import benchmarkOptions from '@/store/edm/benchmark-options'

import EDMOverviewChart from './EDMOverviewChart'
import EDMOverviewStats from './EDMOverviewStats'
import EDMOverviewBotPanel from './EDMOverviewBotPanel'

export default {
  name: 'EDMOverview',
  components: {
    EDMOverviewBotPanel,
    EDMOverviewChart,
    EDMOverviewStats,
    Sidepanel,
    SidepanelMenuDivider,
    SidepanelMenuHeader,
    SidepanelMenuItem,
    SidepanelScrollContainer,
  },
  data() {
    return {
      benchmarkOptions,
    }
  },
  watch: {},
  mounted() {},
  methods: {},
}
</script>

<style lang="scss" scoped>
@import '@/scss/layout-gorilla';

@media (min-width: 991.98px) {
  .edm-top-nav {
    display: none;
  }
}
</style>
