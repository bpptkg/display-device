import { defaultToolbox } from '../common/toolbox'
import { defaultTooltipFormatter } from '@/utils/echarts/tooltip'
import { makeIndex, mapFieldColumns } from '@/utils/series'
import { createRowGrid } from '@/utils/echarts/grid'

export const SeriesNames = Object.freeze({
  EASTING: 'Easting',
  NORTHING: 'Northing',
  ELEVATION: 'Elevation',
})

export const seriesProps = {
  [SeriesNames.EASTING]: {
    valueSuffix: ' m',
  },
  [SeriesNames.NORTHING]: {
    valueSuffix: ' m',
  },
  [SeriesNames.ELEVATION]: {
    valueSuffix: ' m',
  },
}

export const createSeries = (data, { annotations = [] } = {}) => {
  return [
    {
      data: mapFieldColumns(data, 'timestamp', 'easting'),
      markLine: {
        symbol: 'none',
        data: annotations,
        animation: false,
      },
      name: SeriesNames.EASTING,
      symbol: 'circle',
      symbolSize: 7,
      type: 'scatter',
      xAxisIndex: 0,
      yAxisIndex: 0,
    },
    {
      data: mapFieldColumns(data, 'timestamp', 'northing'),
      markLine: {
        symbol: 'none',
        data: annotations,
        animation: false,
      },
      name: SeriesNames.NORTHING,
      symbol: 'circle',
      symbolSize: 7,
      type: 'scatter',
      xAxisIndex: 1,
      yAxisIndex: 1,
    },
    {
      data: mapFieldColumns(data, 'timestamp', 'elevation'),
      markLine: {
        symbol: 'none',
        data: annotations,
        animation: false,
      },
      name: SeriesNames.ELEVATION,
      symbol: 'circle',
      symbolSize: 7,
      type: 'scatter',
      xAxisIndex: 2,
      yAxisIndex: 2,
    },
  ]
}

export const createXAxis = (min, max) => {
  const indices = makeIndex(3)

  return indices.map((v) => {
    const base = {
      axisLabel: { show: false },
      axisTick: { show: false },
      gridIndex: v,
      min,
      max,
      position: 'bottom',
      splitLine: { show: false },
      type: 'time',
    }
    if (v === indices.length - 1) {
      return { ...base, axisLabel: { show: true } }
    } else {
      return base
    }
  })
}

export const mediaQuery = [
  {
    query: {
      maxWidth: 575.98,
    },
    option: {
      grid: createRowGrid(3, {
        margin: 4,
        top: 25,
        right: 5,
        bottom: 12,
        left: 25,
      }),
      title: {
        top: 22,
        textStyle: {
          fontSize: 13,
        },
      },
    },
  },
]

export const baseChartOptions = {
  backgroundColor: '#fff',
  dataZoom: [{ type: 'slider', xAxisIndex: [0, 1, 2], realtime: true }],
  grid: createRowGrid(3, {
    margin: 4,
    top: 15,
    right: 5,
    bottom: 14,
    left: 12,
  }),
  toolbox: defaultToolbox,
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      lineStyle: {
        type: 'dashed',
      },
    },
    formatter: defaultTooltipFormatter({
      format: 'YYYY-MM-DD HH:mm:ss',
      valueDecimals: 3,
      seriesProps: seriesProps,
    }),
  },
  yAxis: [
    {
      axisLabel: { formatter: (v) => v.toFixed(3) },
      gridIndex: 0,
      name: 'Easting (m)',
      nameGap: 12,
      nameLocation: 'end',
      scale: true,
      splitLine: { show: true },
      splitNumber: 4,
      type: 'value',
    },
    {
      axisLabel: { formatter: (v) => v.toFixed(3) },
      gridIndex: 1,
      name: 'Northing (m)',
      nameGap: 12,
      nameLocation: 'end',
      scale: true,
      splitLine: { show: true },
      splitNumber: 4,
      type: 'value',
    },
    {
      axisLabel: { formatter: (v) => v.toFixed(3) },
      gridIndex: 2,
      name: 'Elevation (m)',
      nameGap: 12,
      nameLocation: 'end',
      scale: true,
      splitLine: { show: true },
      splitNumber: 4,
      type: 'value',
    },
  ],
}
