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

export const createDirectionNote = () => {
  const dir = DIRECTION_GROUP_INDEX.map((d, index) => {
    return `${d}: (${DIRECTION_GROUP[index].join(', ')})`
  })
  return `${dir.join(', ')}`
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
      name: 'Count',
      nameGap: 40,
      nameLocation: 'center',
      scale: false,
      splitLine: { show: false },
      type: 'value',
    },
  ]
}

export const createSeries = (data, { useDirectionGroup = true } = {}) => {
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
    return []
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
    dataZoom: { type: 'slider', realtime: false, bottom: 30 },
    grid: { bottom: 100 },
    legend: { type: 'scroll', bottom: 0 },
    title: {
      text: 'RF-AP Direction Stack',
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
      }),
    },
    yAxis: createYAxis(),
  }
}
