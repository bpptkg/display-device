import { getSeriesByIndex, mapFieldColumns, makeIndex } from '@/utils/series'
import { formatDate } from '../weather-pasarbubar'
import { createRowGrid } from '@/utils/echarts/grid'
import { defaultToolbox } from '../common/toolbox'
import { createCircleTemplate } from '@/utils/series'

const findOriginalIndex = (stations, stationId) => {
  return stations.findIndex((v) => v.stationId === stationId)
}

export const createSeries = (allData, stations) => {
  return stations
    .filter((station) => station.isVisible)
    .map((station, index) => {
      const dataIndex = findOriginalIndex(stations, station.stationId) // Find original data index of visible station.
      const data = getSeriesByIndex(allData, dataIndex, {
        defaultData: [],
      })

      return [
        {
          data: mapFieldColumns(data, 'timestamp', 'rain_acc'),
          name: `${station.stationLabel} Rainfall`,
          type: 'bar',
          xAxisIndex: index,
          yAxisIndex: index, // Map Y axis index to grid index.
        },
      ]
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
  return stations
    .map((station, index) => {
      return [
        {
          axisTick: { interval: 4 },
          gridIndex: index,
          name: `${station.stationName} (mm)`,
          nameLocation: 'end',
          nameTextStyle: {
            align: 'left',
          },
          nameGap: 7,
          scale: false,
          splitLine: { show: true },
          type: 'value',
        },
      ]
    })
    .flat(1)
}

export const mediaQuery = (stations) => {
  return [
    {
      query: {
        maxWidth: 575.98,
      },
      option: {
        grid: createRowGrid(
          stations.filter((station) => station.isVisible).length,
          {
            left: 13,
            right: 13,
            bottom: 9,
            top: 12,
          }
        ),
        title: { top: 25, textStyle: { fontSize: 13 } },
      },
    },
  ]
}

export const baseChartOptions = (originalStations, { title = {} } = {}) => {
  const stations = originalStations.filter((station) => station.isVisible)
  return {
    backgroundColor: '#fff',
    dataZoom: [
      {
        type: 'slider',
        xAxisIndex: makeIndex(stations.length),
        realtime: false,
      },
    ],
    grid: createRowGrid(stations.length, { bottom: 10, top: 8, right: 8 }),
    xAxis: createXAxis(stations.length),
    yAxis: createYAxis(stations),
    title: {
      align: 'right',
      left: 'center',
      show: true,
      text: 'Rainfall Daily',
      textStyle: { fontSize: 16, fontWeight: 'bold' },
      subtext: '',
      subtextStyle: { color: '#363636' },
      ...title,
    },
    toolbox: defaultToolbox,
  }
}

export function createTooltipFormatter() {
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
      } else {
        template.push(`${param.seriesName}: ${value}`)
      }
    })

    return template.join('')
  }
}

/**
 * Tooltip factory function.
 */
export function createTooltip() {
  return {
    trigger: 'axis',
    axisPointer: {
      type: 'line',
      lineStyle: {
        type: 'dashed',
      },
    },
    formatter: createTooltipFormatter(),
  }
}

export const createChartOptions = ({ stations, data }) => {
  const options = {
    baseOption: {
      ...baseChartOptions(stations),
      series: createSeries(data, stations),
      tooltip: createTooltip(),
    },
    media: mediaQuery(stations),
  }
  return options
}
