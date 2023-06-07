<template>
  <BCard no-body header-class="p-1">
    <template #header>
      <div class="d-flex justify-content-between align-items-center">
        <span class="font-weight-bold">{{ station.name }}</span>
        <BSpinner v-if="isLoading" small label="Loading..."></BSpinner>
      </div>
    </template>
    <DChart ref="chart" :options="options" class="chart" />
  </BCard>
</template>

<script>
import { BCard, BSpinner } from 'bootstrap-vue'
import DChart from '../../components/echarts/chart/DChart'

export default {
  name: 'ModelingChart',
  components: {
    DChart,
    BCard,
    BSpinner,
  },
  props: {
    index: Number,
    station: {
      type: Object,
      default: function () {
        return { name: 'Unknown' }
      },
    },
    options: {
      type: Object,
      default: function () {
        return {}
      },
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    regressionText: {
      type: Object,
      default: function () {
        return {}
      },
    },
  },
  watch: {},
  methods: {
    update() {
      const chart = this.$refs.chart.$refs.chart
      chart.clear()
      chart.mergeOptions(this.options)
    },
  },
}
</script>

<style lang="scss" scoped>
.chart {
  height: 250px !important;
  width: 450px;
}

@media (max-width: 991.98px) {
  .chart {
    width: 350px;
  }
}
</style>
