import { mapFieldColumns, getSeriesByIndex } from '@/utils/series'
import { createRowGrid } from '@/utils/echarts/grid'
import { scaledFormatter } from '@/utils/formatter'

import { defaultToolbox } from '../common/toolbox'
import { SeriesName } from '../tiltmeter/index'
import { tooltipFormatter } from '../tiltmeter/index'

/**
 * Simple fuzzy label formatter.
 */
function axisLabelFormatter(value) {
  return scaledFormatter(['', 'k', 'M', 'G'])(value)
}

export const createSeries = (data, tiltOptions, { annotations = [] } = {}) => {
  return tiltOptions
    .map((tilt, index) => {
      return [
        {
          data: mapFieldColumns(
            getSeriesByIndex(data, index),
            'timestamp',
            'x'
          ),
          markLine: {
            symbol: 'none',
            data: annotations,
            animation: false,
          },
          name: SeriesName.X,
          symbol: 'none',
          type: 'line',
          xAxisIndex: index,
          yAxisIndex: index * 2,
        },
        {
          data: mapFieldColumns(
            getSeriesByIndex(data, index),
            'timestamp',
            'y'
          ),
          markLine: {
            symbol: 'none',
            data: annotations,
            animation: false,
          },
          name: SeriesName.Y,
          symbol: 'none',
          type: 'line',
          xAxisIndex: index,
          yAxisIndex: index * 2 + 1,
        },
      ]
    })
    .flat(1)
}

export const createXAxis = (min, max, tiltOptions) => {
  return tiltOptions.map((tilt, index) => {
    return index === tiltOptions.length - 1
      ? {
          axisTick: { alignWithLabel: true },
          boundaryGap: true,
          gridIndex: index,
          min,
          max,
          splitLine: { show: true },
          type: 'time',
        }
      : {
          axisLabel: { show: false },
          axisTick: { show: false },
          gridIndex: index,
          min,
          max,
          position: 'bottom',
          splitLine: { show: true },
          type: 'time',
        }
  })
}

export const createYAxis = (tiltOptions) => {
  return tiltOptions
    .map((tilt, index) => {
      return [
        {
          axisLabel: { formatter: axisLabelFormatter },
          gridIndex: index,
          name: `${tilt.label} - X [\u00B5rad]`,
          nameGap: 5,
          nameTextStyle: { align: 'left', fontSize: 11 },
          nameLocation: 'end',
          scale: true,
          splitLine: { show: true },
          type: 'value',
        },
        {
          axisLabel: { formatter: axisLabelFormatter },
          name: 'Y [\u00B5rad]',
          nameTextStyle: { align: 'right', fontSize: 11 },
          gridIndex: index,
          position: 'right',
          nameGap: 5,
          scale: true,
          splitLine: { show: false },
          type: 'value',
        },
      ]
    })
    .flat(1)
}

export const mediaQuery = (tiltOptions) => {
  return [
    {
      query: {
        maxWidth: 575.98,
      },
      option: {
        grid: createRowGrid(tiltOptions.length, {
          top: 18,
          bottom: 10,
          left: 15,
          right: 15,
          margin: 5,
        }),
      },
    },
  ]
}

export const baseChartOptions = (tiltOptions) => {
  return {
    backgroundColor: '#fff',
    grid: createRowGrid(tiltOptions.length, {
      bottom: 10,
      top: 10,
      margin: 5,
    }),
    yAxis: createYAxis(tiltOptions),
  }
}

export const createChartOptions = ({
  data,
  tiltOptions,
  sampling,
  min,
  max,
}) => {
  return {
    baseOption: {
      ...baseChartOptions(tiltOptions),
      series: createSeries(data, tiltOptions),
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          lineStyle: {
            type: 'dashed',
          },
        },
        formatter: tooltipFormatter(sampling),
      },
      xAxis: createXAxis(min, max, tiltOptions),
      title: {
        text: 'Tiltmeter',
        left: 'center',
        align: 'right',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
        },
        subtext: '',
        subtextStyle: {
          color: '#363636',
        },
      },
    },
    media: mediaQuery(tiltOptions),
  }
}
