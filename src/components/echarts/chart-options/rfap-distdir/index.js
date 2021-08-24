import _ from 'lodash'
import { DATE_FORMAT, DATETIME_FORMAT } from '@/constants/date'
import {
  DIRECTION,
  DIRECTION_GROUP,
  DIRECTION_GROUP_INDEX,
} from '@/constants/rfap'
import { Sampling } from '@/constants/rfap-distance'
import { mapFieldColumns } from '@/utils/series'
import { defaultTooltipFormatter } from '@/utils/echarts/tooltip'
import { defaultToolbox } from '../common/toolbox'

// Tab20 color map is used because we need to differentiate the item to the
// others.
export const colorMap = [
  '#1f77b4',
  '#aec7e8',
  '#ff7f0e',
  '#ffbb78',
  '#2ca02c',
  '#98df8a',
  '#d62728',
  '#ff9896',
  '#9467bd',
  '#c5b0d5',
  '#8c564b',
  '#c49c94',
  '#e377c2',
  '#f7b6d2',
  '#7f7f7f',
  '#c7c7c7',
  '#bcbd22',
  '#dbdb8d',
  '#17becf',
  '#9edae5',
]

export const SeriesNames = Object.freeze({
  MAX_DISTANCE: 'Max. Distance',
})

export const createDirectionNote = () => {
  const dir = DIRECTION_GROUP_INDEX.map((d, index) => {
    return `${d}: (${DIRECTION_GROUP[index].join(', ')})`
  })
  return `Direction group list: ${dir.join('; ')}`
}

export const createXAxis = (min, max) => {
  return {
    max,
    min,
    splitLine: { show: false },
    type: 'time',
  }
}

export const createYAxis = () => {
  return [
    {
      name: 'RF & AP Count',
      nameGap: 40,
      nameLocation: 'center',
      scale: false,
      splitLine: { show: false },
      type: 'value',
    },
    {
      name: 'Max. Distance (km)',
      nameGap: 40,
      nameLocation: 'center',
      scale: false,
      splitLine: { show: false },
      type: 'value',
    },
  ]
}

const smartIndex = (index, length, clength) => {
  if (length === clength) {
    return index
  }
  return Math.floor(index * (clength / length))
}

export const createSeries = (data, { useDirectionGroup = true } = {}) => {
  let seriesOptions = []
  // TODO(indra): Refactor creating series in the store getters.
  if (useDirectionGroup === true) {
    seriesOptions = DIRECTION_GROUP.map((group, index) => {
      return {
        areaStyle: {},
        data: mapFieldColumns(data, 'timestamp', [
          'countdir',
          (countdir) => {
            const caseInsensitiveDirectionGroup = group.map((v) =>
              v.toLowerCase()
            )
            // Sum count per direction group.
            const keys = Object.keys(countdir || {}).filter((k) =>
              caseInsensitiveDirectionGroup.includes(k.toLowerCase())
            )
            return _.sum(keys.map((k) => countdir[k]))
          },
        ]),
        name: DIRECTION_GROUP_INDEX[index],
        type: 'bar',
        stack: 'one',
      }
    })
  } else {
    const nonEmptyData = []

    Object.values(DIRECTION).forEach((d) => {
      const filteredData = mapFieldColumns(data, 'timestamp', [
        'countdir',
        (countdir) => {
          return _.get(countdir, d, 0)
        },
      ]).filter((v) => v[1] > 0)

      // Only append non-empty data.
      if (filteredData.length) {
        nonEmptyData.push({ direction: d, data: filteredData })
      }
    })

    seriesOptions = nonEmptyData.map((d, index) => {
      return {
        areaStyle: {},
        data: d.data,
        itemStyle: {
          color:
            colorMap[smartIndex(index, nonEmptyData.length, colorMap.length)],
        },
        name: d.direction,
        type: 'bar',
        stack: 'one',
      }
    })
  }

  // Add max. distance plot to the secondary Y axis.
  seriesOptions.push({
    // Convert distance from m to km.
    data: mapFieldColumns(data, 'timestamp', [
      'distance',
      (v) => (v ? v / 1000 : v),
    ]),
    name: SeriesNames.MAX_DISTANCE,
    type: 'scatter',
    symbol: 'circle',
    symbolSize: 7,
    yAxisIndex: 1,
  })

  return seriesOptions
}

const createLegend = (options = {}) => {
  return {
    type: 'plain',
    bottom: 0,
    itemWidth: 15,
    itemHeight: 10,
    textStyle: { fontSize: 11 },
    ...options,
  }
}

export const mediaQuery = () => {
  return [
    {
      query: {
        maxWidth: 575.98,
      },
      option: {
        grid: { left: 60, right: 60, top: 60 },
        title: {
          top: 25,
          fontSize: 13,
        },
        legend: createLegend({ type: 'scroll' }),
      },
    },
  ]
}

export const baseChartOptions = ({
  title = {},
  sampling = Sampling.DAY,
} = {}) => {
  return {
    backgroundColor: '#fff',
    grid: { bottom: 85 },
    legend: createLegend(),
    title: {
      text: 'RF & AP Direction Stack',
      left: 'center',
      align: 'right',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      subtext: '',
      subtextStyle: { color: '#363636' },
      ...title,
    },
    toolbox: defaultToolbox,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        lineStyle: {
          type: 'dashed',
        },
      },
      formatter: defaultTooltipFormatter({
        format: sampling === Sampling.DAY ? DATE_FORMAT : DATETIME_FORMAT,
        valueDecimals: 0,
        noData: '-',
        adaptive: false,
        adaptiveOptions: { columnCount: 2 },
        excludeZero: true,
        seriesProps: {
          [SeriesNames.MAX_DISTANCE]: {
            valueDecimals: 2,
            valueSuffix: ' km',
          },
        },
      }),
    },
    yAxis: createYAxis(),
  }
}
