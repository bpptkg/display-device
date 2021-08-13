<template>
  <div class="chart-wrapper">
    <DChart ref="chart" :options="chartOptions" class="chart" manual-update />
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { EnergyTypes } from '@/constants/energy'
import {
  EVENT_UPDATE_CHART_DISPATCHED,
  EVENT_UPDATE_ANNOTATION_DISPATCHED,
} from '@/constants/events/energy'
import EventBus from '@/utils/event-bus'
import { toUnixMiliSeconds } from '@/utils/series'
import { createPeriodText } from '@/utils/datetime'
import DChart from '@/components/echarts/chart/DChart'
import {
  baseChartOptions,
  createDataZoom,
  createGrid,
  createLegend,
  createSeries,
  createXAxis,
  createYAxis,
  mediaQuery,
} from '@/components/echarts/chart-options/seismic/energy'
import energyOptions from '@/store/seismic/energy/energy-options'
import { UPDATE_ENERGY } from '@/store/seismic/energy/actions'
import { UPDATE_ANNOTATIONS } from '@/store/base/actions'

export default {
  name: 'SeismicEnergyChart',
  components: {
    DChart,
  },
  props: {
    type: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapState({
      data(state) {
        return state.seismic.energy[this.type].data
      },
      isUpdating(state) {
        return state.seismic.energy[this.type].isUpdating
      },
      startTime(state) {
        return state.seismic.energy[this.type].startTime
      },
      endTime(state) {
        return state.seismic.energy[this.type].endTime
      },
      annotations(state) {
        return state.seismic.energy[this.type].annotations
      },
      sampling(state) {
        return state.seismic.energy[this.type].sampling
      },
    }),
    namespace() {
      return `seismic/energy/${this.type}`
    },
    chartTitle() {
      return energyOptions.find((v) => v.value === this.type).chartTitle
    },
    chartOptions() {
      const options = {
        baseOption: {
          ...baseChartOptions(this.sampling),
          dataZoom: createDataZoom(this.type),
          grid: createGrid(this.type),
          legend:
            this.type === EnergyTypes.TOTAL ? createLegend() : { show: false },
          xAxis: createXAxis(
            toUnixMiliSeconds(this.startTime),
            toUnixMiliSeconds(this.endTime)
          ),
          yAxis: createYAxis(this.type),
          series: createSeries(this.data, this.type, {
            annotations: this.annotations,
          }),
          title: {
            text: this.chartTitle,
            subtext: createPeriodText(this.startTime, this.endTime),
            left: 'center',
            align: 'right',
            textStyle: {
              fontSize: 15,
              fontWeight: 'bold',
            },
            subtextStyle: {
              color: '#363636',
            },
          },
        },
        media: mediaQuery(this.type),
      }
      return options
    },
  },
  mounted() {
    this.update()
    EventBus.$on(EVENT_UPDATE_CHART_DISPATCHED, this.update)
    EventBus.$on(
      EVENT_UPDATE_ANNOTATION_DISPATCHED,
      this.handleUpdateAnnotations
    )

    // We use this component for several instances. So, we need to remove event
    // listener when the component used by other instance.
    this.$once('hook:beforeDestroy', function () {
      EventBus.$off(EVENT_UPDATE_CHART_DISPATCHED, this.update)
      EventBus.$off(
        EVENT_UPDATE_ANNOTATION_DISPATCHED,
        this.handleUpdateAnnotations
      )
    })
  },
  methods: {
    ...mapActions({
      fetchData(dispatch) {
        return dispatch(this.namespace + '/' + UPDATE_ENERGY)
      },
      updateAnnotations(dispatch) {
        return dispatch(this.namespace + '/' + UPDATE_ANNOTATIONS)
      },
    }),
    update() {
      const chart = this.$refs.chart.$refs.chart
      chart.clear()
      chart.showLoading()
      Promise.all([this.fetchData(), this.updateAnnotations()]).finally(() => {
        chart.hideLoading()
        chart.mergeOptions(this.chartOptions)
      })
    },
    handleUpdateAnnotations() {
      const chart = this.$refs.chart.$refs.chart
      chart.clear()
      chart.showLoading()
      this.updateAnnotations().finally(() => {
        chart.hideLoading()
        chart.mergeOptions(this.chartOptions)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
@media (max-width: 575.98px) {
  .chart {
    width: 450px;
  }
}

.chart-wrapper {
  overflow-x: auto;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
