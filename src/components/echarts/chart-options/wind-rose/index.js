import { saveAsImageToolbox } from '../common/toolbox'

const sector = 16
const startAngle = 360 / sector / 2 + 90

export const baseChartOptions = {
  angleAxis: {
    type: 'category',
    startAngle: startAngle,
    axisLine: {
      show: true,
    },
    axisTick: {
      alignWithLabel: true,
    },
    data: [
      'N',
      'NNE',
      'NE',
      'ENE',
      'E',
      'ESE',
      'SE',
      'SSE',
      'S',
      'SSW',
      'SW',
      'WSW',
      'W',
      'WNW',
      'NW',
      'NNW',
    ],
  },
  backgroundColor: '#fff',
  polar: {},
  radiusAxis: {
    axisLine: {
      show: false,
    },
    axisLabel: {
      show: false,
    },
    minorTick: {
      show: false,
    },
    axisTick: {
      show: false,
    },
  },
  title: {
    align: 'right',
    left: 'center',
    show: false,
    text: 'Wind Rose',
    textStyle: { fontSize: 14, fontWeight: 'normal' },
  },
  toolbox: {
    feature: {
      saveAsImage: saveAsImageToolbox,
    },
  },
  tooltip: {
    show: true,
    formatter: function (params) {
      return `${params.seriesName} km/h<br />
      <span style="background-color:${
        params.color
      };width:12px;height:12px;border-radius:50%;display:inline-block;">
      </span> ${params.name}: ${params.value.toFixed(2)}%`
    },
  },
}

export const createSeries = (data, wsBins) => {
  if (data.length === 0 || wsBins.length === 0) return []

  const series = []
  data.forEach((bin, index) => {
    series.push({
      type: 'bar',
      data: bin,
      coordinateSystem: 'polar',
      stack: 'a',
      name: `${wsBins[index].toFixed(1)}-${wsBins[index + 1].toFixed(1)}`,
    })
  })
  return series
}

export const createLegend = (wsBins) => {
  if (wsBins.length === 0) return []

  const data = []
  for (let i = 0; i < wsBins.length - 1; i++) {
    data.push({
      name: `${wsBins[i].toFixed(1)}-${wsBins[i + 1].toFixed(1)}`,
    })
  }
  return data
}
