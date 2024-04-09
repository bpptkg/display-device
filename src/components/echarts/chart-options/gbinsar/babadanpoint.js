import moment from 'moment'
import { isFinite } from 'lodash'
import { SamplingTypes } from '@/constants/tiltmeter'
import { NO_DATA_NOTATION } from '@/constants/stats'
import { createCircleTemplate, mapFieldColumns } from '@/utils/series'
import { defaultToolbox } from '../common/toolbox'

export const Points = [
  {
    name: 'RB1',
    field: 'rb1',
  },
  {
    name: 'T1992',
    field: 't1992',
  },
  {
    name: 'RB2-RTS',
    field: 'rb2_rts',
  },
  {
    name: 'RB3-RTS',
    field: 'rb3_rts',
  },
  {
    name: 'Titik Stabil',
    field: 'titik_stabil',
  },
  {
    name: '1998 Bawah',
    field: 'bawah1998',
  },
  {
    name: 'Bawah RB2',
    field: 'bawah_rb2',
  },
  {
    name: '1998',
    field: 't1998',
  },
]

export const createSeries = (data, points, { annotations = [] } = {}) => {
  const options = points
    .filter((point) => point.isVisible)
    .map((point) => {
      return {
        data: mapFieldColumns(data, 'timestamp', point.field),
        markLine: {
          symbol: 'none',
          data: annotations,
          animation: false,
        },
        name: point.name,
        symbol: 'none',
        type: 'line',
        xAxisIndex: 0,
        yAxisIndex: 0,
      }
    })

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
      name: 'Δx (mm)',
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
    text: 'GBInsar Point Displacement',
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

export const createBabadanPointChartOptions = (
  data,
  points,
  annotations,
  min,
  max,
  sampling
) => {
  return {
    baseOption: {
      ...baseChartOptions,
      series: createSeries(data, points, { annotations }),
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
