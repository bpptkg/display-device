import { DATE_FORMAT, DATETIME_FORMAT } from '@/constants/date'
import { Sampling } from '@/constants/rfap-distance'
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
      name: 'RF-AP Count',
      nameGap: 40,
      nameLocation: 'center',
      scale: false,
      splitLine: { show: false },
      type: 'value',
    },
    {
      name: 'RF-AP Distance (km)',
      nameGap: 40,
      nameLocation: 'center',
      scale: false,
      splitLine: { show: false },
      type: 'value',
    },
  ]
}

export const SeriesNames = Object.freeze({
  RF_COUNT: 'RF Count',
  AP_COUNT: 'AP Count',
  RF_DISTANCE: 'RF Distance',
  AP_DISTANCE: 'AP Distance',
})

const entries = new Map([
  [
    SeriesNames.RF_COUNT,
    {
      valueSuffix: '',
    },
  ],
  [
    SeriesNames.AP_COUNT,
    {
      valueSuffix: '',
    },
  ],
  [
    SeriesNames.RF_DISTANCE,
    {
      valueSuffix: ' km',
    },
  ],
  [
    SeriesNames.AP_DISTANCE,
    {
      valueSuffix: ' km',
    },
  ],
])

export const seriesProps = Object.fromEntries(entries)

export const createSeries = (data) => {
  return [
    {
      areaStyle: {},
      data: mapFieldColumns(data, 'timestamp', 'rf_count'),
      itemStyle: {
        color: '#0098d9',
      },
      name: SeriesNames.RF_COUNT,
      type: 'bar',
      stack: 'one',
      yAxisIndex: 0,
    },
    {
      areaStyle: {},
      data: mapFieldColumns(data, 'timestamp', 'ap_count'),
      itemStyle: {
        color: '#c12e34',
      },
      name: SeriesNames.AP_COUNT,
      type: 'bar',
      stack: 'one',
      yAxisIndex: 0,
    },
    {
      // Convert m to km.
      data: mapFieldColumns(data, 'timestamp', [
        'rf_dist',
        (v) => (v ? v / 1000 : v),
      ]),
      itemStyle: {
        color: '#2b821d',
      },
      name: SeriesNames.RF_DISTANCE,
      type: 'scatter',
      symbol: 'circle',
      symbolSize: 8,
      yAxisIndex: 1,
    },
    {
      // Convert m to km.
      data: mapFieldColumns(data, 'timestamp', [
        'ap_dist',
        (v) => (v ? v / 1000 : v),
      ]),
      itemStyle: {
        color: '#e6b600',
      },
      name: SeriesNames.AP_DISTANCE,
      type: 'scatter',
      symbol: 'triangle',
      symbolSize: 8,
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
        grid: { left: 60, right: 60 },
      },
    },
  ]
}

export const baseChartOptions = (sampling) => {
  return {
    backgroundColor: '#fff',
    dataZoom: { type: 'slider', realtime: false, bottom: 30 },
    grid: { bottom: 100 },
    legend: { type: 'scroll', bottom: 0 },
    title: {
      text: 'RF-AP Distance',
      left: 'center',
      align: 'right',
      textStyle: {
        fontSize: 14,
        fontWeight: 'normal',
      },
    },
    toolbox: defaultToolbox,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        lineStyle: {
          type: 'dashed',
        },
      },
      formatter: defaultTooltipFormatter({
        format: sampling === Sampling.DAY ? DATE_FORMAT : DATETIME_FORMAT,
        valueDecimals: 0,
        noData: '-',
        seriesProps,
      }),
    },
    yAxis: createYAxis(),
  }
}
