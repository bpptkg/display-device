import { defaultToolbox } from '../common/toolbox'
import { max, min } from 'lodash'
import { createCircleTemplate } from '../../../../utils/series'
import { NO_DATA_NOTATION } from '../../../../constants/stats'
import { createRowGrid } from '../../../../utils/echarts/grid'

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
    {
      gridIndex: 1,
      axisLabel: { show: false },
      splitLine: { show: false },
      position: 'bottom',
      type: 'value',
      min: min - margin,
      max: max + margin,
    },
    {
      gridIndex: 2,
      axisLabel: { show: true },
      splitLine: { show: false },
      position: 'bottom',
      type: 'value',
      min: min - margin,
      max: max + margin,
    },
  ]

  return options
}

const createYAxis = ({ name }) => {
  const options = [
    {
      gridIndex: 0,
      name: 'Elevation (m)',
      nameGap: 60,
      nameLocation: 'center',
      scale: true,
      splitLine: { show: false },
      type: 'value',
      axisLabel: {
        show: true,
      },
    },
    {
      gridIndex: 1,
      name: name === 'g_obs' ? 'Gobs 1 (mGal)' : 'ABL 1',
      nameGap: 60,
      nameLocation: 'center',
      scale: true,
      splitLine: { show: false },
      type: 'value',
      axisLabel: {
        show: true,
      },
    },
    {
      gridIndex: 2,
      name: name === 'g_obs' ? 'Gobs 2 (mGal)' : 'ABL 2',
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
      grid: createRowGrid(3, { top: 10, bottom: 10, left: 20, right: 0 }),
    },
  },
]

const getG1G2 = (data, x) => {
  const g1 = data.g1
    .filter((d) =>
      x === 'lat'
        ? d.plot.toLowerCase() === 'lintang'
        : d.plot.toLowerCase() === 'bujur'
    )
    .sort((a, b) => a[x] - b[x])
  const g2 = data.g2
    .filter((d) =>
      x === 'lat'
        ? d.plot.toLowerCase() === 'lintang'
        : d.plot.toLowerCase() === 'bujur'
    )
    .sort((a, b) => a[x] - b[x])
  return { g1, g2 }
}

const getMinMax = (data, x) => {
  const { g1, g2 } = getG1G2(data, x)
  const minValue = Math.min(min(g1.map((d) => d[x])), min(g2.map((d) => d[x])))
  const maxValue = Math.max(max(g1.map((d) => d[x])), max(g2.map((d) => d[x])))
  return {
    minValue,
    maxValue,
  }
}

const createSeries = ({ data, x, name }) => {
  const { g1, g2 } = getG1G2(data, x)
  return [
    {
      data: g1.map((d) => [d[x], d.elev, d.sta_fid, d.sta]),
      name: 'Elevation',
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
      data: g1.map((d) => [d[x], d[name], d.sta_fid, d.sta]),
      name: name === 'g_obs' ? `Gobs 1` : 'ABL 1',
      type: 'line',
      symbol: 'circle',
      symbolSize: 6,
      xAxisIndex: 1,
      yAxisIndex: 1,
      itemStyle: {
        color: '#ff7f0e',
      },
    },
    {
      data: g2.map((d) => [d[x], d[name], d.sta_fid, d.sta]),
      name: name === 'g_obs' ? `Gobs 2` : 'ABL 2',
      type: 'line',
      symbol: 'circle',
      symbolSize: 6,
      xAxisIndex: 2,
      yAxisIndex: 2,
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
          `)
        }
        template.push(`
        X: ${value[0].toFixed(4)}<br />
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

export const createGravityChartOptions = ({ data, name, title, x }) => {
  const { minValue, maxValue } = getMinMax(data, x)
  return {
    baseOption: {
      backgroundColor: '#fff',
      title: {
        text: title,
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
      grid: createRowGrid(3, { top: 10, bottom: 10, left: 15, right: 0 }),
      xAxis: createXAxis(minValue, maxValue),
      yAxis: createYAxis({ name }),
      series: createSeries({
        data,
        x,
        name,
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
