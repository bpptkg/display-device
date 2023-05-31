<template>
  <BCard no-body>
    <template #header>
      <div class="d-flex justify-content-between">
        <h6>{{ station.name }}</h6>
        <BSpinner v-if="isLoading" small label="Loading..."></BSpinner>
      </div>
    </template>
    <DChart ref="chart" :options="options" class="chart" />
    <template #footer>
      <DNote>
        <div>{{ regressionText.x || '' }}</div>
        <div>{{ regressionText.z || '' }}</div>
      </DNote>
    </template>
  </BCard>
</template>

<script>
import { BCard, BSpinner } from 'bootstrap-vue'
import DChart from '../../components/echarts/chart/DChart'
import DNote from '../../components/base/note/DNote'

export default {
  name: 'ModelingChart',
  components: {
    DChart,
    BCard,
    BSpinner,
    DNote,
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
  min-height: 400px;
  width: 450px;
}
</style>
