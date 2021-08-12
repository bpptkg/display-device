import moment from 'moment'
import { fromLatLon } from '@/lib/geo/utm'
import { DATETIME_FORMAT } from '@/constants/date'
import { ZONE_NUMBER } from '@/constants/seismicity'
import { createCircleTemplate, createDividerTemplate } from '@/utils/series'
import { generateColormap } from '@/utils/color'

export const THEMES = {
  dark: 'dark',
  light: 'light',
}

// Hypocenter chart default settings.
export const DEFAULT_SETTINGS = {
  onlyLocatable: true,
  showAxisGrid: true,
  showMagnitude: true,
  showSurfaceColormap: true,
  showSurfaceColormapLegend: false,
  showSurfaceWireframe: true,
  showTimeColormap: true,
  showTimeColormapLegend: true,
  surfaceColormap: 'earth',
  surfaceOpacity: 0.3,
  surfaceShading: 'color',
  symbolSize: 8,
  theme: 'light',
  timeColormap: 'rainbow',
  timeMax: null,
  timeMin: null,
  useBtbbHypo: false,
}

/**
 * Create hypocenter chart series.
 *
 * @param {Array} topo Array of topography data.
 * @param {Array} data Array of bulletin events.
 * @param {Object} settings Chart configuration settings.
 */
export const createSeries = (
  topo,
  data,
  {
    name = 'Hypocenter',
    symbol = 'circle',
    symbolSize = 8,
    surfaceOpacity = 0.8,
    surfaceShading = 'color',
    showSurfaceWireframe = true,
  } = {}
) => {
  return [
    {
      blendMode: 'source-over',
      coordinateSystem: 'cartesian3D',
      name: name,
      symbol: symbol,
      symbolSize: symbolSize,
      type: 'scatter3D',
      data: data.map((v) => {
        const utm = fromLatLon(v.latitude, v.longitude, ZONE_NUMBER)

        // Ordering on this return array are used in the tooltip and visual map
        // components. So, if you change the order index, you have to also
        // change corresponding dependencies.
        return [
          utm.easting, // Array index: 0
          utm.northing, // 1
          v.depth * -1000, // 2
          moment(v.eventdate).unix() * 1000, // 3
          v.magnitude, // 4
          v.eventid, // 5
          v.eventtype, // 6
          v.location_type, // 7
          v.latitude, // 8
          v.longitude, // 9
          v.location_mode, // 10
          v.seiscompid, // 11
          v.btbb, // 12

          // ECharts strangely show last item label in the tooltip. So, we keep
          // eventtype always in the last order.
          v.eventtype,
        ]
      }),
    },
    {
      coordinateSystem: 'cartesian3D',
      data: topo,
      itemStyle: {
        opacity: surfaceOpacity,
      },
      shading: surfaceShading,
      silent: true,
      type: 'surface',
      wireframe: {
        show: showSurfaceWireframe,
      },
    },
  ]
}

export const mediaQuery = [
  {
    query: {
      maxWidth: 575.98,
    },
    option: {
      visualMap: [
        {
          left: 0,
        },
        {
          left: 0,
        },
        {
          left: 0,
        },
      ],
    },
  },
]

/**
 * Create hypocenter visual map options.
 *
 * @param {Object} options Configuration setting options.
 * @returns {Array} Array of visual map options.
 */
