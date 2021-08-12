import moment from 'moment'
import {
  CONVERSION_FACTOR,
  EnergyTotalSeriesIndex,
  EnergyTypes,
  SamplingTypes,
} from '@/constants/energy'
import {
  createCircleTemplate,
  cumulativeSum,
  getSeriesByIndex,
  mapFieldColumns,
} from '@/utils/series'
import { scaledFormatter } from '@/utils/formatter'
import { defaultToolbox } from '../../common/toolbox'

export const createXAxis = (min, max) => {
  return {
    max,
    min,
    splitLine: { show: false },
    type: 'time',
  }
}

/**
 * Simple fuzzy label formatter.
 */
function axisLabelFormatter(value) {
  return scaledFormatter(['', 'k', 'M', 'G'])(value)
}

export const createYAxis = (type) => {
  if (type === EnergyTypes.TOTAL) {
    return [
      {
        axisLabel: {
          formatter: axisLabelFormatter,
        },
        name: 'Energy Total (MJ)',
        nameGap: 45,
        nameLocation: 'center',
        scale: false,
        splitLine: { show: true },
        type: 'value',
      },
      {
        axisLabel: {
          formatter: axisLabelFormatter,
        },
        name: 'Cum. Energy VTB+MP (MJ)',
        nameGap: 42,
        nameLocation: 'center',
        scale: false,
        splitLine: { show: false },
        type: 'value',
      },
      {
        axisLabel: {
          formatter: axisLabelFormatter,
        },
        name: 'Cum. Energy VTA (MJ)',
        nameGap: 42,
        nameLocation: 'center',
        offset: 65,
        scale: false,
        splitLine: { show: false },
        type: 'value',
      },
      {
        axisLabel: {
          formatter: axisLabelFormatter,
        },
        name: 'Cum. Energy Total (MJ)',
        nameGap: 42,
        nameLocation: 'center',
        offset: 130,
        scale: false,
        splitLine: { show: false },
        type: 'value',
      },
    ]
  } else {
    return [
      {
        axisLabel: {
          formatter: axisLabelFormatter,
        },
        name: 'Energy (MJ)',
        nameGap: 45,
        nameLocation: 'center',
        scale: false,
        splitLine: { show: true },
        type: 'value',
      },
      {
        axisLabel: {
          formatter: axisLabelFormatter,
        },
        name: 'Cumulative Energy (MJ)',
        nameGap: 45,
        nameLocation: 'center',
        scale: false,
        splitLine: { show: false },
        type: 'value',
      },
    ]
  }
}

export const createLegend = (options = {}) => {
  return { type: 'scroll', bottom: 0, ...options }
}

export const createSeries = (data, type, { annotations = [] } = {}) => {
  return type === EnergyTypes.TOTAL
    ? [
        {
          barGap: '5%',
          barWidth: '80%',
          data: mapFieldColumns(
            getSeriesByIndex(data, EnergyTotalSeriesIndex[EnergyTypes.TOTAL]),
            'timestamp',
            ['energy', (energy) => energy / CONVERSION_FACTOR]
          ),
          markLine: {
            animation: false,
            data: annotations,
            symbol: 'none',
          },
          name: 'Energy Total',
          type: 'bar',
          yAxisIndex: 0,
        },
        {
          data: cumulativeSum(
            mapFieldColumns(
              getSeriesByIndex(data, EnergyTotalSeriesIndex[EnergyTypes.VTBMP]),
              'timestamp',
              ['energy', (energy) => energy / CONVERSION_FACTOR]
            )
          ),
          name: 'Cum. Energy VTB+MP',
          type: 'line',
          symbol: 'circle',
          yAxisIndex: 1,
        },
        {
          data: cumulativeSum(
            mapFieldColumns(
              getSeriesByIndex(data, EnergyTotalSeriesIndex[EnergyTypes.VTA]),
              'timestamp',
              ['energy', (energy) => energy / CONVERSION_FACTOR]
            )
          ),
          itemStyle: {
            color: '#fb7293',
          },
          lineStyle: {
            color: '#fb7293',
          },
          name: 'Cum. Energy VTA',
          type: 'line',
          symbol: 'circle',
          yAxisIndex: 2,
        },
        {
          data: cumulativeSum(
            mapFieldColumns(
              getSeriesByIndex(data, EnergyTotalSeriesIndex[EnergyTypes.TOTAL]),
              'timestamp',
              ['energy', (energy) => energy / CONVERSION_FACTOR]
            )
          ),
          itemStyle: {
            color: '#ffdb5c',
          },
          lineStyle: {
            color: '#ffdb5c',
          },
          name: 'Cum. Energy Total',
          type: 'line',
          symbol: 'circle',
          yAxisIndex: 3,
        },
      ]
    : [
        {
          barGap: '5%',
          barWidth: '80%',
          data: mapFieldColumns(data, 'timestamp', [
            'energy',
            (energy) => energy / CONVERSION_FACTOR,
          ]),
          markLine: {
            animation: false,
            data: annotations,
            symbol: 'none',
          },
          name: 'Energy',
          type: 'bar',
        },
        {
          data: cumulativeSum(
            mapFieldColumns(data, 'timestamp', [
              'energy',
              (energy) => energy / CONVERSION_FACTOR,
            ])
          ),
          name: 'Cumulative Energy',
          symbol: 'circle',
          type: 'line',
          yAxisIndex: 1,
        },
      ]
}

export const mediaQuery = (type) => {
  return [
    {
      query: {
        maxWidth: 575.98,
      },
      option: {
        grid:
          type === EnergyTypes.TOTAL
            ? {
                left: '15%',
                right: '42%',
              }
            : {
                left: '20%',
                right: '20%',
              },
        title: {
          top: 28,
          textStyle: {
            fontSize: 12,
            fontWeight: 'normal',
          },
        },
      },
    },
  ]
}

export const createGrid = (type) => {
  if (type === EnergyTypes.TOTAL) {
    return {
      left: 80,
      right: 190,
      bottom: 100,
    }
  }
  return {
    bottom: 80,
  }
}

export const createDataZoom = (type) => {
  if (type === EnergyTypes.TOTAL) {
    return [{ type: 'slider', xAxisIndex: 0, realtime: false, bottom: 30 }]
  }
  return [{ type: 'slider', xAxisIndex: 0, realtime: false }]
}

export const baseChartOptions = (sampling) => {
  return {
    backgroundColor: '#fff',
    toolbox: defaultToolbox,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
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
          ${seriesName}: ${value[1] ? value[1].toFixed(2) : value[1]} MJ<br />
          `)
        })
        return template.join('')
      },
    },
  }
}
