import moment from 'moment'
import { createCircleTemplate } from '@/utils/series'
import { defaultToolbox } from '../common/toolbox'

const SoundType = {
  DENTUMAN: 'DENTUMAN',
  GEMURUH: 'GEMURUH',
}

export const createSeries = (rawData) => {
  const data = rawData.data ? rawData.data : []

  const series = data
    .map((item) => {
      return item.event_sounds.map((sound) => {
        return {
          timestamp: `${item.readable_report_date} ${sound.occured_at}:00`,
          status: 1,
          remark: sound.remark,
        }
      })
    })
    .flat(2)

  const options = [
    {
      data: series.map((item) => {
        return {
          value: [item.timestamp, item.status, item.remark],
          itemStyle: {
            color:
              item.remark === SoundType.DENTUMAN
                ? 'yellow'
                : item.remark === SoundType.GEMURUH
                ? 'red'
                : 'white',
          },
        }
      }),
      name: 'Sound',
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
    },
  ]

  return options
}

export const baseChartOptions = {
  backgroundColor: '#fff',
  title: {
    text: 'Suara',
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

export const createSoundChart = (data, min, max) => {
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
