<template>
  <div>
    <SidepanelListHeader class="p-1"> Name </SidepanelListHeader>
    <SidepanelListItem class="p-1">
      {{ info.name }}
    </SidepanelListItem>
    <SidepanelListHeader class="p-1"> Code </SidepanelListHeader>
    <SidepanelListItem class="p-1">
      {{ info.code }}
    </SidepanelListItem>
    <SidepanelListHeader class="p-1"> Reflector List </SidepanelListHeader>
    <SidepanelListItem class="p-1">
      {{ info.reflectors ? info.reflectors.join(', ') : '' }}
    </SidepanelListItem>
  </div>
</template>

<script>
import { get } from 'lodash'
import { edmBenchmarkInfo } from '@/constants/edm'
import { SidepanelListHeader, SidepanelListItem } from '@/components/sidepanel'

export default {
  name: 'EDMBenchmarkInfo',
  components: {
    SidepanelListHeader,
    SidepanelListItem,
  },
  props: {
    benchmark: {
      type: String,
      default: null,
    },
  },
  computed: {
    info() {
      return get(edmBenchmarkInfo, this.benchmark, {})
    },
  },
}
</script>
