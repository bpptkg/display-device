import { getSeriesByIndex, mapFieldColumns } from '@/utils/series'
import { defaultTooltipFormatter } from '@/utils/echarts/tooltip'
import { createRowGrid } from '@/utils/echarts/grid'
import { defaultToolbox } from '../common/toolbox'

export const SeriesType = Object.freeze({
  TEMPERATURE: 'Max. Temp.',
  DENSITY: 'Density',
})

export const createSeries = (data, areas, { annotations = [] } = {}) => {
  return areas
    .map((area, index) => {
      return [
        {
          data: mapFieldColumns(
            getSeriesByIndex(data, index),
            'timestamp',
            'temperature'
          ),
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
          data: mapFieldColumns(
            getSeriesByIndex(data, index),
            'timestamp',
            'density'
          ),
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

export const baseChartOptions = ({ title = {} } = {}) => {
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
    grid: createRowGrid(2, { top: 10, bottom: 20, right: 5 }),
    legend: createLegend(),
    tooltip: {
      trigger: 'axis',
    },
    toolbox: defaultToolbox,
    yAxis: [
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
    ],
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
    seriesProps,
  })
}
