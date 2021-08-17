import moment from 'moment'
import { DATETIME_FORMAT } from '@/constants/date'
import { HPA_TO_MMHG } from '@/constants/weather'
import {
  createCircleTemplate,
  makeIndex,
  mapFieldColumns,
  createDividerTemplate,
} from '@/utils/series'
import { createRowGrid } from '@/utils/echarts/grid'
import { defaultToolbox } from '../common/toolbox'
import '@/lib/moment-duration-format'

export const INTERVAL = 10 /* 10 minutes interval */
export const FACTOR = 6 /* Hourly rate constant over 10 minutes interval */

export const FIELDS = [
  'Rainfall (mm)',
  'Humidity (%)',
  'Temperature (\u00B0C)',
  'Pressure (hPa)',
  'Wind Direction (\u00B0)',
  'Wind Speed (km/h)',
  'Battery (V)',
]

export const SeriesNames = Object.freeze({
  RAINFALL: 'Rainfall',
  RATE: 'Rate',
  HUMIDITY: 'Humidity',
  TEMPERATURE: 'Temperature',
  PRESSURE: 'Pressure',
  WIND_DIRECTION: 'Wind direction',
  WIND_SPEED: 'Wind speed',
  BATTERY: 'Battery',
})

const entries = new Map([
  [
    SeriesNames.RAINFALL,
    {
      valueSuffix: ' mm',
    },
  ],
  [
    SeriesNames.RATE,
    {
      valueSuffix: ' mm/h',
    },
  ],
  [
    SeriesNames.HUMIDITY,
    {
      valueSuffix: ' %',
    },
  ],
  [
    SeriesNames.TEMPERATURE,
    {
      valueSuffix: ' \u00B0C',
    },
  ],
  [
    SeriesNames.PRESSURE,
    {
      valueSuffix: ' hPa',
    },
  ],
  [
    SeriesNames.WIND_DIRECTION,
    {
      valueSuffix: '\u00B0',
    },
  ],
  [
    SeriesNames.WIND_SPEED,
    {
      valueSuffix: ' km/h',
    },
  ],
  [
    SeriesNames.BATTERY,
    {
      valueSuffix: ' V',
    },
  ],
])

export const seriesProps = Object.fromEntries(entries)

const formatDate = (date) => {
  return moment(date).format(DATETIME_FORMAT)
}

/**
 * Helper function to calculate instantaneous rainfall rate in mm/hour unit.
 *
 * @param {Array} data Array of data input as used in the createSeries()
 * function.
 * @param {Array} events Array of rainfall events. This is rainfall events from
 * BMA API.
 * @returns {Array} Two columns array with timestamp in Unix miliseconds and
 * rainfall rate in mm/hour.
 */
export const calculateRate = (data, events) => {
  return data.map((v) => {
    const timestamp = moment(v.timestamp)
    const timestampUnix = timestamp.unix() * 1000 // Convert to Unix miliseconds.

    // Check if current timestamp is in particular rainfall event.
    const event = events.find((e) => {
      return timestamp >= moment(e.start) && timestamp <= moment(e.end)
    })

    if (event !== undefined) {
      const duration = moment
        .duration(timestamp.diff(moment(event.start)))
        .add(1, 'minutes')
        .asHours()
      return [
        timestampUnix,
        duration !== 0 ? v.cumulative_rainfall / duration : 0,
      ]
    } else {
      return [
        timestampUnix,
        0, // Return zero if current timestamp is outside particular rainfall event.
      ]
    }
  })
}

