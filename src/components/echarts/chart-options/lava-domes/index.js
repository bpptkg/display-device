import { DATETIME_FORMAT } from '@/constants/date'
import { axisLabelFormatter } from '@/utils/formatter'
import { mapFieldColumns } from '@/utils/series'
import { defaultTooltipFormatter } from '@/utils/echarts/tooltip'
import { defaultToolbox } from '../common/toolbox'

export const createXAxis = (min, max) => {
  return {
    max,
    min,
    splitLine: { show: false },
    type: 'time',
  }
}

export const createYAxis = () => {
  return [
    {
      axisLabel: {
        formatter: axisLabelFormatter,
      },
      name: 'Volume (m\u00B3)',
      nameGap: 40,
      nameLocation: 'center',
      scale: false,
      splitLine: { show: false },
      type: 'value',
    },
    {
      axisLabel: {
        formatter: axisLabelFormatter,
      },
      name: 'Rate (m\u00B3/day)',
      nameGap: 45,
      nameLocation: 'center',
      scale: true,
      splitLine: { show: false },
      type: 'value',
    },
  ]
}

export const SeriesNames = Object.freeze({
  VOLUME: 'Volume',
  RATE: 'Rate',
})

const entries = new Map([
  [
    SeriesNames.VOLUME,
    {
      valueSuffix: ' m\u00B3',
    },
  ],
  [
    SeriesNames.RATE,
    {
      valueSuffix: ' m\u00B3/day',
    },
  ],
])

export const seriesProps = Object.fromEntries(entries)

export const createSeries = (data, { annotations = [] } = {}) => {
  return [
    {
      areaStyle: {},
      data: mapFieldColumns(data, 'timestamp', 'volume'),
      name: SeriesNames.VOLUME,
      markLine: {
        animation: false,
        data: annotations,
        symbol: 'none',
      },
      type: 'line',
      symbol: 'none',
      yAxisIndex: 0,
    },
    {
      data: mapFieldColumns(data, 'timestamp', 'rate'),
      name: SeriesNames.RATE,
      type: 'line',
      symbol: 'circle',
      yAxisIndex: 1,
    },
  ]
}

export const mediaQuery = () => {
  return [
    {
      query: {
        maxWidth: 575.98,
      },
      option: {
        grid: { left: 60, right: 60, top: 80 },
        title: {
          top: 30,
          fontSize: 13,
        },
      },
    },
  ]
}

export const baseChartOptions = () => {
  return {
    backgroundColor: '#fff',
    dataZoom: { type: 'slider', realtime: false, bottom: 30 },
    grid: { bottom: 100, right: 150 },
    legend: { type: 'scroll', bottom: 0 },
    toolbox: defaultToolbox,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        lineStyle: {
          type: 'dashed',
        },
      },
      formatter: defaultTooltipFormatter({
        format: DATETIME_FORMAT,
        valueDecimals: 2,
        seriesProps,
      }),
    },
    yAxis: createYAxis(),
  }
}
