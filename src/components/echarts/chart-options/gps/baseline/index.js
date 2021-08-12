import { getSeriesByIndex, makeIndex, mapFieldColumns } from '@/utils/series'
import { defaultTooltipFormatter } from '@/utils/echarts/tooltip'
import { defaultToolbox } from '../../common/toolbox'
import { gpsLabels } from '@/constants/gps'

export const createSeries = (data, names, { annotations = [] } = {}) => {
  return names.map((name, index) => {
    return {
      data: mapFieldColumns(
        getSeriesByIndex(data, index),
        'timestamp',
        'baseline'
      ),
      name: gpsLabels[name],
      symbol: 'circle',
      symbolSize: 6,
      type: 'line',
      xAxisIndex: index,
      yAxisIndex: index,
      markLine: {
        symbol: 'none',
        data: annotations,
        animation: false,
      },
    }
  })
}

export const createXAxis = (nrows, min, max) => {
  const axis = []
  const indices = makeIndex(nrows)
  indices.forEach((index) => {
    if (index === nrows - 1) {
      axis.push({
        gridIndex: index,
        min,
        max,
        splitLine: { show: false },
        type: 'time',
      })
    } else {
      axis.push({
        axisLabel: { show: false },
        axisTick: { show: false },
        gridIndex: index,
        min,
        max,
        splitLine: { show: false },
        type: 'time',
      })
    }
  })
  return axis
}

export const createYAxis = (names) => {
  return names.map((name, index) => {
    return {
      axisLabel: { formatter: (v) => v.toFixed(3) },
      gridIndex: index,
      minInterval: 0.01,
      maxInterval: 0.1,
      name: `${gpsLabels[name]} (m)`,
      nameGap: 10,
      nameLocation: 'end',
      splitLine: { show: false },
      splitNumber: 4,
      scale: true,
      type: 'value',
    }
  })
}

export const createDataZoom = (axisLength) => {
  return [
    { type: 'slider', xAxisIndex: makeIndex(axisLength), realtime: false },
  ]
}

export const baseChartOptions = {
  backgroundColor: '#fff',
  toolbox: defaultToolbox,
  tooltip: {
    trigger: 'item',
    axisPointer: {
      type: 'cross',
      lineStyle: {
        type: 'dashed',
      },
    },
    formatter: defaultTooltipFormatter({
      format: 'YYYY-MM-DD HH:mm:ss',
      valueDecimals: 3,
      valueSuffix: ' m',
    }),
  },
}
