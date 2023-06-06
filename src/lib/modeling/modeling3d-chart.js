import moment from 'moment'
import { generateColormap } from '@/utils/color'

export const THEMES = {
  dark: 'dark',
  light: 'light',
}

export const center = {
  x: 438893,
  y: 9166394,
  z: 2900,
}

export const createSphere = (radius, depth) => {
  const originX = center.x
  const originY = center.y
  const originZ = center.z - depth

  const coordinates = []

  for (let i = 0; i <= 360; i += 5) {
    for (let j = 0; j <= 360; j += 5) {
      const iRad = (i * Math.PI) / 180 // Convert i to radians
      const jRad = (j * Math.PI) / 180 // Convert j to radians

      const x = originX + radius * Math.cos(iRad) * Math.sin(jRad)
      const y = originY + radius * Math.sin(iRad) * Math.sin(jRad)
      const z = originZ + radius * Math.cos(jRad)

      coordinates.push([x, y, z])
    }
  }

  return coordinates
}

/**
 * Create 3D shpere chart series.
 *
 * @param {Array} topo Array of topography data.
 * @param {Object} settings Chart configuration settings.
 */
export const createSeries = (topo, radius, depth) => {
  return [
    {
      coordinateSystem: 'cartesian3D',
      data: createSphere(radius, depth),
      itemStyle: {
        opacity: 1,
        color: 'red',
      },
      shading: 'color',
      silent: false,
      type: 'surface',
      wireframe: {
        show: true,
      },
    },
    {
      coordinateSystem: 'cartesian3D',
      data: topo,
      itemStyle: {
        opacity: 0.3,
      },
      shading: 'color',
      silent: true,
      type: 'surface',
      wireframe: {
        show: true,
      },
    },
  ]
}

export const mediaQuery = () => {
  return [
    {
      query: {
        maxWidth: 575.98,
      },
      option: {},
    },
  ]
}

/**
 * Create 3D surface visual map options.
 *
 * @param {Object} options Configuration setting options.
 * @returns {Array} Array of visual map options.
 */
export const createVisualMap = ({
  timeMin = 0,
  timeMax = 100,
  showTimeColormap = false,
  showTimeColormapLegend = false,
  showSurfaceColormap = true,
  showSurfaceColormapLegend = false,
  surfaceColormap = 'earth',
  timeColormap = 'jet',
  theme = 'dark',
  timeColormapOptions = {},
  surfaceColormapOptions = {},
} = {}) => {
  const options = []

  if (showTimeColormap) {
    options.push({
      bottom: 50,
      left: 115,
      calculable: true,
      dimension: 3,
      formatter: (value) => moment(value).format('YYYY-MM-DD HH:mm:ss'),
      inRange: {
        color: generateColormap(timeColormap),
        colorAlpha: 1,
        opacity: 1,
      },
      max: timeMax,
      min: timeMin,
      precision: 0,
      realtime: true,
      seriesIndex: 0,
      show: showTimeColormapLegend,
      showLabel: true,
      text: ['Time', ''],
      textStyle: {
        color: theme === THEMES.dark ? '#fff' : '#000',
        fontSize: 10,
      },
      type: 'continuous',
      ...timeColormapOptions,
    })
  }

  if (showSurfaceColormap) {
    options.push({
      bottom: 200,
      calculable: true,
      dimension: 2,
      formatter: (value) => `${value.toFixed(2)} m`,
      inRange: { color: generateColormap(surfaceColormap) },
      max: 2900,
      min: 700,
      realtime: true,
      seriesIndex: 1,
      show: showSurfaceColormapLegend,
      showLabel: true,
      text: ['Elevation', ''],
      textStyle: {
        color: theme === THEMES.dark ? '#fff' : '#000',
        fontSize: 10,
      },
      type: 'continuous',
      ...surfaceColormapOptions,
    })
  }

  return options
}

export const baseChartOptions = ({
  showAxisGrid = true,
  theme = 'light',
  autoRotate = false,
  autoRotateSpeed = 10,
} = {}) => {
  const elev = {
    max: 3000,
    min: -4000,
  }
  const delta = (elev.max - elev.min) / 2
  return {
    grid3D: {
      show: showAxisGrid,
      axisPointer: {
        show: true,
        lineStyle: {
          color: theme === THEMES.dark ? '#fff' : '#000',
        },
      },
      environment: theme === THEMES.dark ? '#000' : '#fff',
      viewControl: {
        autoRotate: autoRotate,
        autoRotateSpeed: autoRotateSpeed,
        distance: 200,
        panSensitivity: 2,
        rotateSensitivity: 2,
        zoomSensitivity: 2,
      },
    },
    xAxis3D: {
      axisLabel: {
        formatter: (value) => `${value / 1000} `,
        textStyle: {
          color: theme === THEMES.dark ? '#fff' : '#000',
          fontSize: 11,
        },
      },
      name: 'Easting (km)',
      nameTextStyle: {
        color: theme === THEMES.dark ? '#fff' : '#000',
        fontSize: 12,
      },
      max: center.x + delta,
      min: center.x - delta,
      scale: true,
      type: 'value',
    },
    yAxis3D: {
      axisLabel: {
        formatter: (value) => `${value / 1000} `,
        textStyle: {
          color: theme === THEMES.dark ? '#fff' : '#000',
          fontSize: 11,
        },
      },
      name: 'Northing (km)',
      nameTextStyle: {
        color: theme === THEMES.dark ? '#fff' : '#000',
        fontSize: 12,
      },
      max: center.y + delta,
      min: center.y - delta,
      scale: true,
      type: 'value',
    },
    zAxis3D: {
      axisLabel: {
        formatter: (value) => `${value / 1000} `,
        textStyle: {
          color: theme === THEMES.dark ? '#fff' : '#000',
          fontSize: 11,
        },
      },
      name: 'Elevation (km)',
      nameTextStyle: {
        color: theme === THEMES.dark ? '#fff' : '#000',
        fontSize: 12,
      },
      max: elev.max,
      min: elev.min,
      scale: true,
      type: 'value',
    },
  }
}

export const createModelingChart = ({ topo, radius, depth }) => {
  const options = {
    baseOption: {
      ...baseChartOptions(),
      series: createSeries(topo, radius, depth),
      visualMap: createVisualMap(),
    },
    media: mediaQuery(),
  }
  return options
}
