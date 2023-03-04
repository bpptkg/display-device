import { getSeriesByIndex, makeIndex, mapFieldColumns } from '@/utils/series'
import { EVENTS_MAP } from './store'

export const createEdmSeries = (benchmark, reflector, data) => {
  return {
    data: mapFieldColumns(data, 'timestamp', 'slope_distance'),
    name: `${benchmark}-${reflector}`,
    symbol: 'circle',
    symbolSize: 6,
    type: 'line',
    xAxisIndex: 1,
    yAxisIndex: 1,
  }
}

export const createSeismicitySeries = (data, events) => {
  return events.map((code, index) => {
    return {
      barGap: '5%',
      barWidth: '80%',
      barCategoryGap: '0%',
      data: mapFieldColumns(
        getSeriesByIndex(data, index),
        'timestamp',
        'count'
      ),
      name: EVENTS_MAP[code].text,
      type: 'bar',
      stack: 'total',
      xAxisIndex: 0,
      yAxisIndex: 0,
    }
  })
}

export const createXAxis = (nrows, min, max) => {
  const axis = []
  const indices = makeIndex(nrows)

  indices.forEach((index) => {
    if (index === nrows - 1) {
      axis.push({
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

export const createGridSpec = ({
  left = 0,
  right = 0,
  top = 0,
  bottom = 0,
  gap = 5,
}) => {
  let c1 = 0.75
  let c2 = 0.25
  let heightContainer = 100 - (top + bottom + gap)
  let h1 = heightContainer * c1
  let h2 = heightContainer * c2

  return [
    {
      top: `${top}%`,
      height: `${h1}%`,
      left: `${left}%`,
      right: `${right}%`,
    },
    {
      top: `${top + h1 + gap}%`,
      height: `${h2}%`,
      left: `${left}%`,
      right: `${right}%`,
    },
  ]
}

export const createChartOptions = ({
  edmData = [],
  seismicityData = [],
  tMin = 0,
  tMax = 1,
  benchmark = 'BAB0',
  reflector = 'RB1',
  events = [],
  edmYLabel = '',
  seismicityYLabel = '',
  edmNameGap = 50,
  seismicityNameGap = 30,
  marginLeft = 10,
  marginRight = 5,
  marginTop = 15,
  marginBottom = 5,
} = {}) => {
  const grid = createGridSpec({
    top: marginTop,
    bottom: marginBottom,
    left: marginLeft,
    right: marginRight,
  })

  return {
    legend: {
      textStyle: { fontSize: 11 },
    },
    series: [
      createSeismicitySeries(seismicityData, events),
      createEdmSeries(benchmark, reflector, edmData),
    ].flat(1),
    grid,
    xAxis: createXAxis(2, tMin, tMax),
    yAxis: [
      {
        axisLine: { show: true },
        axisTick: { show: true },
        gridIndex: 0,
        name: seismicityYLabel,
        nameGap: seismicityNameGap,
        nameLocation: 'middle',
        scale: false,
        splitLine: { show: false },
        type: 'value',
      },
      {
        axisLabel: {
          formatter: (v) => (v ? v.toFixed(2) : v),
        },
        axisLine: { show: true },
        axisTick: { show: true },
        gridIndex: 1,
        name: edmYLabel,
        nameGap: edmNameGap,
        nameLocation: 'middle',
        scale: true,
        splitLine: { show: false },
        type: 'value',
      },
    ],
    tooltip: {
      trigger: 'axis',
    },
  }
}
