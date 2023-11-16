<template>
  <div class="chart-container">
    <ErrorMessage v-if="error">
      <p>Unable to load data.</p>
      <p>Error: {{ error.message }}</p>
      <p>
        <BLink @click="update"> Try again </BLink>
      </p>
    </ErrorMessage>
    <DChart v-show="!error" ref="chart" :options="chartOptions" class="chart" />
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { BLink } from 'bootstrap-vue'

import DChart from '@/components/echarts/chart/DChart'
import ErrorMessage from '@/components/error-message'
import { UPDATE_TILTMETER } from '@/store/tiltmeter/actions'

const NAMESPACE = 'realtime/deformation/tiltmeter'

export default {
  name: 'TiltmeterChart',
  components: {
    BLink,
    DChart,
    ErrorMessage,
  },
  data() {
    return { interval: null }
  },
  computed: {
    ...mapState(NAMESPACE, {
      error: (state) => state.error,
    }),
    ...mapGetters(NAMESPACE, ['chartOptions']),
  },
  beforeDestroy() {
    if (this.interval) {
      clearInterval(this.interval)
    }
  },
  async mounted() {
    this.update()
    this.interval = setInterval(() => {
      this.update()
    }, 1000 * 60 * 60)
  },
  methods: {
    ...mapActions({
      fetchData(dispatch) {
        return dispatch(NAMESPACE + '/' + UPDATE_TILTMETER)
      },
    }),
    update() {
      const chart = this.$refs.chart.$refs.chart
      chart.clear()
      chart.showLoading()
      this.fetchData().finally(() => {
        chart.hideLoading()
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.chart-container {
  padding: 10px;
  height: 100%;
  width: 100%;
}

.chart {
  height: 100%;
  width: 100%;
  min-height: 150px;
}

@media (max-width: 991.98px) {
  .chart-container {
    height: 300px;
  }
}
</style>
