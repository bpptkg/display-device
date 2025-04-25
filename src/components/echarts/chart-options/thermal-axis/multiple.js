import moment from 'moment'
import { isFinite } from 'lodash'
import { SamplingTypes } from '@/constants/tiltmeter'
import { NO_DATA_NOTATION } from '@/constants/stats'
import { createCircleTemplate, mapFieldColumns } from '@/utils/series'
import { defaultToolbox } from '../common/toolbox'
import { smartIndex, tab20ColorMap } from '../../../../utils/tab20'
import { createRowGrid } from '../../../../utils/echarts/grid'
import { min, max, mean } from 'lodash'

export const getStatsInfo = (data) => {
  const stats = []

  data.forEach((field, index) => {
    field.results.forEach((result) => {
      const array = result.data.map((v) => v.temp)
      stats.push({
        name: `${result.area} (${field.field_type})`,
        min: min(array),
        max: max(array),
        mean: mean(array),
      })
    })
  })

  return stats
}

export const createSeries = (data, { annotations = [] } = {}) => {
  const options = []
  const length = data.reduce((acc, field) => acc + field.results.length, 0)
  data.forEach((field, index) => {
    field.results.forEach((result, resultIndex) => {
      options.push({
        data: mapFieldColumns(result.data, 'timestamp', 'temp'),
        name: `${result.area}`,
        markLine: {
          symbol: 'none',
          data: annotations,
          animation: false,
        },
        type: 'line',
        symbol: 'none',
        symbolSize: 3,
        itemStyle: {
          color: tab20ColorMap[smartIndex(index + resultIndex, length)],
        },
        xAxisIndex: field.field_type === 'max_temp' ? 0 : 1,
        yAxisIndex: field.field_type === 'max_temp' ? 0 : 1,
      })
    })
  })

  return options
}

export const createXAxis = (min, max) => {
  const options = [
    {
      gridIndex: 0,
      axisLabel: { show: false },
      min,
      max,
      position: 'bottom',
      splitLine: { show: false },
      type: 'time',
    },
    {
      gridIndex: 1,
      axisLabel: { show: true },
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
      grid: createRowGrid(2, { top: 10, bottom: 17, left: 20, right: 5 }),
      title: {
        top: 25,
        textStyle: {
          fontSize: 13,
        },
      },
      legend: {
        type: 'scroll',
        bottom: 0,
        itemWidth: 10,
        itemHeight: 10,
        textStyle: { fontSize: 9 },
      },
    },
  },
]

export const createYAxis = () => {
  const options = [
    {
      gridIndex: 0,
      name: 'Max. Temp. (\u00B0C)',
      nameGap: 50,
      nameLocation: 'center',
      scale: true,
      splitLine: { show: false },
      type: 'value',
      axisLabel: {
        show: true,
        formatter: (value) => {
          return value.toFixed(0)
        },
      },
    },
    {
      gridIndex: 1,
      name: 'Avg. Temp. (\u00B0C)',
      nameGap: 50,
      nameLocation: 'center',
      scale: true,
      splitLine: { show: false },
      type: 'value',
      axisLabel: {
        show: true,
        formatter: (value) => {
          return value.toFixed(0)
        },
      },
    },
  ]

  return options
}

export const baseChartOptions = {
  backgroundColor: '#fff',
  title: {
    text: 'Thermal Axis',
    textStyle: {
      fontWeight: 'bold',
      fontSize: 16,
    },
    left: 'center',
  },
  dataZoom: {
    type: 'slider',
    realtime: false,
    bottom: 40,
    xAxisIndex: [0, 1],
  },
  grid: createRowGrid(2, { top: 10, bottom: 17, left: 10, right: 5 }),
  legend: {
    type: 'plain',
    left: 'center',
    bottom: 0,
    itemWidth: 10,
    itemHeight: 10,
    textStyle: { fontSize: 9 },
  },
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

export const createThermalAxisChartOptions = (
  data,
  annotations,
  min,
  max,
  sampling,
  options = {}
) => {
  const { title } = options
  return {
    baseOption: {
      ...baseChartOptions,
      series: createSeries(data, { annotations }),
      xAxis: createXAxis(min, max),
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          lineStyle: {
            type: 'dashed',
          },
        },
        formatter: tooltipFormatter(sampling),
      },
      title: {
        ...baseChartOptions.title,
        text: title,
      },
    },
    media: mediaQuery,
  }
}
