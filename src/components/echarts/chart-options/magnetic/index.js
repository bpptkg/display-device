import { isFinite } from 'lodash'
import { createRowGrid } from '@/utils/echarts/grid'
import { mapFieldColumns } from '@/utils/series'
import { defaultToolbox } from '../common/toolbox'
import { defaultTooltipFormatter } from '@/utils/echarts/tooltip'

export const SeriesName = Object.freeze({
  X: 'X',
  Y: 'Y',
  Z: 'Z',
  R: 'R',
  T: 'Temperature',
  B: 'Battery',
})

export const seriesProps = {
  [SeriesName.X]: { valueSuffix: ' nT' },
  [SeriesName.Y]: { valueSuffix: ' nT' },
  [SeriesName.Z]: { valueSuffix: ' nT' },
  [SeriesName.R]: { valueSuffix: ' nT' },
  [SeriesName.T]: { valueSuffix: ' \u00B0C', valueDecimals: 2 },
  [SeriesName.B]: { valueSuffix: ' V', valueDecimals: 2 },
}

export const createSeries = (data, { annotations = [] } = {}) => {
  const options = [
    {
      data: mapFieldColumns(data, 'timestamp', 'x'),
      markLine: {
        symbol: 'none',
        data: annotations,
        animation: false,
      },
      name: SeriesName.X,
      symbol: 'none',
      type: 'line',
      xAxisIndex: 0,
      yAxisIndex: 0,
    },
    {
      data: mapFieldColumns(data, 'timestamp', 'y'),
      markLine: {
        symbol: 'none',
        data: annotations,
        animation: false,
      },
      name: SeriesName.Y,
      symbol: 'none',
      type: 'line',
      xAxisIndex: 1,
      yAxisIndex: 1,
    },
    {
      data: mapFieldColumns(data, 'timestamp', 'z'),
      markLine: {
        symbol: 'none',
        data: annotations,
        animation: false,
      },
      name: SeriesName.Z,
      symbol: 'none',
      type: 'line',
      xAxisIndex: 2,
      yAxisIndex: 2,
    },
    {
      data: mapFieldColumns(data, 'timestamp', 'r'),
      markLine: {
        symbol: 'none',
        data: annotations,
        animation: false,
      },
      name: SeriesName.R,
      symbol: 'none',
      type: 'line',
      xAxisIndex: 3,
      yAxisIndex: 3,
    },
    {
      data: mapFieldColumns(data, 'timestamp', 'temperature'),
      markLine: {
        symbol: 'none',
        data: annotations,
        animation: false,
      },
      name: SeriesName.T,
      symbol: 'none',
      type: 'line',
      xAxisIndex: 4,
      yAxisIndex: 4,
    },
    {
      data: mapFieldColumns(data, 'timestamp', 'battery'),
      markLine: {
        symbol: 'none',
        data: annotations,
        animation: false,
      },
      name: SeriesName.B,
      symbol: 'none',
      type: 'line',
      xAxisIndex: 5,
      yAxisIndex: 5,
    },
  ]

  return options
}

export const createXAxis = (min, max) => {
  const options = [
    {
      axisLabel: { show: false },
      gridIndex: 0,
      min,
      max,
      position: 'bottom',
      splitLine: { show: false },
      type: 'time',
    },
    {
      axisLabel: { show: false },
      gridIndex: 1,
      min,
      max,
      splitLine: { show: false },
      position: 'bottom',
      type: 'time',
    },
    {
      axisLabel: { show: false },
      gridIndex: 2,
      min,
      max,
      position: 'bottom',
      splitLine: { show: false },
      type: 'time',
    },
    {
      axisLabel: { show: false },
      gridIndex: 3,
      min,
      max,
      position: 'bottom',
      splitLine: { show: false },
      type: 'time',
    },
    {
      axisLabel: { show: false },
      gridIndex: 4,
      min,
      max,
      position: 'bottom',
      splitLine: { show: false },
      type: 'time',
    },
    {
      axisLabel: { show: true },
      gridIndex: 5,
      min,
      max,
      splitLine: { show: false },
      position: 'bottom',
      type: 'time',
    },
  ]

  return options
}

export const mediaQuery = [
  {
    query: {
      maxWidth: 575.98,
    },
    option: {
      grid: createRowGrid(6, { bottom: 11, right: 5, left: 20, top: 10 }),
      title: {
        top: 27,
        textStyle: {
          fontSize: 13,
        },
      },
    },
  },
]

export const yAxisLabelFormatter = (v) => (isFinite(v) ? v.toFixed(3) : '-')

export const createYAxis = () => {
  const options = [
    {
      gridIndex: 0,
      name: 'X (nT)',
      nameGap: 55,
      nameLocation: 'center',
      scale: true,
      splitLine: { show: false },
      type: 'value',
    },
    {
      gridIndex: 1,
      name: 'Y (nT)',
      nameGap: 55,
      nameLocation: 'center',
      scale: true,
      splitLine: { show: false },
      type: 'value',
    },
    {
      gridIndex: 2,
      name: 'Z (nT)',
      nameGap: 55,
      nameLocation: 'center',
      scale: true,
      splitLine: { show: false },
      type: 'value',
    },
    {
      gridIndex: 3,
      name: 'R (nT)',
      nameGap: 55,
      nameLocation: 'center',
      scale: true,
      splitLine: { show: false },
      type: 'value',
    },
    {
      gridIndex: 4,
      name: 'Temperature (\u00B0C)',
      nameGap: 55,
      nameLocation: 'center',
      scale: true,
      splitLine: { show: false },
      type: 'value',
    },
    {
      gridIndex: 5,
      name: 'Battery (V)',
      nameGap: 55,
      nameLocation: 'center',
      scale: true,
      splitLine: { show: false },
      type: 'value',
    },
  ]

  return options
}

export const baseChartOptions = {
  backgroundColor: '#fff',
  dataZoom: {
    type: 'slider',
    xAxisIndex: [0, 1, 2, 3, 4, 5],
    realtime: false,
  },
  grid: createRowGrid(6, { bottom: 11, right: 5 }),
  title: {
    text: 'Base Magnetic Imogiri',
    left: 'center',
    align: 'right',
    textStyle: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    subtextStyle: {
      color: '#363636',
    },
  },
  toolbox: defaultToolbox,
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'line',
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
  yAxis: createYAxis(),
}
