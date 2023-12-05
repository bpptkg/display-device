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
  NORTHING: 'Northing',
  EASTING: 'Easting',
  ELEVATION: 'Elevation',
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

export const createSeries = (data, xreg, yreg, zreg, xtext, ytext, ztext) => {
  const options = [
    {
      data: mapFieldColumns(data, 'timestamp', 'east'),
      name: SeriesName.EASTING,
      symbol: 'circle',
      symbolSize: 7,
      type: 'scatter',
      xAxisIndex: 0,
      yAxisIndex: 0,
    },
    {
      data: mapFieldColumns(data, 'timestamp', 'north'),
      name: SeriesName.NORTHING,
      symbol: 'circle',
      symbolSize: 7,
      type: 'scatter',
      xAxisIndex: 1,
      yAxisIndex: 1,
    },
    {
      data: mapFieldColumns(data, 'timestamp', 'up'),
      name: SeriesName.ELEVATION,
      symbol: 'circle',
      symbolSize: 7,
      type: 'scatter',
      xAxisIndex: 2,
      yAxisIndex: 2,
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
      data: mapFieldColumns(yreg, 'timestamp', 'value'),
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
      markPoint: createMarkPointOption(yreg, ytext),
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
      name: 'Reg. Z',
      type: 'line',
      xAxisIndex: 2,
      yAxisIndex: 2,
      markPoint: createMarkPointOption(zreg, ztext),
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
      gridIndex: 2,
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
      grid: createRowGrid(3, {
        top: 15,
        bottom: 10,
        left: 20,
        right: 5,
        margin: 3,
      }),
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
      name: 'Easting (m)',
      nameGap: 2,
      nameLocation: 'end',
      nameTextStyle: {
        align: 'left',
      },
      scale: true,
      splitLine: { show: false },
      axisLabel: { formatter: (v) => v.toFixed(3) },
      type: 'value',
    },
    {
      gridIndex: 1,
      name: 'Northing (m)',
      nameGap: 2,
      nameLocation: 'end',
      nameTextStyle: {
        align: 'left',
      },
      scale: true,
      splitLine: { show: false },
      axisLabel: { formatter: (v) => v.toFixed(3) },
      type: 'value',
    },
    {
      gridIndex: 2,
      name: 'Elevation (m)',
      nameGap: 2,
      nameLocation: 'end',
      nameTextStyle: {
        align: 'left',
      },
      scale: true,
      splitLine: { show: false },
      axisLabel: { formatter: (v) => v.toFixed(3) },
      type: 'value',
    },
  ]

  return options
}

export const baseChartOptions = () => {
  return {
    title: {
      text: 'GPS Data',
      left: 'center',
      textStyle: {
        fontWeight: 'normal',
      },
    },
    backgroundColor: '#fff',
    grid: createRowGrid(3, { margin: 5, right: 5 }),
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

export const createGpsChart = ({
  data,
  xreg,
  yreg,
  zreg,
  xtext,
  ytext,
  ztext,
  startTime,
  endTime,
}) => {
  const options = {
    ...baseChartOptions(),
    series: createSeries(data, xreg, yreg, zreg, xtext, ytext, ztext),
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
