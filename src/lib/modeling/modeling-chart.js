import moment from 'moment'
import { isFinite } from 'lodash'
import { SamplingTypes } from '@/constants/tiltmeter'
import { NO_DATA_NOTATION } from '@/constants/stats'
import {
  createCircleTemplate,
  mapFieldColumns,
  getFieldColumns,
  toUnixMiliSeconds,
} from '@/utils/series'
import { createRowGrid } from '@/utils/echarts/grid'
import { defaultToolbox } from '../../components/echarts/chart-options/common/toolbox'
import { DATE_FORMAT } from '../../constants/date'

export const SeriesName = Object.freeze({
  TOPO: 'Topo',
  VOLUME: 'Volume',
})

const Y_MAX = 2824.7447935109003
const Y_MIN = 950.1204896404302
const DX = 13081.475451946999
const DY = 2824.7447935109003 - 950.1204896404302

export const createCircleData = (radius, depth) => {
  // Calculate the number of points to form the circle
  const numPoints = 100
  const xOffset = 6540.737725973499
  const yOffset = Y_MAX - depth
  const angleIncrement = (2 * Math.PI) / numPoints

  // Generate the data points for the circle
  const circleData = []
  for (let i = 0; i < numPoints; i++) {
    const angle = i * angleIncrement
    const x = xOffset + radius * Math.cos(angle)
    const y = yOffset + radius * Math.sin(angle)
    circleData.push([x, y])
  }
  return circleData
}

export const createSeries = (topo, radius, depth) => {
  const options = [
    {
      data: getFieldColumns(
        topo.data ? topo.data : [],
        'distance',
        'elevation'
      ),
      symbol: 'none',
      name: SeriesName.TOPO,
      type: 'line',
      xAxisIndex: 0,
      yAxisIndex: 0,
    },

    {
      data: createCircleData(radius, depth),
      name: SeriesName.VOLUME,
      symbol: 'none',
      type: 'line',
      lineStyle: { color: 'red' },
      xAxisIndex: 0,
      yAxisIndex: 0,
    },
  ]

  return options
}

export const createXAxis = () => {
  const options = [
    {
      axisLabel: { show: true, interval: 0 },
      gridIndex: 0,
      position: 'bottom',
      splitLine: { show: false },
      type: 'value',
      scale: false,
      name: 'Distance (m)',
      nameLocation: 'center',
      nameGap: 30,
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
      grid: createRowGrid(2, { top: 15, bottom: 15, left: 22, right: 22 }),
      title: {
        top: 25,
        textStyle: {
          fontSize: 13,
        },
      },
    },
  },
]

export const createYAxis = () => {
  const options = [
    {
      gridIndex: 0,
      name: 'Elevation (m)',
      nameGap: 50,
      nameLocation: 'center',
      scale: false,
      splitLine: { show: false },
      type: 'value',
      axisLabel: { interval: 0 },
    },
  ]

  return options
}

export const baseChartOptions = ({ depth }) => {
  const width = 800
  const margin = 30
  const elev = Y_MAX - depth
  const ymin = elev < 0 ? elev : 0
  const ratio = (Y_MAX - ymin) / DX

  return {
    backgroundColor: '#fff',
    grid: [
      {
        containLabel: true,
        width: width + 2 * margin,
        height: ratio * width + 2 * margin,
        left: margin,
        right: margin,
        top: margin,
        bottom: margin,
      },
    ],
    toolbox: defaultToolbox,
    yAxis: createYAxis(),
  }
}
export const tooltipFormatter = (sampling) => {
  return (params) => {
    if (Array.isArray(params) && params.length) {
      const template = []

      params.forEach((param, index) => {
        const { seriesName, value, color } = param
        if (index === 0) {
          template.push(
            `${
              sampling === SamplingTypes.DAY
                ? moment(value[0]).format('YYYY-MM-DD')
                : moment(value[0]).format('YYYY-MM-DD HH:mm:ss')
            }<br />`
          )
        }
        template.push(`
        ${createCircleTemplate(color)}
        ${seriesName}: ${
          isFinite(value[1]) ? value[1].toFixed(2) : NO_DATA_NOTATION
        }<br />
        `)
      })
      return template.join('')
    } else {
      const { seriesName, value, color, name, componentType } = params
      if (componentType === 'markLine') {
        return `${moment(value[0]).format('YYYY-MM-DD HH:mm:ss')}<br />
        ${createCircleTemplate(color)}
        ${name}`
      } else {
        return `${
          sampling === SamplingTypes.DAY
            ? moment(value[0]).format('YYYY-MM-DD')
            : moment(value[0]).format('YYYY-MM-DD HH:mm:ss')
        }<br />
        ${createCircleTemplate(color)} 
        ${seriesName}: ${
          isFinite(value[1]) ? value[1].toFixed(2) : NO_DATA_NOTATION
        }<br />`
      }
    }
  }
}

export const createModelingChart = ({ topo, radius, depth }) => {
  const options = {
    ...baseChartOptions({ depth }),
    series: createSeries(topo, radius, depth),
    // tooltip: {
    //   trigger: 'axis',
    //   axisPointer: {
    //     type: 'cross',
    //     lineStyle: {
    //       type: 'dashed',
    //     },
    //   },
    // },
    xAxis: createXAxis(),
  }
  return options
}