export const createVisualMap = ({
  timeMin = 0,
  timeMax = 100,
  showTimeColormap = true,
  showTimeColormapLegend = true,
  showSurfaceColormap = true,
  showSurfaceColormapLegend = false,
  surfaceColormap = 'earth',
  timeColormap = 'jet',
  theme = 'dark',
  showMagnitude = true,
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
    })
  }

  if (showMagnitude) {
    options.push({
      bottom: 280,
      dimension: 4,
      left: 115,
      maxOpen: true,
      pieces: [
        {
          min: 0,
          max: 1,
          symbolSize: 3,
          extendedProps: {
            itemWidth: 3,
            itemHeight: 3,
            itemSymbol: 'circle',
            itemColor: 'none',
            itemOutlineColor: theme === THEMES.dark ? '#fff' : '#000',
          },
        },
        {
          min: 1,
          max: 2,
          symbolSize: 5,
          extendedProps: {
            itemWidth: 5,
            itemHeight: 5,
            itemSymbol: 'circle',
            itemColor: 'none',
            itemOutlineColor: theme === THEMES.dark ? '#fff' : '#000',
          },
        },
        {
          min: 2,
          max: 3,
          symbolSize: 8,
          extendedProps: {
            itemWidth: 8,
            itemHeight: 8,
            itemSymbol: 'circle',
            itemColor: 'none',
            itemOutlineColor: theme === THEMES.dark ? '#fff' : '#000',
          },
        },
        {
          min: 3,
          max: 4,
          symbolSize: 11,
          extendedProps: {
            itemWidth: 11,
            itemHeight: 11,
            itemSymbol: 'circle',
            itemColor: 'none',
            itemOutlineColor: theme === THEMES.dark ? '#fff' : '#000',
          },
        },
        {
          min: 4,
          symbolSize: 14,
          extendedProps: {
            itemWidth: 14,
            itemHeight: 14,
            itemSymbol: 'circle',
            itemColor: 'none',
            itemOutlineColor: theme === THEMES.dark ? '#fff' : '#000',
          },
        },
      ],
      realtime: false,
      seriesIndex: 0,
      showLabel: true,
      symbol: 'circle',
      text: ['Magnitude', ''],
      textStyle: {
        color: theme === THEMES.dark ? '#fff' : '#000',
        fontSize: 10,
      },
      type: 'customPiecewise',
    })
  }

  return options
}

export const createTooltipWrapper = (template) => {
  return `
  <div style="max-height:300px;overflow-y:hidden;font-size:0.85rem;line-height:0.92rem;">
    ${template}
  </div>
  `
}

/**
 * Hypocenter base chart options factory function.
 */
export const baseChartOptions = ({
  showAxisGrid = true,
  theme = 'dark',
  autoRotate = false,
  autoRotateSpeed = 10,
  useBtbbHypo = false,
} = {}) => {
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
    tooltip: {
      enterable: true,
      trigger: 'item',
      formatter: (params) => {
        const { value, color } = params

        let template = `${createCircleTemplate(color)} ${value[6]}<br />
      ${createDividerTemplate()}
      Event ID: ${value[5]}<br />
      Event date (WIB): ${moment(value[3]).format(DATETIME_FORMAT)}<br />
      Event date (UTC): ${moment.utc(value[3]).format(DATETIME_FORMAT)}<br />
      Event type: ${value[6]}<br />
      Magnitude: ${Number.isFinite(value[4]) ? value[4].toFixed(2) : '-'}<br />
      ${createDividerTemplate()}
      East: ${(value[0] / 1000).toFixed(1)} km / ${value[8].toFixed(
          3
        )}\u00B0<br />
      North: ${(value[1] / 1000).toFixed(1)} km / ${value[9].toFixed(
          3
        )}\u00B0<br />
      Elevation: ${(value[2] / 1000).toFixed(1)} km<br />
      `

        if (useBtbbHypo) {
          const btbbInfo = `
      ${createDividerTemplate()}
      X: ${value[12].x.toFixed(2)}
      \u00B1 ${value[12].err_x.toFixed(2)} km<br />
      Y: ${value[12].y.toFixed(2)}
      \u00B1 ${value[12].err_y.toFixed(2)} km<br />
      Z: ${value[12].z.toFixed(2) * -1}
      \u00B1 ${value[12].err_z.toFixed(2)} km<br />
      RMS P: ${value[12].rmsp.toFixed(2)}
      \u00B1 ${value[12].err_rmsp.toFixed(2)}<br />
      Modified: ${
        value[12].modified
          ? moment(value[12].modified).format(DATETIME_FORMAT)
          : '-'
      }<br />
      `
          template += btbbInfo
        } else {
          const locInfo = `
      ${createDividerTemplate()}
      Location mode: ${value[10]}<br />
      Location type: ${value[7]}<br />
      SeisComP ID: ${value[11]}<br />
          `
          template += locInfo
        }

        return createTooltipWrapper(template)
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
      max: 445500,
      min: 432500,
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
      max: 9172000,
      min: 9160000,
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
      max: 3000,
      min: -3000,
      scale: true,
      type: 'value',
    },
  }
}
