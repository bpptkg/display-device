import moment from 'moment'
import { axisLabelFormatter } from '@/utils/formatter'
import {
  mapFieldColumns,
  cumulativeSum,
  createCircleTemplate,
} from '@/utils/series'
import { defaultToolbox } from '../../common/toolbox'
import { SamplingTypes } from '@/store/seismic/equivalent-energy'

export const SeriesName = Object.freeze({
  RF_COUNT: 'RF count',
  AP_COUNT: 'AP count',
  DAILY_EQUIV_ENERGY: 'Daily equiv. energy',
  CUM_EQUIV_ENERGY: 'Cum. equiv. energy',
})

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
      name: 'Daily count',
      nameGap: 40,
      nameLocation: 'center',
      splitLine: { show: false },
      type: 'value',
    },
    {
      axisLabel: {
        formatter: axisLabelFormatter,
      },
      name: 'Daily equivalent energy',
      nameGap: 45,
      nameLocation: 'center',
      splitLine: { show: false },
      type: 'value',
    },
    {
      axisLabel: {
        formatter: axisLabelFormatter,
      },
      name: 'Cum. equivalent energy',
      nameGap: 45,
      nameLocation: 'center',
      offset: 65,
      splitLine: { show: false },
      type: 'value',
    },
  ]
}

export const createLegend = (options = {}) => {
  return { type: 'scroll', bottom: 0, ...options }
}

export const createSeries = (data, { annotations = [] } = {}) => {
  return [
    {
      barGap: '5%',
      barWidth: '80%',
      data: mapFieldColumns(data, 'timestamp', 'count_ROCKFALL'),
      markLine: {
        animation: false,
        data: annotations,
        symbol: 'none',
      },
      name: SeriesName.RF_COUNT,
      type: 'bar',
      stack: 'one',
      yAxisIndex: 0,
    },
    {
      barGap: '5%',
      barWidth: '80%',
      itemStyle: {
        color: '#c12e34',
      },
      data: mapFieldColumns(data, 'timestamp', 'count_AWANPANAS'),
      markLine: {
        animation: false,
        data: annotations,
        symbol: 'none',
      },
      name: SeriesName.AP_COUNT,
      type: 'bar',
      stack: 'one',
      yAxisIndex: 0,
    },
    {
      data: mapFieldColumns(data, 'timestamp', 'energy'),
      itemStyle: {
        color: '#fb7293',
      },
      lineStyle: {
        color: '#fb7293',
      },
      name: SeriesName.DAILY_EQUIV_ENERGY,
      type: 'line',
      symbol: 'circle',
      yAxisIndex: 1,
    },
    {
      data: cumulativeSum(mapFieldColumns(data, 'timestamp', 'energy')),
      itemStyle: {
        color: '#ffdb5c',
      },
      lineStyle: {
        color: '#ffdb5c',
      },
      name: SeriesName.CUM_EQUIV_ENERGY,
      type: 'line',
      symbol: 'circle',
      yAxisIndex: 2,
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
        grid: { left: 60 },
      },
    },
  ]
}

export const baseChartOptions = ({
  title = {},
  sampling = SamplingTypes.DAY,
} = {}) => {
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
      formatter: (params) => {
        const template = []

        params.forEach((param, index) => {
          const { seriesName, value, color } = param
          if (index === 0) {
            template.push(
              `${moment(value[0]).format(
                sampling === SamplingTypes.DAY
                  ? 'YYYY-MM-DD'
                  : 'YYYY-MM-DD HH:mm'
              )}<br />`
            )
          }
          template.push(`
          ${createCircleTemplate(color)}
          ${seriesName}: ${
            value[1]
              ? seriesName === SeriesName.RF_COUNT ||
                seriesName === SeriesName.AP_COUNT
                ? value[1].toFixed(0)
                : value[1].toFixed(2)
              : value[1]
          }<br />
          `)
        })
        return template.join('')
      },
    },
    title: {
      text: 'RF & AP Equivalent Energy',
      left: 'center',
      align: 'right',
      subtext: '',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      subtextStyle: {
        color: '#363636',
      },
      ...title,
    },
    yAxis: createYAxis(),
  }
}
