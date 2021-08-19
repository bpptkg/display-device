import { find } from 'lodash'
import moment from 'moment'

import { DATE_FORMAT, DATETIME_FORMAT } from '@/constants/date'
import { SamplingTypes } from '@/constants/seismicity'
import {
  createCircleTemplate,
  getSeriesByIndex,
  mapFieldColumns,
  makeIndex,
} from '@/utils/series'
import { createRowGrid } from '@/utils/echarts/grid'
import { defaultToolbox } from '../../common/toolbox'
import eventTypes from './event-types'

const formatDateBySampling = (date, sampling) => {
  return sampling === SamplingTypes.DAY
    ? date.format(DATE_FORMAT)
    : date.format(DATETIME_FORMAT)
}

/**
 * Reindex all seismicity data in array to make equal length.
 *
 * @param {Array} data Array of seismicity data.
 */
export const reindexData = (data, sampling) => {
  if (data.length === 0) return data
  const timestamp = data
    .map((d) => d.map((v) => v.timestamp))
    .filter((e) => e.length > 0)
    .flat(1)
  const start = timestamp.reduce((a, b) => moment.min(moment(a), moment(b)))
  const end = timestamp.reduce((a, b) => moment.max(moment(a), moment(b)))
  const duration = {
    hour: 'hours',
    day: 'days',
  }

  const day = start.clone()
  const reindexedData = new Array(data.length).fill(0).map(() => [])

  // eslint-disable-next-line no-unmodified-loop-condition
  while (day <= end) {
    data.forEach((item, index) => {
      const value = find(item, (o) => {
        return day.isSame(o.timestamp, sampling)
      })
      reindexedData[index].push(
        value || { timestamp: formatDateBySampling(day, sampling), count: 0 }
      )
    })
    day.add(1, duration[sampling])
  }

  return reindexedData
}

export const createSeries = (data, { annotations = [] } = {}) => {
  const events = eventTypes.map((v) => v.type)

  return events.map((event, index) => {
    return {
      barGap: '5%',
      barWidth: '80%',
      barCategoryGap: '0%',
      data: mapFieldColumns(
        getSeriesByIndex(data, index),
        'timestamp',
        'count'
      ),
      markLine: {
        symbol: 'none',
        data: annotations,
        animation: false,
      },
      name: event,
      type: 'bar',
      xAxisIndex: index,
      yAxisIndex: index,
    }
  })
}

export const createXAxis = (nrows, min, max) => {
  const axis = []
  const indices = makeIndex(nrows)

  indices.forEach((index) => {
    if (index === nrows - 1) {
      axis.push({
        axisTick: { alignWithLabel: true },
        boundaryGap: true,
        gridIndex: index,
        min,
        max,
        splitLine: { show: false },
        type: 'time',
      })
    } else {
      axis.push({
        axisLabel: { show: false },
        axisTick: { show: false },
        gridIndex: index,
        min,
        max,
        splitLine: { show: false },
        type: 'time',
      })
    }
  })
  return axis
}

export const createYAxis = (names) => {
  return names.map((name, index) => {
    return {
      axisTick: { interval: 2 },
      gridIndex: index,
      interval: 'auto',
      name: name,
      nameGap: 30,
      nameLocation: 'center',
      scale: false,
      splitLine: { show: false },
      type: 'value',
    }
  })
}

export const createYAxisMobile = (names) => {
  return names.map(() => {
    return {
      nameGap: 7,
      nameLocation: 'end',
    }
  })
}

export const mediaQuery = [
  {
    query: {
      maxWidth: 575.98,
    },
    option: {
      grid: createRowGrid(eventTypes.length, {
        top: 10,
        bottom: 10,
      }),
      title: {
        top: 20,
      },
      yAxis: createYAxisMobile(eventTypes.map((v) => v.type)),
    },
  },
]

export const baseChartOptions = ({ title = {} } = {}) => {
  return {
    backgroundColor: '#fff',
    dataZoom: [
      {
        type: 'slider',
        xAxisIndex: makeIndex(eventTypes.length),
        realtime: false,
      },
    ],
    grid: createRowGrid(eventTypes.length, { top: 7, bottom: 10 }),
    title: {
      text: 'Seismicity',
      left: 'center',
      align: 'right',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      subtextStyle: {
        color: '#363636',
      },
      ...title,
    },
    xAxis: createXAxis(eventTypes.length),
    yAxis: createYAxis(eventTypes.map((v) => v.type)),
    toolbox: defaultToolbox,
  }
}

export const tooltipFormatter = (sampling) => {
  if (sampling === SamplingTypes.HOUR) {
    return (params) => {
      const param = params[0]
      const { seriesName, value, color } = param

      return `${moment(value[0]).format('YYYY-MM-DD HH:mm')}<br/>
      ${createCircleTemplate(color)}
      ${seriesName}: ${value[1]}`
    }
  } else {
    return (params) => {
      const param = params[0]
      const { seriesName, value, color } = param

      return `${moment(value[0]).format('YYYY-MM-DD')}<br/>
      ${createCircleTemplate(color)}
      ${seriesName}: ${value[1]}`
    }
  }
}
