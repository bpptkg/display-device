import { max, min } from 'lodash'
import { NO_DATA_NOTATION } from '../../../../constants/stats'
import { createRowGrid } from '../../../../utils/echarts/grid'
import { createCircleTemplate } from '../../../../utils/series'
import { defaultToolbox } from '../common/toolbox'

const createXAxis = (min, max) => {
  const margin = 0.05 * (max - min)
  const options = [
    {
      gridIndex: 0,
      axisLabel: { show: false },
      splitLine: { show: false },
      position: 'bottom',
      type: 'value',
      min: min - margin,
      max: max + margin,
    },
  ]

  return options
}

const createYAxis = () => {
  const options = [
    {
      gridIndex: 0,
      nameGap: 60,
      nameLocation: 'center',
      scale: true,
      splitLine: { show: false },
      type: 'value',
      axisLabel: {
        show: true,
      },
    },
  ]

  return options
}

const mediaQuery = [
  {
    query: {
      maxWidth: 575.98,
    },
    option: {
      grid: createRowGrid(1, { top: 10, bottom: 10, left: 8, right: 0 }),
    },
  },
]

const getDcba = (data, x) => {
  return data.dcba
    .filter((d) =>
      x === 'lat'
        ? d.plot.toLowerCase() === 'lintang'
        : d.plot.toLowerCase() === 'bujur'
    )
    .sort((a, b) => a[x] - b[x])
}

const getMinMax = (data, x) => {
  const dcba = getDcba(data, x)
  const minValue = min(dcba.map((d) => d[x]))
  const maxValue = max(dcba.map((d) => d[x]))
  return { minValue, maxValue }
}

const createSeries = ({ data, x }) => {
  const dcba = getDcba(data, x)
  return [
    {
      data: dcba.map((d) => [d[x], d.elev_scl, d.sta_fid, d.sta]),
      name: 'Elevation (scaled)',
      type: 'line',
      symbol: 'circle',
      symbolSize: 6,
      xAxisIndex: 0,
      yAxisIndex: 0,
      itemStyle: {
        color: '#1f77b4',
      },
    },
    {
      data: dcba.map((d) => [d[x], d.dcba, d.sta_fid, d.sta]),
      name: 'ΔABL',
      type: 'line',
      symbol: 'circle',
      symbolSize: 6,
      xAxisIndex: 0,
      yAxisIndex: 0,
      itemStyle: {
        color: '#2ca02c',
      },
    },
  ]
}

export const tooltipFormatter = () => {
  return (params) => {
    if (Array.isArray(params) && params.length) {
      const template = []

      params.forEach((param, index) => {
        const { seriesName, value, color } = param
        if (index === 0) {
          template.push(`
            ${createCircleTemplate(color)} ${value[2]} (${value[3]})<br />
            X: ${value[0].toFixed(4)}<br />
          `)
        }
        template.push(`
        ${seriesName}: ${
          isFinite(value[1]) ? value[1].toFixed(4) : NO_DATA_NOTATION
        }<br />
        `)
      })
      return template.join('')
    } else {
      return ''
    }
  }
}

export const createDcbaChartOptions = ({ data, x }) => {
  const { minValue, maxValue } = getMinMax(data, x)
  return {
    baseOption: {
      backgroundColor: '#fff',
      title: {
        text: 'Gravity ΔABL',
        textStyle: {
          fontWeight: 'bold',
          fontSize: 14,
        },
        left: 'center',
      },
      legend: {
        type: 'plain',
        left: 'center',
        bottom: 0,
        itemWidth: 10,
        itemHeight: 10,
        textStyle: { fontSize: 9 },
      },
      toolbox: defaultToolbox,
      grid: createRowGrid(1, { top: 10, bottom: 10, left: 5, right: 0 }),
      xAxis: createXAxis(minValue, maxValue),
      yAxis: createYAxis(),
      series: createSeries({
        data,
        x,
      }),
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          lineStyle: {
            type: 'dashed',
          },
        },
        formatter: tooltipFormatter(),
      },
    },
    media: mediaQuery,
  }
}
