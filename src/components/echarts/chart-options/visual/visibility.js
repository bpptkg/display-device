import moment from 'moment'
import { createCircleTemplate } from '@/utils/series'
import { defaultToolbox } from '../common/toolbox'
import { get } from 'lodash'

const Visibility = {
  TAMPAK: 'TAMPAK',
  KABUT01: 'KABUT 01',
  KABUT02: 'KABUT 02',
  KABUT03: 'KABUT 03',
}

const visibilityTextToValue = (text) => {
  switch (text) {
    case Visibility.TAMPAK:
      return 4
    case Visibility.KABUT01:
      return 1
    case Visibility.KABUT02:
      return 2
    case Visibility.KABUT03:
      return 3
    default:
      return 0
  }
}

const visibilityValueToText = (value, defaultValue = '') => {
  switch (value) {
    case 4:
      return Visibility.TAMPAK
    case 1:
      return Visibility.KABUT01
    case 2:
      return Visibility.KABUT02
    case 3:
      return Visibility.KABUT03
    default:
      return defaultValue
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
      status: visibilityTextToValue(
        get(item, 'weather_morning.visibility', '-')
      ),
    })
    noonData.push({
      timestamp,
      status: visibilityTextToValue(get(item, 'weather_noon.visibility', '-')),
    })
    afternoonData.push({
      timestamp,
      status: visibilityTextToValue(
        get(item, 'weather_afternoon.visibility', '-')
      ),
    })
    nightData.push({
      timestamp,
      status: visibilityTextToValue(get(item, 'weather_night.visibility', '-')),
    })
  })

  const options = [
    {
      data: morningData.map((item) => {
        return {
          value: [item.timestamp, item.status],
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
          value: [item.timestamp, item.status],
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
          value: [item.timestamp, item.status],
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
          value: [item.timestamp, item.status],
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
          return visibilityValueToText(value)
        },
      },
    },
  ]

  return options
}

export const baseChartOptions = {
  backgroundColor: '#fff',
  title: {
    text: 'Visibility',
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
          template.push(`${moment(value[0]).format('YYYY-MM-DD')}<br />`)
        }
        template.push(`
        ${createCircleTemplate(color)}
        ${seriesName}: ${visibilityValueToText(value[1], '-')}<br />
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

export const createVisibilityChart = (data, min, max) => {
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
