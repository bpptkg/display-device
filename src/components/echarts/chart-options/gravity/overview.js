import moment from 'moment'
import { NO_DATA_NOTATION } from '../../../../constants/stats'
import { createSubplotGrid } from '../../../../utils/echarts/grid'
import {
  createCircleTemplate,
  toUnixMiliSeconds,
  makeIndex,
} from '../../../../utils/series'
import { tab20ColorMap } from '../../../../utils/tab20'
import { defaultToolbox } from '../common/toolbox'
import { smartIndex } from '../rfap-distdir'

const ROW_HEIGHT = 60
const ROW_MARGIN = 26
const TOP = 40
const BOTTOM = 70

export const getGravityChartHeight = (n) => {
  if (n === 0) return 150
  return TOP + n * ROW_HEIGHT + (n - 1) * ROW_MARGIN + BOTTOM
}

const createGrid = (n) =>
  createSubplotGrid(n, getGravityChartHeight(n), {
    margin: ROW_MARGIN,
    top: TOP,
    bottom: BOTTOM,
    left: 90,
    right: 40,
  })

const createXAxis = (nrows, min, max) => {
  const indices = makeIndex(nrows)
  return indices.map((index) => {
    const isLast = index === nrows - 1
    return {
      gridIndex: index,
      min,
      max,
      type: 'time',
      splitLine: { show: false },
      axisLabel: { show: isLast },
      axisTick: { show: isLast },
    }
  })
}

const createYAxis = (data) => {
  return data.map((benchmark, index) => ({
    gridIndex: index,
    type: 'value',
    scale: true,
    name: `${benchmark.sta_fid} (mGal)`,
    nameLocation: 'end',
    nameGap: 10,
    splitLine: { show: false },
    splitNumber: 2,
    minInterval: 0.01,
    axisLabel: {
      formatter: (v) => v.toFixed(2),
    },
  }))
}

const createSeries = ({ data, annotations = [] }) => {
  return data.map((benchmark, index) => ({
    data: benchmark.ts.map((d) => [
      toUnixMiliSeconds(d.period),
      d.g_obs,
      benchmark.sta_fid,
      benchmark.sta,
    ]),
    name: `${benchmark.sta_fid}`,
    type: 'line',
    symbol: 'circle',
    symbolSize: 4,
    xAxisIndex: index,
    yAxisIndex: index,
    markLine: {
      symbol: 'none',
      data: annotations,
      animation: false,
    },
    itemStyle: {
      color:
        tab20ColorMap[smartIndex(index, data.length, tab20ColorMap.length)],
    },
  }))
}

const createDataZoom = (n) => [
  { type: 'slider', xAxisIndex: makeIndex(n), realtime: false },
]

export const tooltipFormatter = () => {
  return (params) => {
    if (Array.isArray(params) && params.length) {
      const template = []

      params.forEach((param, index) => {
        const { seriesName, value, color } = param
        if (index === 0) {
          template.push(`
            ${moment(value[0]).format('YYYY-MM-DD')}<br />
          `)
        }

        const hasValue =
          value[1] !== null && value[1] !== undefined && isFinite(value[1])

        template.push(`
        ${createCircleTemplate(color)} 
        ${value[3]} (${seriesName}): ${
          hasValue ? value[1].toFixed(4) : NO_DATA_NOTATION
        }<br />
        `)
      })
      return template.join('')
    } else {
      return ''
    }
  }
}
export const getStationTimeRanges = (data) => {
  return data.map((benchmark) => {
    const timestamps = benchmark.ts.map((d) => toUnixMiliSeconds(d.period))
    return {
      min: Math.min(...timestamps),
      max: Math.max(...timestamps),
    }
  })
}
export const createGravityOverviewChartOptions = ({
  data,
  annotations = [],
}) => {
  const n = data.length

  if (n === 0) {
    return {
      baseOption: {
        backgroundColor: '#fff',
        title: {
          text: 'Gravity Overview',
          textStyle: { fontWeight: 'bold', fontSize: 14 },
          left: 'center',
        },
        toolbox: defaultToolbox,
      },
    }
  }

  const timestamps = data.flatMap((b) =>
    b.ts.map((d) => toUnixMiliSeconds(d.period))
  )
  const min = Math.min(...timestamps)
  const max = Math.max(...timestamps)

  return {
    baseOption: {
      backgroundColor: '#fff',
      title: {
        text: 'Gravity Overview',
        textStyle: { fontWeight: 'bold', fontSize: 14 },
        left: 'center',
      },
      toolbox: defaultToolbox,
      grid: createGrid(n),
      xAxis: createXAxis(n, min, max),
      yAxis: createYAxis(data),
      series: createSeries({ data, annotations }),
      dataZoom: createDataZoom(n),
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          lineStyle: { type: 'dashed' },
        },
        formatter: tooltipFormatter(),
      },
    },
  }
}
