import { getSeriesByIndex, makeIndex, mapFieldColumns } from '@/utils/series'
import { defaultTooltipFormatter } from '@/utils/echarts/tooltip'
import { createRowGrid } from '@/utils/echarts/grid'
import { defaultToolbox } from '../../common/toolbox'
import edmOptions from './edm-options'

export const createSeries = (data, { annotations = [] } = {}) => {
  return edmOptions.map((edm, index) => {
    return {
      data: mapFieldColumns(
        getSeriesByIndex(data, index),
        'timestamp',
        'slope_distance'
      ),
      markLine: {
        symbol: 'none',
        data: annotations,
        animation: false,
      },
      name: `${edm.benchmark}-${edm.reflector}`,
      symbol: 'circle',
      symbolSize: 6,
      type: 'line',
      xAxisIndex: index,
      yAxisIndex: index,
    }
  })
}

export const createXAxis = (min, max) => {
  const nrows = edmOptions.length
  const axis = []
  const indices = makeIndex(nrows)

  indices.forEach((index) => {
    if (index === nrows - 1) {
      axis.push({
        gridIndex: index,
        min,
        max,
        splitLine: { show: true },
        type: 'time',
      })
    } else {
      axis.push({
        axisLabel: { show: false },
        axisTick: { show: false },
        gridIndex: index,
        min,
        max,
        splitLine: { show: true },
        type: 'time',
      })
    }
  })
  return axis
}

export const createYAxis = () => {
  return edmOptions.map((edm, index) => {
    return {
      axisLabel: { formatter: (v) => (v ? v.toFixed(3) : v) },
      gridIndex: index,
      name: `${edm.benchmark}-${edm.reflector} (m)`,
      nameGap: 10,
      nameLocation: 'end',
      nameTextStyle: { align: 'center', fontSize: 12 },
      scale: true,
      splitLine: { show: true },
      splitNumber: 4,
      type: 'value',
    }
  })
}

export const baseChartOptions = () => {
  return {
    backgroundColor: '#fff',
    dataZoom: [
      {
        type: 'slider',
        xAxisIndex: makeIndex(edmOptions.length),
        realtime: false,
      },
    ],
    grid: createRowGrid(edmOptions.length, { left: 15, bottom: 5 }),
    title: {
      text: 'EDM',
      left: 'center',
      align: 'right',
      textStyle: {
        fontSize: 14,
        fontWeight: 'normal',
      },
    },
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
}

export const mediaQuery = [
  {
    query: {
      maxWidth: 575.98,
    },
    option: {
      grid: createRowGrid(edmOptions.length, { left: 20, bottom: 5 }),
    },
  },
]
