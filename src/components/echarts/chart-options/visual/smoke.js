import moment from 'moment'
import { createCircleTemplate } from '@/utils/series'
import { defaultToolbox } from '../common/toolbox'
import {
  toUnixMiliSeconds,
  createDividerTemplate,
} from '../../../../utils/series'

export const Intensity = {
  TIPIS: 'TIPIS',
  SEDANG: 'SEDANG',
  TEBAL: 'TEBAL',
}

export const Pressure = {
  LEMAH: 'LEMAH',
  SEDANG: 'SEDANG',
  KUAT: 'KUAT',
}

export const intensityTextToValue = (text) => {
  switch (text) {
    case Intensity.TIPIS:
      return 1
    case Intensity.SEDANG:
      return 2
    case Intensity.TEBAL:
      return 3
    default:
      return 0
  }
}

export const intensityValueToText = (value, defaultValue = '') => {
  switch (value) {
    case 1:
      return Intensity.TIPIS
    case 2:
      return Intensity.SEDANG
    case 3:
      return Intensity.TEBAL
    default:
      return defaultValue
  }
}

export const smokeColor = (value) => {
  switch (value) {
    case 'PUTIH':
      return '#E3E3E3'
    case 'COKLAT':
      return '#D2691E'
    case 'KELABU':
      return '#808080'
    case 'HITAM':
      return '#000000'
    default:
      return '#ffffff'
  }
}

export const pressureTextToValue = (text) => {
  switch (text) {
    case Pressure.LEMAH:
      return 1
    case Pressure.SEDANG:
      return 2
    case Pressure.KUAT:
      return 3
    default:
      return 0
  }
}

export const pressureValueToText = (value, defaultValue = '') => {
  switch (value) {
    case 1:
      return Pressure.LEMAH
    case 2:
      return Pressure.SEDANG
    case 3:
      return Pressure.KUAT
    default:
      return defaultValue
  }
}

export const createSeries = (rawData) => {
  const data = rawData.data ? rawData.data : []

  const series = data
    .map((item) => {
      return item.smokes.map((smoke) => {
        const timestamp = `${item.readable_report_date} ${smoke.occured_at}:00`

        return {
          timestamp,
          intensity: smoke.intensity,
          pressure: smoke.pressure,
          color: smoke.color,
          direction: smoke.direction,
          height: smoke.height,
        }
      })
    })
    .flat(2)

  const options = [
    {
      data: series.map((item) => {
        return {
          value: [
            toUnixMiliSeconds(item.timestamp),
            item.height,
            item.pressure,
            item.color,
            item.direction,
            item.height,
          ],
          itemStyle: {
            color: smokeColor(item.color),
          },
        }
      }),
      name: 'Tinggi',
      symbol: 'none',
      type: 'bar',
      xAxisIndex: 0,
      yAxisIndex: 0,
    },
    {
      data: series.map((item) => {
        return {
          value: [
            toUnixMiliSeconds(item.timestamp),
            intensityTextToValue(item.intensity),
            item.pressure,
            item.color,
            item.direction,
            item.height,
          ],
        }
      }),
      name: 'Intensitas',
      type: 'scatter',
      symbol: 'circle',
      symbolSize: 7,
      xAxisIndex: 0,
      yAxisIndex: 1,
      itemStyle: {
        color: 'blue',
      },
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
        left: 60,
        right: 60,
      },
      title: {
        top: 30,
        textStyle: {
          fontSize: 12,
        },
      },
      yAxis: [
        {
          nameLocation: 'end',
          nameGap: 15,
        },
        {
          nameLocation: 'end',
          nameGap: 15,
        },
      ],
    },
  },
]

export const createYAxis = () => {
  const options = [
    {
      name: 'Tinggi (m)',
      nameGap: 50,
      nameLocation: 'center',
      splitLine: { show: false },
      type: 'value',
      scale: false,
    },
    {
      name: 'Intensitas',
      nameGap: 60,
      nameLocation: 'center',
      splitLine: { show: false },
      type: 'value',
      axisLabel: {
        formatter: (value) => {
          return intensityValueToText(value, '')
        },
      },
      interval: 1,
      scale: false,
    },
  ]

  return options
}

export const baseChartOptions = {
  backgroundColor: '#fff',
  title: {
    text: 'Asap',
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
            `${moment(value[0]).format('YYYY-MM-DD HH:mm:ss')}<br />`
          )
        }
        template.push(`
        ${createCircleTemplate(color)}
        ${seriesName}: ${
          seriesName === 'Intensitas'
            ? intensityValueToText(value[1])
            : value[1]
        }<br />
        `)

        if (index === params.length - 1) {
          template.push(`
        Tekanan: ${value[2]}<br />
        Warna: ${value[3]}<br />
        Arah: ${value[4]}<br />
        `)
        }
      })
      return template.join('')
    } else {
      const { seriesName, value, color, name, componentType } = params
      if (componentType === 'markLine') {
        return `${moment(value[0]).format('YYYY-MM-DD HH:mm:ss')}<br />
        ${createCircleTemplate(color)}
        ${name}`
      } else {
        return `${moment(value[0]).format('YYYY-MM-DD HH:mm:ss')}<br />
        ${createCircleTemplate(color)} 
        ${seriesName}<br />`
      }
    }
  }
}

export const createSmokeChart = (data, min, max) => {
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
