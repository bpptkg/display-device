<template>
  <div class="padding: 0.25rem 0.65rem;">
    <SidepanelListHeader> Number of clusters </SidepanelListHeader>
    <SidepanelListItem>
      {{ clusterGroup.length }}
    </SidepanelListItem>
  </div>
</template>

<script>
import { SidepanelListHeader, SidepanelListItem } from '@/components/sidepanel'

export default {
  name: 'ClusterSidepanelSnippet',
  components: {
    SidepanelListHeader,
    SidepanelListItem,
  },
  props: {
    clusterGroup: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
