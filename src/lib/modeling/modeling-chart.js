import { getFieldColumns } from '@/utils/series'

export const SeriesName = Object.freeze({
  TOPO: 'Topo',
  VOLUME: 'Volume',
})

// Topo limit values. Source: https://bma.cendana15.com/docs/apis/monitoring/topo_profile.html
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
      areaStyle: { color: 'red' },
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
      min: 0,
      max: 13100, // Max topo distance (m).
    },
  ]

  return options
}

export const createGridSpec = ({ depth, sizing }) => {
  let width = 250
  let rightMargin = 5
  switch (sizing) {
    case 'xs':
      width = 260
      rightMargin = 10
      break
    case 'sm':
      width = 400
      break
    case 'md':
      width = 600
      break
    case 'lg':
      width = 800
      break
  }
  const leftMargin = 30
  const margin = leftMargin + rightMargin
  const elev = Y_MAX - depth
  const ymin = elev < 0 ? elev : 0
  const ratio = (Y_MAX - ymin) / DX

  const finalWidth = width + margin
  const finalHeight = ratio * width + margin

  const centeringOffet = 450 - finalHeight

  return [
    {
      containLabel: true,
      width: finalWidth,
      height: finalHeight,
      left: leftMargin,
      right: rightMargin,
      top: centeringOffet / 2,
    },
  ]
}

export const mediaQuery = ({ depth }) => {
  return [
    {
      query: {
        maxWidth: 389.98,
      },
      option: {
        grid: createGridSpec({ depth, sizing: 'xs' }),
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
        minWidth: 390,
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
    {
      query: {
        minWidth: 768,
        maxWidth: 991.98,
      },
      option: {
        grid: createGridSpec({ depth, sizing: 'lg' }),
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
      name: 'Elevation (km)',
      nameGap: 33,
      nameLocation: 'center',
      scale: false,
      splitLine: { show: false },
      type: 'value',
      axisLabel: { formatter: (v) => (v / 1000).toFixed(1) },
    },
  ]

  return options
}

export const createModelingChart = ({ topo, radius, depth }) => {
  const options = {
    baseOption: {
      title: {
        text: 'Pressure Source Model',
        left: 'center',
        textStyle: {
          fontWeight: 'normal',
        },
      },
      backgroundColor: '#fff',
      grid: createGridSpec({ depth }),
      yAxis: createYAxis(),
      series: createSeries(topo, radius, depth),
      xAxis: createXAxis(),
    },
    media: mediaQuery({ depth, isMobile: true }),
  }
  return options
}