export const createSeries = (data, events, { annotations = [] } = {}) => {
  return [
    {
      areaStyle: {},
      data: mapFieldColumns(data, 'timestamp', 'cumulative_rainfall'),
      lineStyle: {
        width: 1,
      },
      markLine: {
        symbol: 'none',
        data: annotations,
        animation: false,
      },
      name: SeriesNames.RAINFALL,
      symbol: 'none',
      type: 'line',
      xAxisIndex: 0,
      yAxisIndex: 0,
    },
    {
      data: calculateRate(data, events),
      lineStyle: {
        color: '#65e0e0',
        width: 2,
        type: 'solid',
      },
      name: SeriesNames.RATE,
      symbol: 'none',
      type: 'line',
      xAxisIndex: 0,
      yAxisIndex: 0,
    },
    {
      data: mapFieldColumns(data, 'timestamp', 'air_humidity'),
      markLine: {
        symbol: 'none',
        data: annotations,
        animation: false,
      },
      name: SeriesNames.HUMIDITY,
      type: 'line',
      symbol: 'none',
      xAxisIndex: 1,
      yAxisIndex: 1,
    },
    {
      data: mapFieldColumns(data, 'timestamp', 'air_temperature'),
      markLine: {
        symbol: 'none',
        data: annotations,
        animation: false,
      },
      name: SeriesNames.TEMPERATURE,
      symbol: 'none',
      type: 'line',
      xAxisIndex: 2,
      yAxisIndex: 2,
    },
    {
      data: mapFieldColumns(data, 'timestamp', [
        'air_pressure',
        (v) => v * 10, // Convert kPa to hPa.
      ]),
      markLine: {
        symbol: 'none',
        data: annotations,
        animation: false,
      },
      name: SeriesNames.PRESSURE,
      symbol: 'none',
      type: 'line',
      xAxisIndex: 3,
      yAxisIndex: 3,
    },
    {
      data: mapFieldColumns(data, 'timestamp', 'wind_direction'),
      lineStyle: { opacity: 0 },
      markLine: {
        symbol: 'none',
        data: annotations,
        animation: false,
      },
      name: SeriesNames.WIND_DIRECTION,
      symbol: 'circle',
      type: 'line',
      xAxisIndex: 4,
      yAxisIndex: 4,
    },
    {
      data: mapFieldColumns(data, 'timestamp', 'wind_speed'),
      markLine: {
        symbol: 'none',
        data: annotations,
        animation: false,
      },
      name: SeriesNames.WIND_SPEED,
      symbol: 'none',
      type: 'line',
      xAxisIndex: 5,
      yAxisIndex: 5,
    },
    {
      data: mapFieldColumns(data, 'timestamp', 'battery_voltage'),
      markLine: {
        symbol: 'none',
        data: annotations,
        animation: false,
      },
      name: SeriesNames.BATTERY,
      symbol: 'none',
      type: 'line',
      xAxisIndex: 6,
      yAxisIndex: 6,
    },
  ]
}

export const createXAxis = (nrows) => {
  const axis = []
  const indices = [...Array(nrows).keys()]

  indices.forEach((index) => {
    if (index === nrows - 1) {
      axis.push({ gridIndex: index, type: 'time', splitLine: { show: false } })
    } else {
      axis.push({
        gridIndex: index,
        type: 'time',
        axisLabel: { show: false },
        axisTick: { show: false },
        splitLine: { show: false },
      })
    }
  })
  return axis
}

export const createYAxis = (names) => {
  return names.map((name, index) => {
    return {
      axisTick: { interval: 4 },
      gridIndex: index,
      name: name,
      nameLocation: 'end',
      nameTextStyle: {
        align: 'left',
      },
      nameGap: 7,
      scale: index !== 0,
      splitLine: { show: false },
      type: 'value',
    }
  })
}

export const mediaQuery = [
  {
    query: {
      maxWidth: 575.98,
    },
    option: {
      grid: createRowGrid(FIELDS.length, { left: 15, bottom: 8, top: 10 }),
      title: { top: 25, textStyle: { fontSize: 13 } },
    },
  },
]

