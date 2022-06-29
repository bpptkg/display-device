<template>
  <DGLChart ref="chart" class="chart" :options="chartOptions" manual-update />
</template>

<script>
import client from '@/utils/client'
import { toUnixMiliSeconds } from '@/utils/series'
import { isObject } from '@/utils/common'

import DGLChart from '@/components/echarts/chart/DGLChart'
import {
  baseChartOptions,
  createSeries,
  createVisualMap,
  DEFAULT_SETTINGS,
} from '@/components/echarts/chart-options/hypocenter'

const VIEWER_SETTINGS = {
  ...DEFAULT_SETTINGS,
  showMagnitude: false,
  showTimeColormap: false,
}

const topoCacheKey = 'hypocenterViewer/topo/v1'

export default {
  name: 'HypocenterViewer',
  components: {
    DGLChart,
  },
  props: {
    events: {
      type: [Object, Array],
      default: function () {
        return {}
      },
    },
    settings: {
      type: Object,
      default: function () {
        return {}
      },
    },
    startTime: {
      type: Object,
      default: null,
    },
    endTime: {
      type: Object,
      default: null,
    },
    lazy: {
      type: Boolean,
      default: false,
    },
    hypocenterMode: {
      type: String,
      default: 'manual',
    },
  },
  data() {
    return {
      topo: [],
      error: null,
    }
  },
  computed: {
    data() {
      let events = []
      if (Array.isArray(this.events)) {
        events = this.events
      } else if (isObject(this.events)) {
        events = new Array(this.events)
      } else {
        events = []
      }

      if (this.hypocenterMode === 'manual') {
        return events
      } else {
        return events.map((event) => {
          return {
            ...event,
            latitude: event.btbb.lat,
            longitude: event.btbb.lon,
            depth: event.btbb.z,
            rmsp: event.btbb.rmsp,
          }
        })
      }
    },
    viewerSettings() {
      return {
        ...VIEWER_SETTINGS,
        ...this.settings,
      }
    },
    chartOptions() {
      const options = {
        ...baseChartOptions(this.viewerSettings),
        series: createSeries(this.topo, this.data, this.viewerSettings),
      }

      if (this.data.length) {
        options.visualMap = createVisualMap({
          ...this.viewerSettings,
          timeMin: toUnixMiliSeconds(this.startTime),
          timeMax: toUnixMiliSeconds(this.endTime),
        })
      }
      return options
    },
  },
  watch: {
    chartOptions(options) {
      const chart = this.$refs.chart.$refs.chart
      chart.mergeOptions(options)
    },
  },
  async mounted() {
    if (this.lazy) {
      setTimeout(() => {
        this.init()
      }, 300)
    } else {
      this.init()
    }
  },
  methods: {
    async fetchTopo() {
      const cachedTopo = JSON.parse(localStorage.getItem(topoCacheKey))
      if (
        cachedTopo !== null &&
        Array.isArray(cachedTopo) &&
        cachedTopo.length
      ) {
        this.topo = cachedTopo
      } else {
        const data = await client
          .get('topo/')
          .then((response) => response.data.data)
          .catch((error) => {
            this.error = error
            return []
          })
        localStorage.setItem(topoCacheKey, JSON.stringify(data))
        this.topo = data
      }
    },
    init() {
      const chart = this.$refs.chart.$refs.chart
      chart.showLoading()
      this.fetchTopo().finally(() => {
        chart.hideLoading()
        chart.mergeOptions(this.chartOptions)
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  height: 100%;
}
</style>
