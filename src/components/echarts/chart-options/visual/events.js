import moment from 'moment'
import { createCircleTemplate, createDividerTemplate } from '@/utils/series'
import { defaultToolbox } from '../common/toolbox'

export const createSeries = (
  soundRawData,
  staticFireRawData,
  shakeRawData,
  lavaRawData
) => {
  const soundData = soundRawData.data ? soundRawData.data : []
  const staticFireData = staticFireRawData.data ? staticFireRawData.data : []
  const shakeData = shakeRawData.data ? shakeRawData.data : []
  const lavaData = lavaRawData.data ? lavaRawData.data : []

  const soundSeries = soundData
    .map((item) => {
      return item.event_sounds.map((sound) => {
        return {
          timestamp: `${item.readable_report_date} ${sound.occured_at}:00`,
          remark: sound.remark,
        }
      })
    })
    .flat(2)

  const staticFireSeries = staticFireData
    .map((item) => {
      return item.event_static_fires.map((event) => {
        return {
          timestamp: `${item.readable_report_date} ${event.start_time}:00`,
          location: event.location,
          intensity: event.intensity,
          remark: event.remark,
        }
      })
    })
    .flat(2)

  const shakeSeries = shakeData
    .map((item) => {
      return item.event_shakes.map((event) => {
        return {
          timestamp: `${item.readable_report_date} ${event.occurred_at}:00`,
          scale: event.scale,
          remark: event.remark,
        }
      })
    })
    .flat(2)

  const lavaSeries = lavaData
    .map((item) => {
      return item.event_lavas.map((event) => {
        const timestamp = `${item.readable_report_date} ${event.start_time}:00`
        return {
          timestamp,
          size: event.size,
          rainfall: event.rainfall,
          remark: event.remark,
        }
      })
    })
    .flat(2)

  const options = [
    {
      data: soundSeries.map((item) => {
        return {
          value: [
            item.timestamp, // Index 0
            1, // 1
            item.remark, // 2
          ],
        }
      }),
      name: 'Suara',
      symbol: 'none',
      type: 'bar',
      xAxisIndex: 0,
      yAxisIndex: 0,
      itemStyle: {
        color: 'yellow',
      },
    },
    {
      data: staticFireSeries.map((item) => {
        return {
          value: [
            item.timestamp, // Index 0
            1, // 1
            item.location, // 2
            item.intensity, // 3
            item.remark, // 4
          ],
        }
      }),
      name: 'Api Diam',
      symbol: 'none',
      type: 'bar',
      xAxisIndex: 0,
      yAxisIndex: 0,
      itemStyle: {
        color: 'red',
      },
    },
    {
      data: shakeSeries.map((item) => {
        return {
          value: [
            item.timestamp, // Index 0
            1, // 1
            item.scale, // 2
            item.remark, // 3
          ],
        }
      }),
      name: 'Gempa Terasa',
      symbol: 'none',
      type: 'bar',
      xAxisIndex: 0,
      yAxisIndex: 0,
      itemStyle: {
        color: 'green',
      },
    },
    {
      data: lavaSeries.map((item) => {
        return {
          value: [
            item.timestamp, // Index 0
            1, // 1
            item.size, // 2
            item.rainfall, // 3
            item.remark, // 4
          ],
        }
      }),
      name: 'Lahar',
      symbol: 'none',
      type: 'bar',
      xAxisIndex: 0,
      yAxisIndex: 0,
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
      interval: 1,
    },
  ]

  return options
}

export const baseChartOptions = {
  backgroundColor: '#fff',
  title: {
    text: 'Kejadian',
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
            `${moment(value[0]).format('YYYY-MM-DD HH:mm:ss')}<br />`
          )
        }

        template.push(`
        ${createCircleTemplate(color)}
        ${seriesName}<br />
        ${createDividerTemplate()}
        `)

        if (seriesName === 'Suara') {
          template.push(`Keterangan: ${value[2]}<br />`)
        } else if (seriesName === 'Api Diam') {
          template.push(`Lokasi: ${value[2]}<br />
          Itensitas: ${value[3]}<br />
          Keterangan: ${value[4]}<br />`)
        } else if (seriesName === 'Gempa Terasa') {
          template.push(`Skala: ${value[2]}<br />
          Keterangan: ${value[3]}<br />`)
        } else if (seriesName === 'Lahar') {
          template.push(`Ukuran: ${value[2]}<br />
            Curah Hujan: ${
              Number.isFinite(value[3]) ? value[3].toFixed(2) : '-'
            } mm<br />
            Keterangan: ${value[4]}<br />`)
        }
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

export const createEventsChart = (
  soundRawData,
  staticFireRawData,
  shakeRawData,
  lavaRawData,
  min,
  max
) => {
  return {
    baseOption: {
      ...baseChartOptions,
      series: createSeries(
        soundRawData,
        staticFireRawData,
        shakeRawData,
        lavaRawData
      ),
      xAxis: createXAxis(min, max),
      tooltip: {
        trigger: 'axis',
        formatter: tooltipFormatter(),
      },
    },
    media: mediaQuery,
  }
}
