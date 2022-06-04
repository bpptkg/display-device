import { getSeriesByIndex, mapFieldColumns } from '@/utils/series'
import { defaultTooltipFormatter } from '@/utils/echarts/tooltip'
import { defaultToolbox } from '../common/toolbox'

export const createSeries = (data, areas, { annotations = [] } = {}) => {
  return areas.map((area, index) => {
    return {
      data: mapFieldColumns(
        getSeriesByIndex(data, index),
        'timestamp',
        'temperature'
      ),
      name: area.name,
      markLine: {
        symbol: 'none',
        data: annotations,
        animation: false,
      },
      symbol: 'none',
      type: 'line',
    }
  })
}

export const createXAxis = (min, max) => {
  return {
    min,
    max,
    type: 'time',
    splitLine: { show: false },
  }
}

export const createLegend = (options = {}) => {
  return {
    type: 'plain',
    bottom: 0,
    itemWidth: 15,
    itemHeight: 10,
    textStyle: { fontSize: 11 },
    ...options,
  }
}

export const mediaQuery = [
  {
    query: {
      maxWidth: 575.98,
    },
    option: {
      grid: {
        left: 45,
        right: 15,
        top: 55,
      },
      title: {
        top: 22,
        textStyle: {
          fontSize: 13,
        },
      },
      yAxis: {
        nameLocation: 'center',
        nameGap: 35,
        nameTextStyle: {
          align: 'left',
        },
      },
      legend: createLegend({ type: 'scroll' }),
    },
  },
]

export const baseChartOptions = ({ title = {} } = {}) => {
  return {
    backgroundColor: '#fff',
    dataZoom: [{ type: 'slider', realtime: false, bottom: 23 }],
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
    grid: {
      top: 70,
      bottom: 86,
    },
    legend: createLegend(),
    tooltip: {
      trigger: 'axis',
      formatter: defaultTooltipFormatter({
        format: 'YYYY-MM-DD HH:mm:ss',
        valueDecimals: 2,
        valueSuffix: ' \u00B0C',
      }),
    },
    toolbox: defaultToolbox,
    yAxis: {
      type: 'value',
      scale: true,
      name: 'Max. Temp. (\u00B0C)',
      nameLocation: 'center',
      nameGap: 45,
    },
  }
}

export const createTooltipFormatter = (areas) => {
  const seriesProps = {}
  areas.forEach((area) => {
    seriesProps[area.name] = {
      valueSuffix: ' \u00B0C',
    }
  })
  return defaultTooltipFormatter({
    format: 'YYYY-MM-DD HH:mm:ss',
    valueDecimals: 2,
    valueSuffix: ' \u00B0C',
    seriesProps,
  })
}
