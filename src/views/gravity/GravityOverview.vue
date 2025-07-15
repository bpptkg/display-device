<template>
  <div class="gravity-view">
    <BCard v-if="error">
      <ErrorMessage>
        <p>Unable to load data.</p>
        <p>Error: {{ error.message }}</p>
        <p>
          <BLink @click="update"> Try again </BLink>
        </p>
      </ErrorMessage>
    </BCard>

    <div v-show="!error">
      <div class="d-flex justify-content-end flex-wrap mb-3">
        <div class="d-flex align-items-center justify-content-end mt-2">
          <MoreMenu right class="ml-2">
            <BDropdownItem @click="update">Refresh</BDropdownItem>
          </MoreMenu>
        </div>
      </div>
      <DChart :options="chartOptions" class="chart" ref="chart" />
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { BCard, BLink, BDropdownItem } from 'bootstrap-vue'
import DChart from '../../components/echarts/chart/DChart.vue'
import {
  FETCH_GRAVITY_TIMESERIES,
  NAMESPACE,
} from '../../store/gravity-overview'
import { createGravityOverviewChartOptions } from '../../components/echarts/chart-options/gravity/overview'
import ErrorMessage from '../../components/error-message/ErrorMessage.vue'
import MoreMenu from '../../components/more-menu/MoreMenu.vue'

export default {
  name: 'GravityOverview',
  components: {
    DChart,
    BCard,
    BLink,
    ErrorMessage,
    BDropdownItem,
    MoreMenu,
  },
  data() {
    return {}
  },
  computed: {
    ...mapState({
      data(state) {
        return state[NAMESPACE].data
      },
      error(state) {
        return state[NAMESPACE].error
      },
    }),
    chartOptions() {
      return createGravityOverviewChartOptions({
        data: this.data,
      })
    },
  },
  methods: {
    ...mapMutations({}),
    ...mapActions({
      fetchGravityTimeSeries(dispatch) {
        return dispatch(NAMESPACE + '/' + FETCH_GRAVITY_TIMESERIES)
      },
    }),
    async update() {
      const chart = this.$refs.chart.$refs.chart
      chart.clear()
      chart.showLoading()

      this.fetchGravityTimeSeries().finally(() => {
        chart.hideLoading()
      })
    },
  },
  mounted() {
    this.update()
  },
}
</script>

<style lang="scss" scoped>
.gravity-view {
  margin-top: 60px;
  padding-left: 10px;
  padding-right: 10px;
  margin-bottom: 40px;
}
.chart {
  min-height: 500px;
}
</style>
