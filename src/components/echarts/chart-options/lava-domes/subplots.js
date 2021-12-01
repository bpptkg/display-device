import { LavaDome } from '@/constants/lava-domes'
import { SeriesNames, seriesProps } from './index'
import { mapFieldColumns, makeIndex } from '@/utils/series'
import { axisLabelFormatter } from '@/utils/formatter'
import { DATETIME_FORMAT } from '@/constants/date'
import { defaultTooltipFormatter } from '@/utils/echarts/tooltip'
import { defaultToolbox } from '../common/toolbox'
import { createRowGrid } from '@/utils/echarts/grid'

export const lavaDomesList = [LavaDome.DOME_SOUTHWEST, LavaDome.DOME_CENTER]

export const createSeries = (data) => {
  return lavaDomesList
    .map((dome, index) => {
      return [
        {
          areaStyle: {},
          data: mapFieldColumns(data[index], 'timestamp', 'volume'),
          name: `${dome}: ${SeriesNames.VOLUME}`,
          type: 'line',
          symbol: 'none',
          xAxisIndex: index,
          yAxisIndex: index * 2,
          // Set the same color for volume series (blue).
          itemStyle: { color: '#4495de' },
          lineStyle: { color: '#4495de' },
        },
        {
          data: mapFieldColumns(data[index], 'timestamp', 'rate'),
          name: `${dome}: ${SeriesNames.RATE}`,
          type: 'line',
          symbol: 'circle',
          xAxisIndex: index,
          yAxisIndex: index * 2 + 1,
          // Set the same color for rate series (yellow).
          itemStyle: { color: '#ffdb5c' },
          lineStyle: { color: '#ffdb5c' },
        },
      ]
    })
    .flat(1)
}

export const createXAxis = (min, max) => {
  const nrows = lavaDomesList.length
  const indices = makeIndex(nrows)

  return indices.map((index) => {
    return {
      axisLabel: { show: index === nrows - 1 ? true : false },
      max,
      min,
      splitLine: { show: false },
      type: 'time',
      gridIndex: index,
    }
  })
}

export const createYAxis = () => {
  return lavaDomesList
    .map((dome, index) => {
      return [
        {
          axisLabel: {
            formatter: axisLabelFormatter,
          },
          name: `${dome}: Volume (m\u00B3)`,
          nameGap: 40,
          nameLocation: 'center',
          nameTextStyle: { fontSize: 11 },
          scale: false,
          splitLine: { show: false },
          type: 'value',
          gridIndex: index,
        },
        {
          axisLabel: {
            formatter: axisLabelFormatter,
          },
          name: 'Rate (m\u00B3/day)',
          nameGap: 45,
          nameLocation: 'center',
          nameTextStyle: { fontSize: 11 },
          scale: true,
          splitLine: { show: false },
          type: 'value',
          gridIndex: index,
        },
      ]
    })
    .flat(1)
}

export const baseChartOptions = () => {
  return {
    backgroundColor: '#fff',
    dataZoom: {
      type: 'slider',
      realtime: false,
      bottom: 30,
      xAxisIndex: makeIndex(lavaDomesList.length),
    },
    grid: createRowGrid(lavaDomesList.length, {
      bottom: 15,
      top: 8,
      left: 15,
      right: 15,
    }),
    toolbox: defaultToolbox,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        lineStyle: {
          type: 'dashed',
        },
      },
      formatter: defaultTooltipFormatter({
        format: DATETIME_FORMAT,
        valueDecimals: 2,
        seriesProps,
      }),
    },
    yAxis: createYAxis(),
  }
}

export const mediaQuery = () => {
  return [
    {
      query: {
        maxWidth: 575.98,
      },
      option: {
        grid: createRowGrid(lavaDomesList.length, {
          bottom: 15,
          top: 8,
          left: 18,
          right: 18,
        }),
      },
    },
  ]
}
