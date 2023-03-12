import moment from 'moment'
import { isFinite } from 'lodash'
import { SamplingTypes } from '@/constants/tiltmeter'
import { NO_DATA_NOTATION } from '@/constants/stats'
import { createCircleTemplate, mapFieldColumns } from '@/utils/series'
import { createRowGrid } from '@/utils/echarts/grid'
import { defaultToolbox } from '../common/toolbox'

export const SeriesName = Object.freeze({
  X: 'X',
  Y: 'Y',
  TEMPERATURE: 'Temperature',
})

export const createSeries = (
  data,
  { annotations = [], omitTemperature = false } = {}
) => {
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
      xAxisIndex: 0,
      yAxisIndex: 1,
    },
    {
      data: mapFieldColumns(data, 'timestamp', 'temperature'),
      markLine: {
        symbol: 'none',
        data: annotations,
        animation: false,
      },
      name: SeriesName.TEMPERATURE,
      symbol: 'none',
      type: 'line',
      xAxisIndex: 1,
      yAxisIndex: 2,
    },
  ]

  return omitTemperature ? options.slice(0, -1) : options
}

export const createXAxis = (min, max, { omitTemperature = false } = {}) => {
  const options = [
    {
      axisLabel: { show: omitTemperature ? true : false },
      gridIndex: 0,
      min,
      max,
      position: 'bottom',
      splitLine: { show: false },
      type: 'time',
    },
    {
      gridIndex: 1,
      min,
      max,
      splitLine: { show: false },
      position: 'bottom',
      type: 'time',
    },
  ]

  return omitTemperature ? options.slice(0, -1) : options
}

export const mediaQuery = [
  {
    query: {
      maxWidth: 575.98,
    },
    option: {
      grid: createRowGrid(2, { top: 15, bottom: 15, left: 22, right: 22 }),
      title: {
        top: 25,
        textStyle: {
          fontSize: 13,
        },
      },
    },
  },
]

export const createYAxis = ({ omitTemperature = false } = {}) => {
  const options = [
    {
      gridIndex: 0,
      name: 'X (\u00B5rad)',
      nameGap: 50,
      nameLocation: 'center',
      scale: true,
      splitLine: { show: false },
      type: 'value',
    },
    {
      gridIndex: 0,
      name: 'Y (\u00B5rad)',
      nameGap: 50,
      nameLocation: 'center',
      scale: true,
      splitLine: { show: false },
      type: 'value',
    },
    {
      gridIndex: 1,
      name: 'Temperature (\u00B0C)',
      nameGap: 50,
      nameLocation: 'center',
      scale: true,
      splitLine: { show: false },
      type: 'value',
    },
  ]

  return omitTemperature ? options.slice(0, -1) : options
}

export const createDataZoom = ({ omitTemperature = false } = {}) => {
  return [
    {
      type: 'slider',
      xAxisIndex: omitTemperature ? [0] : [0, 1],
      realtime: false,
    },
  ]
}

export const baseChartOptions = {
  backgroundColor: '#fff',
  dataZoom: createDataZoom(),
  grid: [
    {
      top: '10%',
      height: '35%',
    },
    {
      top: '50%',
      bottom: 80,
    },
  ],
  toolbox: defaultToolbox,
  yAxis: createYAxis(),
}

export const tooltipFormatter = (sampling) => {
  return (params) => {
    if (Array.isArray(params) && params.length) {
      const template = []

      params.forEach((param, index) => {
        const { seriesName, value, color } = param
        if (index === 0) {
          template.push(
            `${
              sampling === SamplingTypes.DAY
                ? moment(value[0]).format('YYYY-MM-DD')
                : moment(value[0]).format('YYYY-MM-DD HH:mm:ss')
            }<br />`
          )
        }
        template.push(`
        ${createCircleTemplate(color)}
        ${seriesName}: ${
          isFinite(value[1]) ? value[1].toFixed(2) : NO_DATA_NOTATION
        }<br />
        `)
      })
      return template.join('')
    } else {
      const { seriesName, value, color, name, componentType } = params
      if (componentType === 'markLine') {
        return `${moment(value[0]).format('YYYY-MM-DD HH:mm:ss')}<br />
        ${createCircleTemplate(color)}
        ${name}`
      } else {
        return `${
          sampling === SamplingTypes.DAY
            ? moment(value[0]).format('YYYY-MM-DD')
            : moment(value[0]).format('YYYY-MM-DD HH:mm:ss')
        }<br />
        ${createCircleTemplate(color)} 
        ${seriesName}: ${
          isFinite(value[1]) ? value[1].toFixed(2) : NO_DATA_NOTATION
        }<br />`
      }
    }
  }
}
