import { renderItem } from '@/lib/echarts-extension/chart/errorbar'
import { createRowGrid } from '@/utils/echarts/grid'
import { defaultTooltipFormatter } from '@/utils/echarts/tooltip'
import { makeIndex, mapErrorBar, mapFieldColumns } from '@/utils/series'
import { defaultToolbox } from '../../common/toolbox'

export const SeriesNames = Object.freeze({
  EAST: 'Easting',
  NORTH: 'Northing',
  UP: 'Elevation',
  ERR_EAST: 'Error Easting',
  ERR_NORTH: 'Error Northing',
  ERR_UP: 'Error Elevation',
})

const errorValueFormatter = (v) => `${v[1].toFixed(3)}-${v[2].toFixed(3)} m`

export const seriesProps = {
  [SeriesNames.EAST]: {
    valueSuffix: ' m',
  },
  [SeriesNames.NORTH]: {
    valueSuffix: ' m',
  },
  [SeriesNames.UP]: {
    valueSuffix: ' m',
  },
  [SeriesNames.ERR_EAST]: {
    valueFormatter: errorValueFormatter,
  },
  [SeriesNames.ERR_NORTH]: {
    valueFormatter: errorValueFormatter,
  },
  [SeriesNames.ERR_UP]: {
    valueFormatter: errorValueFormatter,
  },
}

export const createSeries = (data, { annotations = [] } = {}) => {
  return [
    {
      data: mapFieldColumns(data, 'timestamp', 'east'),
      markLine: {
        symbol: 'none',
        data: annotations,
        animation: false,
      },
      name: SeriesNames.EAST,
      symbol: 'circle',
      symbolSize: 7,
      type: 'scatter',
      xAxisIndex: 0,
      yAxisIndex: 0,
    },
    {
      data: mapFieldColumns(data, 'timestamp', 'north'),
      markLine: {
        symbol: 'none',
        data: annotations,
        animation: false,
      },
      name: SeriesNames.NORTH,
      symbol: 'circle',
      symbolSize: 7,
      type: 'scatter',
      xAxisIndex: 1,
      yAxisIndex: 1,
    },
    {
      data: mapFieldColumns(data, 'timestamp', 'up'),
      markLine: {
        symbol: 'none',
        data: annotations,
        animation: false,
      },
      name: SeriesNames.UP,
      symbol: 'circle',
      symbolSize: 7,
      type: 'scatter',
      xAxisIndex: 2,
      yAxisIndex: 2,
    },
    {
      data: mapErrorBar(data, 'timestamp', 'east', 'err_east'),
      name: SeriesNames.ERR_EAST,
      itemStyle: {
        color: 'black',
        borderWidth: 1,
        opacity: 0.8,
      },
      type: 'custom',
      renderItem: renderItem,
      xAxisIndex: 0,
      yAxisIndex: 0,
    },
    {
      data: mapErrorBar(data, 'timestamp', 'north', 'err_north'),
      name: SeriesNames.ERR_NORTH,
      itemStyle: {
        color: 'black',
        borderWidth: 1,
        opacity: 0.8,
      },
      type: 'custom',
      renderItem: renderItem,
      xAxisIndex: 1,
      yAxisIndex: 1,
    },
    {
      data: mapErrorBar(data, 'timestamp', 'up', 'err_up'),
      name: SeriesNames.ERR_UP,
      itemStyle: {
        color: 'black',
        borderWidth: 1,
        opacity: 0.8,
      },
      type: 'custom',
      renderItem: renderItem,
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
        top: 20,
        right: 5,
        bottom: 12,
        left: 26,
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
  dataZoom: [{ type: 'slider', xAxisIndex: [0, 1, 2], realtime: false }],
  grid: createRowGrid(3, {
    margin: 4,
    top: 15,
    right: 5,
    bottom: 12,
    left: 12,
  }),
  toolbox: defaultToolbox,
  tooltip: {
    trigger: 'item',
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
      nameGap: 15,
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
      nameGap: 15,
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
      nameGap: 15,
      nameLocation: 'end',
      scale: true,
      splitLine: { show: true },
      splitNumber: 4,
      type: 'value',
    },
  ],
}
