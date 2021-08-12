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
      <div class="sidenav-select">
        <BFormGroup label="Benchmark options">
          <BFormSelect
            v-model="benchmark"
            :options="benchmarkOptions"
            @change="onItemChange"
          >
          </BFormSelect>
        </BFormGroup>
      </div>
      <keep-alive>
        <router-view :key="$route.path"></router-view>
      </keep-alive>
      <EDMBenchmarkBotPanel />
    </div>
    <SidepanelTabs v-model="tab" class="secondary-nav">
      <SidepanelTab
        title="Statistics"
        :icon="TimelineIcon"
        no-body
        :active="tab === 0"
      >
        <router-view name="stats"></router-view>
      </SidepanelTab>
      <SidepanelTab
        title="Benchmark Information"
        :icon="InfoIcon"
        :active="tab === 1"
      >
        <EDMBenchmakInfo :benchmark="benchmark" />
      </SidepanelTab>
    </SidepanelTabs>
  </div>
</template>

<script>
import { BFormGroup, BFormSelect } from 'bootstrap-vue'
import {
  Sidepanel,
  SidepanelMenuDivider,
  SidepanelMenuHeader,
  SidepanelMenuItem,
  SidepanelScrollContainer,
  SidepanelTab,
  SidepanelTabs,
} from '@/components/sidepanel'
import { InfoIcon, TimelineIcon } from '@/components/icons/content'
import benchmarkOptions from '@/store/edm/benchmark-options'
import EDMBenchmakInfo from './EDMBenchmarkInfo'
import EDMBenchmarkBotPanel from './EDMBenchmarkBotPanel'

export default {
  name: 'EDMView',
  components: {
    BFormGroup,
    BFormSelect,
    EDMBenchmakInfo,
    EDMBenchmarkBotPanel,
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
      tab: 0,
      benchmark: null,
      benchmarkOptions,
      InfoIcon,
      TimelineIcon,
    }
  },
  watch: {
    $route(to, from) {
      const { benchmark } = to.params
      this.benchmark = benchmark
    },
  },
  mounted() {
    this.init()
  },
  methods: {
    onItemChange(value) {
      this.$router.push({ path: value })
    },
    init() {
      const { benchmark } = this.$router.currentRoute.params
      this.benchmark = benchmark
    },
  },
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
