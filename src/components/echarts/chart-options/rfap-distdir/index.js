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
import { generateColormap } from '@/utils/color'
import { defaultToolbox } from '../common/toolbox'

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
  ]
}

const smartIndex = (index, length, clength) => {
  if (length === clength) {
    return index
  }
  return Math.floor(index * (clength / length))
}

export const createSeries = (data, { useDirectionGroup = true } = {}) => {
  // TODO(indra): Refactor creating series in the store getters.
  if (useDirectionGroup === true) {
    return DIRECTION_GROUP.map((group, index) => {
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

    // Generate color map matching the length of non-empty data. If minimum
    // length is not satisfied, return default length.
    const minLength = 11
    const colorMap = generateColormap('hsv', {
      nshades:
        nonEmptyData.length >= minLength ? nonEmptyData.length : minLength,
    })

    return nonEmptyData.map((d, index) => {
      const newIndex =
        nonEmptyData.length >= minLength
          ? index
          : smartIndex(index, nonEmptyData.length, minLength)

      return {
        areaStyle: {},
        data: d.data,
        itemStyle: {
          color: colorMap[newIndex],
        },
        name: d.direction,
        type: 'bar',
        stack: 'one',
      }
    })
  }
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
      }),
    },
    yAxis: createYAxis(),
  }
}
