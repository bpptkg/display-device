<template>
  <div class="view">
    <Sidepanel class="main-nav p-0">
      <SidepanelScrollContainer>
        <SidepanelMenuHeader small bold> Graphs </SidepanelMenuHeader>
        <div class="ml-2">
          <SidepanelMenuItem
            v-for="(item, index) in graphOptions"
            :key="index"
            round="left"
            :to="`/gps/graphs/${item.value}`"
          >
            {{ item.text }}
          </SidepanelMenuItem>
        </div>
      </SidepanelScrollContainer>
    </Sidepanel>
    <div class="content">
      <div class="sidenav-select">
        <BFormGroup label="Graph options">
          <BFormSelect
            v-model="graph"
            :options="graphOptions"
            @change="onItemChange"
          >
          </BFormSelect>
        </BFormGroup>
      </div>
      <keep-alive>
        <router-view :key="$route.path"></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import { BFormGroup, BFormSelect } from 'bootstrap-vue'
import {
  Sidepanel,
  SidepanelMenuHeader,
  SidepanelMenuItem,
  SidepanelScrollContainer,
} from '@/components/sidepanel'
import { InfoIcon, TimelineIcon } from '@/components/icons/content'

import { graphOptions } from '@/store/gps/graphs/graph-options'

export default {
  name: 'GPSGraphView',
  components: {
    BFormGroup,
    BFormSelect,
    Sidepanel,
    SidepanelMenuHeader,
    SidepanelMenuItem,
    SidepanelScrollContainer,
  },
  data() {
    return {
      tab: 0,
      graph: null,
      graphOptions,
      InfoIcon,
      TimelineIcon,
    }
  },
  watch: {
    $route(to, from) {
      const { graph } = to.params
      this.graph = graph
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
      const { graph } = this.$router.currentRoute.params
      this.graph = graph
    },
  },
}
</script>

<style lang="scss" scoped>
@import '@/scss/layout-gorilla';

@media (min-width: 992px) {
  .content {
    right: 0;
  }
}
</style>