export const baseChartOptions = ({ title = {} } = {}) => {
  return {
    backgroundColor: '#fff',
    dataZoom: [
      { type: 'slider', xAxisIndex: makeIndex(FIELDS.length), realtime: false },
    ],
    grid: createRowGrid(FIELDS.length, { bottom: 8 }),
    xAxis: createXAxis(FIELDS.length),
    yAxis: createYAxis(FIELDS),
    title: {
      align: 'right',
      left: 'center',
      show: true,
      text: 'Rainfall Pasarbubar',
      textStyle: { fontSize: 16, fontWeight: 'bold' },
      subtext: '',
      subtextStyle: { color: '#363636' },
      ...title,
    },
    toolbox: defaultToolbox,
  }
}

/**
 * Helper function to format Moment duration.
 *
 * Note that this function requires Moment.js plugins in
 * @/lib/moment-duration-format. So you have to import it first.
 *
 * @param {Object} duration Moment duration object.
 * @returns {String} Moment duration formatted string.
 */
export function humanizeDuration(duration) {
  if (duration.asDays() > 0) {
    return duration.format('d [days] h [hours] m [minutes]')
  } else if (duration.asHours() > 0) {
    return duration.format('h [hours] m [minutes]')
  } else {
    return duration.format('m [minutes]')
  }
}

/**
 * Factory function to create rainfall tooltip.
 *
 * @param {Array} events Array of rainfall events.
 * @returns {Function} Tooltip formatter function.
 */
export function createTooltipFormatter(events) {
  return (params) => {
    if (params.length && params.length > 1) {
      const template = []

      params.forEach((param, index) => {
        const timestampUnix = param.value[0]
        const value = param.value[1]

        if (index === 0) {
          template.push(`${formatDate(timestampUnix)}<br />`)
        }
        template.push(createCircleTemplate(param.color))

        if (param.seriesName === SeriesNames.RAINFALL) {
          template.push(
            ` ${param.seriesName}: ${
              value ? value.toFixed(2) : value
            } mm <br />`
          )
        } else if (param.seriesName === SeriesNames.RATE) {
          template.push(` Rate: ${value ? value.toFixed(2) : value} mm/h<br />`)

          // Add rainfall information if current timestamp is in particular
          // rainfall event. Note that we add the code here so that this
          // information will be rendered below rate info in the tooltip.
          const event = events.find((e) => {
            const ts = moment(timestampUnix)
            return ts >= moment(e.start) && ts <= moment(e.end)
          })
          if (event !== undefined) {
            const duration = moment.duration(event.duration, 'seconds')
            template.push(
              `${createDividerTemplate()}
              Start: ${formatDate(event.start)}<br />
              Total: ${event.total === 0 ? 0 : event.total.toFixed(2)} mm<br />
              Duration: ${humanizeDuration(duration)}<br />
              Intensity: ${
                event.intensity === 0 ? 0 : event.intensity.toFixed(2)
              } mm/h<br />
              `
            )
          }
        } else {
          template.push(`${param.seriesName}: ${value}`)
        }
      })
      return template.join('')
    } else {
      const param = params[0]
      const { seriesName, value, color } = param

      if (seriesName === SeriesNames.PRESSURE) {
        return `${formatDate(value[0])}<br />
            ${createCircleTemplate(color)}
            ${seriesName}: ${value[1] ? value[1].toFixed(2) : '-'}${
          seriesProps[seriesName].valueSuffix
        } (${value[1] ? (value[1] * HPA_TO_MMHG).toFixed(2) : '-'} mmHg)`
      }

      return `${formatDate(value[0])}<br />
      ${createCircleTemplate(color)}
      ${seriesName}: ${value[1] ? value[1].toFixed(2) : value[1]}${
        seriesProps[seriesName].valueSuffix
      }`
    }
  }
}

/**
 * Tooltip factory function.
 *
 * @param {Array} events Array of rainfall events.
 */
export function createTooltip(events) {
  return {
    trigger: 'axis',
    axisPointer: {
      type: 'line',
      lineStyle: {
        type: 'dashed',
      },
    },
    formatter: createTooltipFormatter(events),
  }
}
