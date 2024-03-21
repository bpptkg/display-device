import moment from 'moment'
import { DATETIME_FORMAT } from '@/constants/date'
import { HPA_TO_MMHG } from '@/constants/weather'
import {
  createCircleTemplate,
  makeIndex,
  mapFieldColumns,
  createDividerTemplate,
} from '@/utils/series'
import { humanizeDuration } from '@/utils/datetime'
import { createRowGrid } from '@/utils/echarts/grid'
import { defaultToolbox } from '../common/toolbox'
import { calculateRate } from '../weather-pasarbubar'

export const FIELDS = [
  'Rainfall (mm)',
  'Humidity (%)',
  'Temperature (\u00B0C)',
  'Pressure (hPa)',
  'Wind Direction (\u00B0)',
  'Wind Speed (km/h)',
  'Supply Voltage (V)',
]

export const SeriesNames = Object.freeze({
  RAINFALL: 'Rainfall',
  RATE: 'Rate',
  HUMIDITY: 'Humidity',
  TEMPERATURE: 'Temperature',
  PRESSURE: 'Pressure',
  WIND_DIRECTION: 'Wind direction',
  WIND_SPEED: 'Wind speed',
  SUPPLY_VOLTAGE: 'Supply voltage',
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
    SeriesNames.SUPPLY_VOLTAGE,
    {
      valueSuffix: ' V',
    },
  ],
])

export const seriesProps = Object.fromEntries(entries)

const formatDate = (date) => {
  return moment(date).format(DATETIME_FORMAT)
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
      data: mapFieldColumns(data, 'timestamp', 'relative_humidity'),
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
      data: mapFieldColumns(data, 'timestamp', 'air_pressure'),
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
      data: mapFieldColumns(data, 'timestamp', 'wind_direction_avg'),
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
      data: mapFieldColumns(data, 'timestamp', [
        'wind_speed_avg',
        (wind_speed_avg) => wind_speed_avg * 3.6, // m/s to km/h
      ]),
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
      data: mapFieldColumns(data, 'timestamp', 'supply_voltage'),
      markLine: {
        symbol: 'none',
        data: annotations,
        animation: false,
      },
      name: SeriesNames.SUPPLY_VOLTAGE,
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
      splitLine: { show: true },
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

export function createTooltipFormatter() {
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
            ` ${param.seriesName}: ${value ? value.toFixed(2) : 0} mm <br />`
          )
        } else if (param.seriesName === SeriesNames.RATE) {
          template.push(` Rate: ${value ? value.toFixed(2) : 0} mm/h<br />`)
          const rainAcc = param.value[2]
          const rainDuration = param.value[3]
          const rainPeakIntensity = param.value[4]
          const duration = moment.duration(rainDuration, 'seconds')
          if (rainAcc > 0) {
            template.push(
              `${createDividerTemplate()}
                  Total: ${rainAcc ? rainAcc.toFixed(2) : 0} mm<br />
                  Duration: ${humanizeDuration(duration)}<br />
                  Intensity: ${
                    rainPeakIntensity ? rainPeakIntensity.toFixed(2) : 0
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
      ${seriesName}: ${value[1] ? value[1].toFixed(2) : '-'}${
        seriesProps[seriesName].valueSuffix
      }`
    }
  }
}

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
      text: 'Rainfall Klatakan',
      textStyle: { fontSize: 16, fontWeight: 'bold' },
      subtext: '',
      subtextStyle: { color: '#363636' },
      ...title,
    },
    toolbox: defaultToolbox,
  }
}
