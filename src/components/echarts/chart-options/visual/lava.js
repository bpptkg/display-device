import moment from 'moment'
import { createCircleTemplate, createDividerTemplate } from '@/utils/series'
import { defaultToolbox } from '../common/toolbox'

const Scale = {
  KECIL: 'KECIL',
  SEDANG: 'SEDANG',
  BESAR: 'BESAR',
}

const sizeTextToValue = (text) => {
  switch (text) {
    case Scale.KECIL:
      return 1
    case Scale.SEDANG:
      return 2
    case Scale.BESAR:
      return 3
    default:
      return 0
  }
}

const sizeValueToText = (value, defaultValue = '') => {
  switch (value) {
    case 1:
      return Scale.KECIL
    case 2:
      return Scale.SEDANG
    case 3:
      return Scale.BESAR
    default:
      return defaultValue
  }
}

export const createSeries = (rawData) => {
  const data = rawData.data ? rawData.data : []

  const series = data
    .map((item) => {
      return item.event_lavas.map((event) => {
        const timestamp = `${item.readable_report_date} ${event.start_time}:00`
        return {
          timestamp,
          size: sizeTextToValue(event.size),
          rainfall: event.rainfall,
          remark: event.remark,
        }
      })
    })
    .flat(2)

  const options = [
    {
      data: series.map((item) => {
        return {
          value: [item.timestamp, item.size, item.rainfall, item.remark],
        }
      }),
      name: 'Lahar',
      symbol: 'none',
      type: 'bar',
      xAxisIndex: 0,
      yAxisIndex: 0,
    },
  ]

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
        left: 80,
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
      name: '',
      nameGap: 50,
      nameLocation: 'center',
      splitLine: { show: false },
      type: 'value',
      axisLabel: {
        show: true,
        formatter: (value) => {
          return sizeValueToText(value, '')
        },
      },
    },
  ]

  return options
}

export const baseChartOptions = {
  backgroundColor: '#fff',
  title: {
    text: 'Lahar',
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

export const tooltipFormatter = () => {
  return (params) => {
    if (Array.isArray(params) && params.length) {
      const template = []

      params.forEach((param, index) => {
        const { seriesName, value, color } = param
        if (index === 0) {
          template.push(
            `${moment(value[0]).format('YYYY-MM-D HH:mm:ss')}<br />`
          )
        }
        template.push(`
        ${createCircleTemplate(color)}
        ${seriesName}: ${sizeValueToText(value[1], '-')}<br />
        ${createDividerTemplate()}
        Intensitas: ${value[2]} mm<br />
        Keterangan: ${value[3]}<br />
        `)
      })
      return template.join('')
    } else {
      const { seriesName, value, color, name, componentType } = params
      if (componentType === 'markLine') {
        return `${moment(value[0]).format('YYYY-MM-DD')}<br />
        ${createCircleTemplate(color)}
        ${name}`
      } else {
        return `${moment(value[0]).format('YYYY-MM-DD')}<br />
        ${createCircleTemplate(color)} 
        ${seriesName}<br />`
      }
    }
  }
}

export const createLavaChart = (data, min, max) => {
  return {
    baseOption: {
      ...baseChartOptions,
      series: createSeries(data),
      xAxis: createXAxis(min, max),
      tooltip: {
        trigger: 'axis',
        formatter: tooltipFormatter(),
      },
    },
    media: mediaQuery,
  }
}
