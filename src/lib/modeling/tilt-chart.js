import moment from 'moment'
import { isFinite } from 'lodash'
import { SamplingTypes } from '@/constants/tiltmeter'
import { NO_DATA_NOTATION } from '@/constants/stats'
import {
  createCircleTemplate,
  mapFieldColumns,
  toUnixMiliSeconds,
} from '@/utils/series'
import { createRowGrid } from '@/utils/echarts/grid'

export const SeriesName = Object.freeze({
  X: 'X',
  Y: 'Y',
  TEMPERATURE: 'Temperature',
})

export const createMarkPointOption = (data, text) => {
  let coords = []
  if (Array.isArray(data) && data.length >= 2) {
    const point = data[Math.floor(data.length / 2)]
    coords = [
      {
        coord: [toUnixMiliSeconds(point.timestamp), point.value],
      },
    ]
  }

  const opt = {
    itemStyle: {
      color: 'transparent',
    },
    label: {
      show: true,
      position: 'inside',
      formatter: text,
      color: 'black',
      fontSize: 13,
    },
    tooltip: {
      formatter: text,
    },
    data: coords,
  }

  return opt
}

export const createSeries = (data, xreg, zreg, xtext, ztext) => {
  const options = [
    {
      data: mapFieldColumns(data, 'timestamp', 'x'),
      name: SeriesName.X,
      symbol: 'none',
      type: 'line',
      xAxisIndex: 0,
      yAxisIndex: 0,
    },
    {
      data: mapFieldColumns(data, 'timestamp', 'y'),
      name: SeriesName.Y,
      symbol: 'none',
      type: 'line',
      xAxisIndex: 1,
      yAxisIndex: 1,
    },
    {
      data: mapFieldColumns(xreg, 'timestamp', 'value'),
      symbol: 'none',
      lineStyle: {
        color: 'red',
      },
      itemStyle: {
        color: 'red',
      },
      name: 'Reg. X',
      type: 'line',
      xAxisIndex: 0,
      yAxisIndex: 0,
      markPoint: createMarkPointOption(xreg, xtext),
    },
    {
      data: mapFieldColumns(zreg, 'timestamp', 'value'),
      symbol: 'none',
      lineStyle: {
        color: 'red',
      },
      itemStyle: {
        color: 'red',
      },
      name: 'Reg. Y',
      type: 'line',
      xAxisIndex: 1,
      yAxisIndex: 1,
      markPoint: createMarkPointOption(zreg, ztext),
    },
  ]

  return options
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

  return options
}

export const mediaQuery = [
  {
    query: {
      maxWidth: 575.98,
    },
    option: {
      grid: createRowGrid(2, { top: 5, bottom: 13, left: 18, right: 5 }),
      title: {
        top: 25,
        textStyle: {
          fontSize: 13,
        },
      },
    },
  },
]

export const createYAxis = () => {
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
      gridIndex: 1,
      name: 'Y (\u00B5rad)',
      nameGap: 50,
      nameLocation: 'center',
      scale: true,
      splitLine: { show: false },
      type: 'value',
    },
  ]

  return options
}

export const baseChartOptions = () => {
  return {
    backgroundColor: '#fff',
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
    yAxis: createYAxis(),
  }
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

export const createTiltChart = ({
  data,
  xreg,
  zreg,
  xtext,
  ztext,
  startTime,
  endTime,
}) => {
  const options = {
    ...baseChartOptions(),
    series: createSeries(data, xreg, zreg, xtext, ztext),
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        lineStyle: {
          type: 'dashed',
        },
      },
      formatter: tooltipFormatter(SamplingTypes.DAY),
    },
    xAxis: createXAxis(
      toUnixMiliSeconds(startTime),
      toUnixMiliSeconds(endTime)
    ),
  }
  return {
    baseOption: options,
    media: mediaQuery,
  }
}
