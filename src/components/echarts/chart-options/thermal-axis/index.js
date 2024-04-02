import moment from 'moment'
import { isFinite } from 'lodash'
import { SamplingTypes } from '@/constants/tiltmeter'
import { NO_DATA_NOTATION } from '@/constants/stats'
import {
  createCircleTemplate,
  mapFieldColumns,
  getSeriesByIndex,
} from '@/utils/series'
import { defaultToolbox } from '../common/toolbox'

export const SeriesName = Object.freeze({
  TEMPERATURE: 'Max. Temp.',
})

export const createSeries = (data, areas, { annotations = [] } = {}) => {
  const options = areas
    .map((area, index) => {
      return [
        {
          data: mapFieldColumns(
            getSeriesByIndex(data, index),
            'timestamp',
            'temp'
          ),
          name: `${area.name}`,
          markLine: {
            symbol: 'none',
            data: annotations,
            animation: false,
          },
          symbol: 'none',
          type: 'line',
        },
      ]
    })
    .flat(1)

  return options
}

export const createXAxis = (min, max) => {
  const options = [
    {
      axisLabel: { show: true },
      gridIndex: 0,
      min,
      max,
      position: 'bottom',
      splitLine: { show: false },
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
      grid: {
        top: 60,
        bottom: 95,
        left: 50,
        right: 10,
      },
      title: {
        top: 30,
        textStyle: {
          fontSize: 12,
        },
      },
      yAxis: {
        nameLocation: 'end',
        nameGap: 15,
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
  ]

  return options
}

export const baseChartOptions = {
  backgroundColor: '#fff',
  title: {
    text: 'Thermal Axis Kaliurang',
    textStyle: {
      fontWeight: 'bold',
      fontSize: 16,
    },
    left: 'center',
  },
  dataZoom: {
    type: 'slider',
    realtime: false,
    bottom: 30,
  },
  grid: {
    top: 50,
    bottom: 95,
  },
  legend: {
    type: 'scroll',
    bottom: 0,
    itemWidth: 15,
    itemHeight: 10,
    textStyle: { fontSize: 10 },
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
  areas,
  annotations,
  min,
  max,
  sampling
) => {
  return {
    baseOption: {
      ...baseChartOptions,
      series: createSeries(data, areas, { annotations }),
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
    },
    media: mediaQuery,
  }
}
