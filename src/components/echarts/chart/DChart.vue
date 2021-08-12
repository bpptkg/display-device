<template>
  <ECharts
    ref="chart"
    :options="options"
    theme="light"
    class="chart"
    autoresize
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script>
import ECharts from 'vue-echarts'
import 'echarts/lib/chart/bar'
import 'echarts/lib/chart/boxplot'
import 'echarts/lib/chart/custom'
import 'echarts/lib/chart/line'
import 'echarts/lib/chart/lines'
import 'echarts/lib/chart/scatter'
import 'echarts/lib/component/axis'
import 'echarts/lib/component/axisPointer'
import 'echarts/lib/component/angleAxis'
import 'echarts/lib/component/dataZoom'
import 'echarts/lib/component/dataZoomInside'
import 'echarts/lib/component/dataZoomSlider'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/gridSimple'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/legendScroll'
import 'echarts/lib/component/markArea'
import 'echarts/lib/component/markLine'
import 'echarts/lib/component/markPoint'
import 'echarts/lib/component/polar'
import 'echarts/lib/component/title'
import 'echarts/lib/component/toolbox'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/visualMap'
import 'echarts/lib/component/visualMapContinuous'
import 'echarts/lib/component/visualMapPiecewise'

import '@/lib/echarts-extension/custom-visualmap/visualMapCustomPiecewise'

// Import ECharts themes.
import '@/lib/echarts-theme/dark'
import '@/lib/echarts-theme/infographic'
import '@/lib/echarts-theme/macarons'
import '@/lib/echarts-theme/roma'
import '@/lib/echarts-theme/shine'
import '@/lib/echarts-theme/vintage'

export default {
  name: 'DChart',
  components: {
    ECharts,
  },
  props: {
    options: {
      type: Object,
      default: function () {
        return {}
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.chart {
  width: 100%;
  min-height: 400px;
}
</style>
