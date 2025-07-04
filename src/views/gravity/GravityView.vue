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
      <div class="d-flex justify-content-start flex-wrap mb-3">
        <div class="d-flex flex-column flex-sm-row">
          <div class="d-flex align-items-center mr-3 mb-2 mb-sm-0">
            <div class="text-nowrap mr-2">Period 1:</div>
            <BFormSelect
              size="sm"
              v-model="g1Period"
              :options="periodOptions"
            ></BFormSelect>
          </div>
          <div class="d-flex align-items-center mr-3">
            <div class="text-nowrap mr-2">Period 2:</div>
            <BFormSelect
              size="sm"
              v-model="g2Period"
              :options="periodOptions"
            ></BFormSelect>
          </div>
        </div>
        <div class="mt-2 mt-sm-0">
          <BButton
            @click="update"
            pill
            variant="outline-primary"
            :disabled="!g1 || !g2"
          >
            <BSpinner v-if="isLoading" small label="Loading..." class="mr-1" />
            Apply
          </BButton>
        </div>
      </div>

      <BCard class="mb-3">
        <template #header>
          <div class="d-flex justify-content-between">
            <h6>N-S (Lintang)</h6>
          </div>
        </template>
        <div class="row w-100 mb-3">
          <div class="col-md-6 p-0">
            <DChart :options="gobsLatChartOptions" class="chart" />
          </div>
          <div class="col-md-6 p-0">
            <DChart :options="ablLatChartOptions" class="chart" />
          </div>
        </div>
        <div class="row w-100 mb-3">
          <div class="col-md p-0">
            <DChart :options="dcbaLatChartOptions" class="chart" />
          </div>
        </div>
      </BCard>

      <BCard>
        <template #header>
          <div class="d-flex justify-content-between">
            <h6>E-W (Bujur)</h6>
          </div>
        </template>
        <div class="row w-100 mb-3">
          <div class="col-md-6 p-0">
            <DChart :options="gobsLonChartOptions" class="chart" />
          </div>
          <div class="col-md-6 p-0">
            <DChart :options="ablLonChartOptions" class="chart" />
          </div>
        </div>
        <div class="row w-100 mb-3">
          <div class="col-md p-0">
            <DChart :options="dcbaLonChartOptions" class="chart" />
          </div>
        </div>
      </BCard>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import { BCard, BFormSelect, BLink, BButton, BSpinner } from 'bootstrap-vue'
import DChart from '../../components/echarts/chart/DChart.vue'
import {
  FETCH_GRAVITY_ITEMS,
  FETCH_GRAVITY_PERIODS,
  NAMESPACE,
  SET_G1,
  SET_G2,
} from '../../store/gravity'
import { createGravityChartOptions } from '../../components/echarts/chart-options/gravity/gobs'
import { createDcbaChartOptions } from '../../components/echarts/chart-options/gravity/dbca'

export default {
  name: 'GravityView',
  components: {
    DChart,
    BCard,
    BLink,
    BFormSelect,
    BButton,
    BSpinner,
  },
  data() {
    return {
      isLoading: false,
    }
  },
  computed: {
    ...mapState({
      g1(state) {
        return state[NAMESPACE].g1
      },
      g2(state) {
        return state[NAMESPACE].g2
      },
      periods(state) {
        return state[NAMESPACE].periods
      },
      data(state) {
        return state[NAMESPACE].data
      },
      error(state) {
        return state[NAMESPACE].error
      },
    }),
    g1Period: {
      get() {
        return this.g1
      },
      set(value) {
        this.setG1(value)
      },
    },
    g2Period: {
      get() {
        return this.g2
      },
      set(value) {
        this.setG2(value)
      },
    },
    periodOptions() {
      return this.periods.map((period) => ({
        value: period.id,
        text: period.period_string,
      }))
    },
    // Latitude charts
    gobsLatChartOptions() {
      return createGravityChartOptions({
        data: this.data,
        name: 'g_obs',
        title: 'Gravity Obs',
        x: 'lat',
      })
    },
    ablLatChartOptions() {
      return createGravityChartOptions({
        data: this.data,
        name: 'cba',
        title: 'Gravity ABL',
        x: 'lat',
      })
    },
    dcbaLatChartOptions() {
      return createDcbaChartOptions({
        data: this.data,
        x: 'lat',
      })
    },
    // Longitude charts
    gobsLonChartOptions() {
      return createGravityChartOptions({
        data: this.data,
        name: 'g_obs',
        title: 'Gravity Obs',
        x: 'lon',
      })
    },
    ablLonChartOptions() {
      return createGravityChartOptions({
        data: this.data,
        name: 'cba',
        title: 'Gravity ABL',
        x: 'lon',
      })
    },
    dcbaLonChartOptions() {
      return createDcbaChartOptions({
        data: this.data,
        x: 'lon',
      })
    },
  },
  methods: {
    ...mapMutations({
      setG1(commit, value) {
        commit(NAMESPACE + '/' + SET_G1, value)
      },
      setG2(commit, value) {
        commit(NAMESPACE + '/' + SET_G2, value)
      },
    }),
    ...mapActions({
      fetchGravityItems(dispatch) {
        return dispatch(NAMESPACE + '/' + FETCH_GRAVITY_ITEMS)
      },
      fetchGravityPeriods(dispatch) {
        return dispatch(NAMESPACE + '/' + FETCH_GRAVITY_PERIODS)
      },
    }),
    async update() {
      if (this.g1 && this.g2) {
        this.isLoading = true
        this.fetchGravityItems().finally(() => {
          this.isLoading = false
        })
      }
    },
  },
  mounted() {
    this.fetchGravityPeriods()
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
