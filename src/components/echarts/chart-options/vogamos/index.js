import { createSubplotGrid } from '@/utils/echarts/grid'
import { defaultTooltipFormatter } from '@/utils/echarts/tooltip'
import { mapFieldColumns } from '@/utils/series'
import { defaultToolbox } from '../common/toolbox'

export const CHART_HEIGHT = 500

export const SeriesNames = Object.freeze({
  SOIL: 'Soil',
  TERMOCOUPLE1: 'Termocouple 1',
  TERMOCOUPLE2: 'Termocouple 2',
  CO2_MAX: 'CO\u2082 max',
  CO2_TEMP_MAX: 'CO\u2082 temp. max',
  CO2_HUMI_MAX: 'CO\u2082 humi. max',
})

export const SeriesProps = {
  [SeriesNames.SOIL]: {
    valueSuffix: ' \u00B0C',
  },
  [SeriesNames.TERMOCOUPLE1]: {
    valueSuffix: ' \u00B0C',
  },
  [SeriesNames.TERMOCOUPLE2]: {
    valueSuffix: ' \u00B0C',
  },
  [SeriesNames.CO2_MAX]: {
    valueSuffix: ' ppm',
  },
  [SeriesNames.CO2_TEMP_MAX]: {
    valueSuffix: ' \u00B0C',
  },
  [SeriesNames.CO2_HUMI_MAX]: {
    valueSuffix: '%',
  },
}

export const createXAxis = (min, max) => {
  return [
    {
      axisLabel: { show: false },
      gridIndex: 0,
      min,
      max,
      position: 'bottom',
      splitLine: { show: false },
      type: 'time',
    },
    {
      gridIndex: 1,
      min,
      max,
      splitLine: { show: false },
      position: 'bottom',
      type: 'time',
    },
  ]
}

export const createYAxis = () => {
  return [
    {
      gridIndex: 0,
      name: 'Soil (\u00B0C)',
      nameGap: 35,
      nameLocation: 'center',
      scale: true,
      splitLine: { show: false },
      type: 'value',
    },
    {
      gridIndex: 0,
      name: 'Termocouple 1 (\u00B0C)',
      nameGap: 35,
      nameLocation: 'center',
      scale: true,
      splitLine: { show: false },
      type: 'value',
    },
    {
      gridIndex: 0,
      name: 'Termocouple 2 (\u00B0C)',
      nameGap: 35,
      nameLocation: 'center',
      offset: 55,
      scale: true,
      splitLine: { show: false },
      type: 'value',
    },
    {
      gridIndex: 1,
      name: 'CO\u2082 max (ppm)',
      nameGap: 35,
      nameLocation: 'center',
      scale: true,
      splitLine: { show: false },
      type: 'value',
    },
    {
      gridIndex: 1,
      name: 'CO\u2082 temp. max (\u00B0C)',
      nameGap: 35,
      nameLocation: 'center',
      scale: true,
      splitLine: { show: false },
      type: 'value',
    },
    {
      gridIndex: 1,
      name: 'CO\u2082 humi. max (%)',
      nameGap: 30,
      nameLocation: 'center',
      offset: 55,
      scale: true,
      splitLine: { show: false },
      type: 'value',
    },
  ]
}

export const createSeries = (data, { annotations = [] } = {}) => {
  let temperatureData = []
  let emissionData = []

  if (data.length === 2) {
    temperatureData = data[0]
    emissionData = data[1]
  }

  return [
    {
      data: mapFieldColumns(temperatureData, 'timestamp', 'temperature3'),
      markLine: {
        symbol: 'none',
        data: annotations,
        animation: false,
      },
      name: SeriesNames.SOIL,
      symbol: 'circle',
      type: 'line',
      xAxisIndex: 0,
      yAxisIndex: 0,
    },
    {
      data: mapFieldColumns(temperatureData, 'timestamp', 'temperature1'),
      name: SeriesNames.TERMOCOUPLE1,
      symbol: 'circle',
      type: 'line',
      xAxisIndex: 0,
      yAxisIndex: 1,
    },
    {
      data: mapFieldColumns(temperatureData, 'timestamp', 'temperature2'),
      name: SeriesNames.TERMOCOUPLE2,
      symbol: 'circle',
      type: 'line',
      xAxisIndex: 0,
      yAxisIndex: 2,
    },
    {
      data: mapFieldColumns(emissionData, 'timestamp', 'co2_max'),
      markLine: {
        symbol: 'none',
        data: annotations,
        animation: false,
      },
      name: SeriesNames.CO2_MAX,
      symbol: 'circle',
      type: 'line',
      xAxisIndex: 1,
      yAxisIndex: 3,
    },
    {
      data: mapFieldColumns(emissionData, 'timestamp', 'temperature_max'),
      name: SeriesNames.CO2_TEMP_MAX,
      symbol: 'circle',
      type: 'line',
      xAxisIndex: 1,
      yAxisIndex: 4,
    },
    {
      data: mapFieldColumns(emissionData, 'timestamp', 'humidity_max'),
      name: SeriesNames.CO2_HUMI_MAX,
      symbol: 'circle',
      type: 'line',
      xAxisIndex: 1,
      yAxisIndex: 5,
    },
  ]
}

export const baseChartOptions = {
  backgroundColor: '#fff',
  dataZoom: [
    { type: 'slider', xAxisIndex: [0, 1], realtime: false, bottom: 28 },
  ],
  grid: createSubplotGrid(2, CHART_HEIGHT, {
    top: 40,
    right: 125,
    bottom: 90,
    left: 60,
  }),
  legend: { type: 'scroll', bottom: 0 },
  title: {
    text: 'Vogamos',
    left: 'center',
    align: 'right',
    textStyle: {
      fontSize: 14,
      fontWeight: 'normal',
    },
  },
  toolbox: defaultToolbox,
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'line',
      lineStyle: {
        type: 'dashed',
      },
    },
    formatter: defaultTooltipFormatter({
      format: 'YYYY-MM-DD HH:mm:ss',
      valueDecimals: 2,
      seriesProps: SeriesProps,
    }),
  },
}
