import { getSeriesByIndex, mapFieldColumns, makeIndex } from '@/utils/series'
import {
  calculateRate,
  formatDate,
  humanizeDuration,
} from '../weather-pasarbubar'
import { createRowGrid } from '@/utils/echarts/grid'
import { defaultToolbox } from '../common/toolbox'
import { get } from 'lodash'
import { createCircleTemplate, createDividerTemplate } from '@/utils/series'
import moment from 'moment'

export const createSeries = (allData, stations) => {
  return stations
    .map((station, index) => {
      if (station.isVaisala) {
        const data = getSeriesByIndex(allData, index, {
          defaultData: [],
        })
        return [
          {
            areaStyle: {
              color: '#37A2DA',
            },
            lineStyle: {
              color: '#37A2DA',
              width: 1,
            },
            data: mapFieldColumns(data, 'timestamp', [
              'rain_acc',
              (rain_acc) => (typeof rain_acc === 'number' ? rain_acc : 0),
            ]),
            name: `${station.stationName} Rainfall`,
            symbol: 'none',
            type: 'line',
            xAxisIndex: index,
            yAxisIndex: index,
          },
          {
            data: mapFieldColumns(
              data,
              'timestamp', // Data index: 0
              'rain_intensity', // 1
              'rain_acc', // 2
              'rain_duration', // 3
              'rain_peak_intensity' // 4
            ),
            lineStyle: {
              color: '#32C5E9',
              width: 2,
              type: 'solid',
            },
            name: `${station.stationName} Rate`,
            symbol: 'none',
            type: 'line',
            xAxisIndex: index,
            yAxisIndex: index,
          },
        ]
      } else {
        const res = getSeriesByIndex(allData, index, {
          defaultData: Object.create(null),
        })
        const data = get(res, 'data', [])
        const events = get(res, 'events.data', [])

        return [
          {
            data: mapFieldColumns(data, 'timestamp', 'cumulative_rainfall'),
            areaStyle: {
              color: '#37A2DA',
            },
            lineStyle: {
              color: '#37A2DA',
              width: 1,
            },
            name: `${station.stationName} Rainfall`,
            symbol: 'none',
            type: 'line',
            xAxisIndex: index,
            yAxisIndex: index,
          },
          {
            data: calculateRate(data, events),
            lineStyle: {
              color: '#32C5E9',
              width: 2,
              type: 'solid',
            },
            name: `${station.stationName} Rate`,
            symbol: 'none',
            type: 'line',
            xAxisIndex: index,
            yAxisIndex: index,
          },
        ]
      }
    })
    .flat(1)
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

export const createYAxis = (stations) => {
  return stations.map((station, index) => {
    return {
      axisTick: { interval: 4 },
      gridIndex: index,
      name: `${station.stationName} (mm)`,
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

export const mediaQuery = (stations) => {
  return [
    {
      query: {
        maxWidth: 575.98,
      },
      option: {
        grid: createRowGrid(stations.length, { left: 15, bottom: 8, top: 12 }),
        title: { top: 25, textStyle: { fontSize: 13 } },
      },
    },
  ]
}

export const baseChartOptions = (stations, { title = {} } = {}) => {
  return {
    backgroundColor: '#fff',
    dataZoom: [
      {
        type: 'slider',
        xAxisIndex: makeIndex(stations.length),
        realtime: false,
      },
    ],
    grid: createRowGrid(stations.length, { bottom: 10, right: 5, top: 8 }),
    xAxis: createXAxis(stations.length),
    yAxis: createYAxis(stations),
    title: {
      align: 'right',
      left: 'center',
      show: true,
      text: 'Rainfall Station',
      textStyle: { fontSize: 16, fontWeight: 'bold' },
      subtext: '',
      subtextStyle: { color: '#363636' },
      ...title,
    },
    toolbox: defaultToolbox,
  }
}

export const getEvents = (allData, stations, seriesName) => {
  const index = stations.findIndex((station) => {
    return (
      seriesName.includes(station.stationId) ||
      seriesName.includes(station.stationName)
    )
  })
  if (index !== -1) {
    return allData[index]
  } else {
    return []
  }
}

export function createTooltipFormatter(allData, stations) {
  const vaisalaStations = stations.filter((station) => station.isVaisala)
  return (params) => {
    const template = []

    params.forEach((param, index) => {
      const timestampUnix = param.value[0]
      const value = param.value[1]

      if (index == 0) {
        template.push(`${formatDate(timestampUnix)}<br />`)
      }

      if (param.seriesName.includes('Rainfall')) {
        template.push(createCircleTemplate('#37A2DA'))
        template.push(` Rainfall: ${value ? value.toFixed(2) : 0} mm <br />`)
      } else if (param.seriesName.includes('Rate')) {
        // Create tooltip for vaisala station.
        if (param.seriesName.split(' ')[0].includes(vaisalaStations)) {
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
          template.push(createCircleTemplate('#32C5E9'))
          template.push(` Rate: ${value ? value.toFixed(2) : 0} mm/h<br />`)

          // Add rainfall information if current timestamp is in particular
          // rainfall event. Note that we add the code here so that this
          // information will be rendered below rate info in the tooltip.
          const res = getEvents(allData, stations, param.seriesName)
          const events = get(res, 'events.data', [])
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
        }
      } else {
        template.push(`${param.seriesName}: ${value}`)
      }
    })

    return template.join('')
  }
}

/**
 * Tooltip factory function.
 *
 * @param {Array} events Array of rainfall events.
 */
export function createTooltip(allData, stations) {
  return {
    trigger: 'axis',
    axisPointer: {
      type: 'line',
      lineStyle: {
        type: 'dashed',
      },
    },
    formatter: createTooltipFormatter(allData, stations),
  }
}
