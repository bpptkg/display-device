import { createCircleTemplate } from '@/utils/series'

export const mediaQuery = [
  {
    query: {
      maxWidth: 575.98,
    },
    option: {
      title: {
        top: 25,
        textStyle: {
          fontSize: 13,
        },
      },
    },
  },
]

export const createResidualChart = ({ modeling, field }) => {
  const stations = Object.values(modeling.station || {})
  const iteration = modeling.iteration || []

  const stationSeries = []
  const totalSeries = []

  if (field === 'total') {
    totalSeries.push({
      data: iteration.map((v) => [v.radius, v.res_total]),
      symbol: 'none',
      type: 'line',
      name: 'Residual Total',
    })
  } else {
    const resData = {}
    stations.forEach((station) => {
      resData[station.id] = []
    })

    iteration.forEach((item) => {
      item.displacements.forEach((d) => {
        resData[d.station].push([item.radius, d.displacement.res])
      })
    })

    if (field in modeling.station) {
      const station = modeling.station[field]
      stationSeries.push({
        symbol: 'none',
        type: 'line',
        name: station.name,
        data: resData[station.id],
      })
    }
  }

  const option = {
    title: {
      text: 'Residual',
      left: 'center',
      textStyle: {
        fontWeight: 'normal',
        fontSize: 13,
      },
    },
    xAxis: {
      type: 'log',
      scale: true,
      name: 'Radius (m)',
      nameLocation: 'center',
      nameGap: 30,
      splitLine: { show: false },
    },
    yAxis: {
      type: 'log',
      scale: true,
      name: 'Residual',
      nameLocation: 'center',
      nameGap: 50,
      splitLine: { show: false },
    },
    grid: {
      left: '20%',
      bottom: '20%',
    },
    series: [...totalSeries, ...stationSeries],
    legend: {
      type: 'scroll',
      bottom: 0,
      textStyle: { fontSize: 10 },
      itemStyle: { symbol: 'none' },
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const template = []

        params.forEach((param, index) => {
          const { seriesName, value, color } = param

          if (index === 0) {
            template.push(`<div>Radius: ${value[0]} m</div>`)
          }

          const valueFormatted = value[1].toFixed(4)
          template.push(`
          <div>${createCircleTemplate(color)}
          ${seriesName}: ${valueFormatted}</div>`)
        })

        return template.join('')
      },
    },
  }

  return {
    baseOption: option,
    media: mediaQuery,
  }
}
