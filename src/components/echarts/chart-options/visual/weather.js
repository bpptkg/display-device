import moment from 'moment'
import { createCircleTemplate } from '@/utils/series'
import { defaultToolbox } from '../common/toolbox'
import { get } from 'lodash'

export const Weather = {
  CERAH: 'CERAH',
  BERAWAN: 'BERAWAN',
  MENDUNG: 'MENDUNG',
  HUJAN: 'HUJAN',
}

export const weatherTextToValue = (text) => {
  switch (text) {
    case Weather.CERAH:
      return 4
    case Weather.BERAWAN:
      return 3
    case Weather.MENDUNG:
      return 2
    case Weather.HUJAN:
      return 1
    default:
      return 0
  }
}

export const weatherValueToText = (value, defaultValue = '') => {
  switch (value) {
    case 4:
      return Weather.CERAH
    case 1:
      return Weather.HUJAN
    case 2:
      return Weather.MENDUNG
    case 3:
      return Weather.BERAWAN
    default:
      return defaultValue
  }
}

export const weatherValueToColor = (value) => {
  switch (value) {
    case Weather.CERAH:
      return 'blue'
    case Weather.BERAWAN:
      return 'yellow'
    case Weather.MENDUNG:
      return 'green'
    case Weather.HUJAN:
      return 'red'
    default:
      return '#ffffff'
  }
}

export const createSeries = (rawData) => {
  const data = rawData.data ? rawData.data : []

  const morningData = []
  const noonData = []
  const afternoonData = []
  const nightData = []

  data.forEach((item) => {
    const timestamp = `${item.readable_report_date}`
    morningData.push({
      timestamp,
      status: get(item, 'weather_morning.weather', '-'),
    })
    noonData.push({
      timestamp,
      status: get(item, 'weather_noon.weather', '-'),
    })
    afternoonData.push({
      timestamp,
      status: get(item, 'weather_afternoon.weather', '-'),
    })
    nightData.push({
      timestamp,
      status: get(item, 'weather_night.weather', '-'),
    })
  })

  const options = [
    {
      data: morningData.map((item) => {
        return {
          value: [item.timestamp, 1, item.status],
          itemStyle: {
            color: weatherValueToColor(item.status),
          },
        }
      }),
      name: '00-06',
      symbol: 'none',
      type: 'bar',
      xAxisIndex: 0,
      yAxisIndex: 0,
      barGap: 0,
    },
    {
      data: noonData.map((item) => {
        return {
          value: [item.timestamp, 1, item.status],
          itemStyle: {
            color: weatherValueToColor(item.status),
          },
        }
      }),
      name: '06-12',
      symbol: 'none',
      type: 'bar',
      xAxisIndex: 0,
      yAxisIndex: 0,
    },
    {
      data: afternoonData.map((item) => {
        return {
          value: [item.timestamp, 1, item.status],
          itemStyle: {
            color: weatherValueToColor(item.status),
          },
        }
      }),
      name: '12-18',
      symbol: 'none',
      type: 'bar',
      xAxisIndex: 0,
      yAxisIndex: 0,
    },
    {
      data: nightData.map((item) => {
        return {
          value: [item.timestamp, 1, item.status],
          itemStyle: {
            color: weatherValueToColor(item.status),
          },
        }
      }),
      name: '18-24',
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
        left: 15,
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
      interval: 1,
    },
  ]

  return options
}

export const baseChartOptions = {
  backgroundColor: '#fff',
  title: {
    text: 'Cuaca',
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
          template.push(`${moment(value[0]).format('YYYY-MM-DD')}<br />`)
        }
        template.push(`
        ${createCircleTemplate(color)}
        ${seriesName}: ${value[2]}<br />
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

export const createWeatherChart = (data, min, max) => {
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
