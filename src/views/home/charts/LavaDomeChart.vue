<template>
  <div>
    <BCard v-if="error">
      <ErrorMessage>
        <p>Unable to load data.</p>
        <p>Error: {{ error.message }}</p>
        <p>
          <BLink @click="update"> Try again </BLink>
        </p>
      </ErrorMessage>
    </BCard>

    <BCard v-show="!error">
      <template #header>
        <div class="d-flex justify-content-between">
          <h6>Lava Dome Growth</h6>
          <router-link to="/lava-domes/barat-daya">
            <small>See more</small>
          </router-link>
        </div>
      </template>
      <DChart ref="chart" :options="chartOptions" class="chart" />

      <hr />
      <InfoNote
        :start-time="startTime"
        :end-time="endTime"
        :last-updated="lastUpdated"
      ></InfoNote>
    </BCard>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { BCard, BLink } from 'bootstrap-vue'
import ErrorMessage from '@/components/error-message'
import DChart from '@/components/echarts/chart/DChart'
import { toUnixMiliSeconds } from '@/utils/series'
import { UPDATE_DATA } from '@/store/lava-domes/actions'

import {
  baseChartOptions,
  createSeries,
  createXAxis,
  mediaQuery,
} from '@/components/echarts/chart-options/lava-domes/subplots'

import InfoNote from './InfoNote.vue'

const NS_SOUTHWEST = 'home/charts/lavaDome/domeSouthwest'
const NS_CENTER = 'home/charts/lavaDome/domeCenter'

export default {
  name: 'LavaDomeChart',
  components: {
    BCard,
    BLink,
    DChart,
    ErrorMessage,
    InfoNote,
  },
  data() {
    return {
      interval: null,
    }
  },
  computed: {
    // State from lava dome southwest.
    ...mapState(NS_SOUTHWEST, {
      ldswData: (state) => state.data,
      ldswError: (state) => state.error,
      ldswStartTime: (state) => state.startTime,
      ldswEndTime: (state) => state.endTime,
      lastUpdated: (state) => state.lastUpdated,
    }),

    // State from lava dome center.
    ...mapState(NS_CENTER, {
      ldcData: (state) => state.data,
      ldcError: (state) => state.error,
      ldcStartTime: (state) => state.startTime,
      ldcEndTime: (state) => state.endTime,
    }),

    // Because we have two error state, return one of them. If one ever
    // experience fetching error, show the error message to the user.
    error() {
      return this.ldswError || this.ldcError
    },

    // startTime has the same value. So, only return one of them.
    startTime() {
      return this.ldswStartTime
    },

    // endTime has the same value. So, only return one of them.
    endTime() {
      return this.ldswEndTime
    },

    data() {
      return [this.ldswData, this.ldcData]
    },

    chartOptions() {
      const options = {
        baseOption: {
          ...baseChartOptions(),
          series: createSeries(this.data),
          xAxis: createXAxis(
            toUnixMiliSeconds(this.startTime),
            toUnixMiliSeconds(this.endTime)
          ),
        },
        media: mediaQuery(),
      }

      return options
    },
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
    }, 1000 * 60 * 30)
  },
  methods: {
    ...mapActions({
      fetchDataSouthwest(dispatch) {
        return dispatch(NS_SOUTHWEST + '/' + UPDATE_DATA)
      },
      fetchDataCenter(dispatch) {
        return dispatch(NS_CENTER + '/' + UPDATE_DATA)
      },
    }),
    update() {
      const chart = this.$refs.chart.$refs.chart
      chart.clear()
      chart.showLoading()

      Promise.all([this.fetchDataSouthwest(), this.fetchDataCenter()]).finally(
        () => {
          chart.hideLoading()
        }
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.chart {
  min-height: 600px !important;
}
</style>
