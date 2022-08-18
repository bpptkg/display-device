import { mapFieldColumns } from '@/utils/series'
import { defaultTooltipFormatter } from '@/utils/echarts/tooltip'
import { createRowGrid } from '@/utils/echarts/grid'
import { defaultToolbox } from '../common/toolbox'

export const SeriesType = Object.freeze({
  TEMPERATURE: 'Max. Temp.',
  DENSITY: 'Density',
  STDDEV: 'Std. Dev.',
})

/**
 * Exclude density value that equal or greater than this value. Unit: %.
 */
export const DENSITY_FILTER_THRESHOLD = 90

export const createSeries = (
  data,
  areas,
  { annotations = [], plotStdDev = false } = {}
) => {
  const option = areas
    .map((area) => {
      return [
        {
          data: mapFieldColumns(data, 'timestamp', `temperature_${area.id}`),
          name: `${SeriesType.TEMPERATURE} ${area.name}`,
          markLine: {
            symbol: 'none',
            data: annotations,
            animation: false,
          },
          symbol: 'none',
          type: 'line',
        },
        {
          data: mapFieldColumns(data, 'timestamp', `density_${area.id}`),
          name: `${SeriesType.DENSITY} ${area.name}`,
          markLine: {
            symbol: 'none',
            data: annotations,
            animation: false,
          },
          symbol: 'none',
          type: 'line',
          xAxisIndex: 1,
          yAxisIndex: 1,
        },
      ]
    })
    .flat(1)

  if (plotStdDev) {
    option.push({
      data: mapFieldColumns(data, 'timestamp', 'stddev'),
      lineStyle: {
        color: 'black',
      },
      itemStyle: {
        color: 'black',
      },
      name: SeriesType.STDDEV,
      symbol: 'none',
      type: 'line',
      xAxisIndex: 0,
      yAxisIndex: 2,
    })
  }

  return option
}

export const createXAxis = (min, max) => {
  return [
    {
      min,
      max,
      type: 'time',
      splitLine: { show: false },
      gridIndex: 0,
      axisLabel: { show: false },
    },
    {
      min,
      max,
      type: 'time',
      splitLine: { show: false },
      gridIndex: 1,
    },
  ]
}

export const createLegend = (options = {}) => {
  return {
    type: 'plain',
    bottom: 0,
    itemWidth: 15,
    itemHeight: 10,
    textStyle: { fontSize: 10 },
    ...options,
  }
}

export const mediaQuery = [
  {
    query: {
      maxWidth: 575.98,
    },
    option: {
      grid: createRowGrid(2, { top: 15, bottom: 20, left: 15, right: 5 }),
      title: {
        top: 22,
        textStyle: {
          fontSize: 13,
        },
      },
      yAxis: [
        {
          nameLocation: 'center',
          nameGap: 35,
          nameTextStyle: {
            align: 'left',
          },
        },
        {
          nameLocation: 'center',
          nameGap: 35,
          nameTextStyle: {
            align: 'left',
          },
        },
      ],
      legend: createLegend({ type: 'scroll' }),
    },
  },
]

export const baseChartOptions = ({ title = {}, plotStdDev = false } = {}) => {
  const yAxis = [
    {
      type: 'value',
      scale: true,
      name: 'Max. Temp. (\u00B0C)',
      nameLocation: 'center',
      nameGap: 45,
      gridIndex: 0,
    },
    {
      type: 'value',
      scale: true,
      name: 'Density (%)',
      nameLocation: 'center',
      nameGap: 45,
      gridIndex: 1,
    },
  ]

  if (plotStdDev) {
    yAxis.push({
      type: 'value',
      scale: true,
      name: 'Std. Dev',
      nameLocation: 'center',
      nameGap: 45,
      gridIndex: 0,
    })
  }

  return {
    backgroundColor: '#fff',
    dataZoom: [
      { type: 'slider', realtime: false, bottom: 43, xAxisIndex: [0, 1] },
    ],
    title: {
      align: 'right',
      left: 'center',
      show: true,
      text: 'Thermal',
      textStyle: { fontSize: 16, fontWeight: 'bold' },
      subtext: '',
      subtextStyle: {
        color: '#363636',
      },
      ...title,
    },
    grid: createRowGrid(2, { top: 10, bottom: 20, right: plotStdDev ? 10 : 5 }),
    legend: createLegend(),
    tooltip: {
      trigger: 'axis',
    },
    toolbox: defaultToolbox,
    yAxis: yAxis,
  }
}

export const createTooltipFormatter = (areas) => {
  const seriesProps = {}
  areas.forEach((area) => {
    seriesProps[`${SeriesType.TEMPERATURE} ${area.name}`] = {
      valueSuffix: ' \u00B0C',
      name: area.name,
    }
    seriesProps[`${SeriesType.DENSITY} ${area.name}`] = {
      valueSuffix: ' %',
      name: area.name,
    }
  })

  return defaultTooltipFormatter({
    format: 'YYYY-MM-DD HH:mm:ss',
    valueDecimals: 2,
    noData: '-',
    seriesProps,
  })
}
