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

export const Y_MAX = 2824.7447935109003
export const Y_MIN = 950.1204896404302
export const DX = 13081.475451946999
export const DY = 2824.7447935109003 - 950.1204896404302

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

export const createGridSpec = ({ depth, sizing }) => {
  let width = 250
  switch (sizing) {
    case 'sm':
      width = 250
      break
    case 'md':
      width = 600
      break
    case 'lg':
      width = 800
      break
  }
  const margin = 30
  const elev = Y_MAX - depth
  const ymin = elev < 0 ? elev : 0
  const ratio = (Y_MAX - ymin) / DX

  const finalWidth = width + 2 * margin
  const finalHeight = ratio * width + 2 * margin

  const centeringOffet = 450 - finalHeight

  return [
    {
      containLabel: true,
      width: finalWidth,
      height: finalHeight,
      left: margin,
      right: margin,
      top: centeringOffet / 2,
    },
  ]
}

export const mediaQuery = ({ depth }) => {
  return [
    {
      query: {
        maxWidth: 575.98,
      },
      option: {
        grid: createGridSpec({ depth, sizing: 'sm' }),
        title: {
          top: 25,
          textStyle: {
            fontSize: 13,
          },
        },
      },
    },
    {
      query: {
        minWidth: 576,
        maxWidth: 767.98,
      },
      option: {
        grid: createGridSpec({ depth, sizing: 'md' }),
        title: {
          top: 25,
          textStyle: {
            fontSize: 13,
          },
        },
      },
    },
  ]
}
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
  return {
    backgroundColor: '#fff',
    grid: createGridSpec({ depth, sizing: 'lg' }),
    toolbox: defaultToolbox,
    yAxis: createYAxis(),
  }
}

export const createModelingChart = ({ topo, radius, depth }) => {
  const options = {
    baseOption: {
      ...baseChartOptions({ depth }),
      series: createSeries(topo, radius, depth),
      xAxis: createXAxis(),
    },
    media: mediaQuery({ depth, isMobile: true }),
  }
  return options
}
