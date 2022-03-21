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

    <BCard v-show="!error" title-tag="h5">
      <DChart ref="chart" :options="chartOptions" />
    </BCard>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { BCard, BLink, BDropdownItem } from 'bootstrap-vue'
import ErrorMessage from '@/components/error-message'
import DChart from '@/components/echarts/chart/DChart'
import { createPeriodText } from '@/utils/datetime'
import {
  baseChartOptions,
  createSeries,
  createLegend,
} from '@/components/echarts/chart-options/wind-rose'
import { NAMESPACE } from '@/store/weather/pasarbubar/wind-rose'
import { UPDATE_METEOROLOGY } from '@/store/weather/pasarbubar/rainfall/actions'

export default {
  name: 'WindRoseChart',
  components: {
    BCard,
    BLink,
    DChart,
    ErrorMessage,
  },
  computed: {
    ...mapState(NAMESPACE, {
      error: (state) => state.error,
      startTime: (state) => state.startTime,
      endTime: (state) => state.endTime,
    }),
    ...mapGetters(NAMESPACE, ['windRose', 'windSpeedBins']),
    chartOptions() {
      const options = {
        baseOption: {
          ...baseChartOptions({
            title: { subtext: createPeriodText(this.startTime, this.endTime) },
          }),
          series: createSeries(this.windRose, this.windSpeedBins),
          legend: createLegend(this.windSpeedBins),
        },
        media: [
          {
            query: {
              maxWidth: 575.98,
            },
            option: {
              legend: createLegend(this.windSpeedBins, { isMobile: true }),
              title: { textStyle: { fontSize: 13 } },
            },
          },
        ],
      }
      return options
    },
  },
  methods: {
    ...mapActions({
      fetchData(dispatch) {
        return dispatch(NAMESPACE + '/' + UPDATE_METEOROLOGY)
      },
    }),
    update() {
      this.fetchData()
    },
  },
}
</script>
