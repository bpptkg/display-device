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
          <h6>Weather Pasarbubar</h6>
          <router-link to="/weather/pasarbubar">
            <small>See more</small>
          </router-link>
        </div>
      </template>
      <DChart ref="chart" :options="chartOptions" class="chart" />
      <DNote>
        &mdash; Rainfall event may be clipped if rainfall duration greater than
        time period selected. Using longer time period is recommended to avoid
        this clipping issue.
      </DNote>

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
import { mapState, mapActions, mapGetters } from 'vuex'
import { BCard, BLink } from 'bootstrap-vue'
import ErrorMessage from '@/components/error-message'
import DChart from '@/components/echarts/chart/DChart'
import {
  baseChartOptions,
  createSeries,
  mediaQuery,
  createTooltip,
} from '@/components/echarts/chart-options/weather-pasarbubar'
import { UPDATE_METEOROLOGY } from '@/store/weather/pasarbubar/rainfall/actions'
import DNote from '@/components/base/note/DNote'

import InfoNote from './InfoNote.vue'

const NAMESPACE = 'home/charts/weather'

export default {
  name: 'WeatherPasarbubarChart',
  components: {
    BCard,
    BLink,
    DChart,
    DNote,
    ErrorMessage,
    InfoNote,
  },
  data() {
    return {
      interval: null,
    }
  },
  computed: {
    ...mapState(NAMESPACE, {
      error: (state) => state.error,
      startTime: (state) => state.startTime,
      endTime: (state) => state.endTime,
      lastUpdated: (state) => state.lastUpdated,
    }),
    ...mapGetters(NAMESPACE, ['rainfallData', 'rainfallEvents']),
    chartOptions() {
      const options = {
        baseOption: {
          ...baseChartOptions({ title: { text: '' } }),
          series: createSeries(this.rainfallData, this.rainfallEvents),
          tooltip: createTooltip(this.rainfallEvents),
        },
        media: mediaQuery,
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
    this.interval = setInterval(this.update, 60000)
  },
  methods: {
    ...mapActions({
      fetchData(dispatch) {
        return dispatch(NAMESPACE + '/' + UPDATE_METEOROLOGY)
      },
    }),
    update() {
      this.showLoading()
      this.fetchData().finally(() => {
        this.hideLoading()
      })
    },
    delegateMethod(name, ...args) {
      const chart = this.$refs.chart.$refs.chart
      return chart[name](...args)
    },
    showLoading(type, options) {
      this.delegateMethod('showLoading', type, options)
    },
    hideLoading() {
      this.delegateMethod('hideLoading')
    },
    clear() {
      this.delegateMethod('clear')
    },
  },
}
</script>

<style lang="scss" scoped>
.chart {
  min-height: 800px !important;
}
</style>
