<template>
  <div class="w-100">
    <GPSGraphSummary v-if="isSummaryGraph" />
    <GPSGraph v-else :graph="graph" />
  </div>
</template>

<script>
import GPSGraph from './GPSGraph.vue'
import GPSGraphSummary from './GPSGraphSummary.vue'

export default {
  name: 'GPSGraphAdapter',
  components: {
    GPSGraph,
    GPSGraphSummary,
  },
  props: {
    graph: {
      type: String,
      required: true,
    },
  },
  computed: {
    isSummaryGraph() {
      return this.graph === 'summary'
    },
  },
}
</script>
