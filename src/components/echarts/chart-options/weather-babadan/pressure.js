import { getFieldColumns } from '@/utils/series'
import { defaultToolbox } from '../common/toolbox'

export const baseChartOptions = ({ title = {} } = {}) => {
  return {
    backgroundColor: '#fff',
    title: {
      align: 'right',
      left: 'center',
      show: true,
      text: 'Air Pressure',
      textStyle: { fontSize: 16, fontWeight: 'bold' },
      subtext: '',
      subtextStyle: { color: '#363636' },
      ...title,
    },
    grid: {
      left: 80,
    },
    toolbox: defaultToolbox,
    tooltip: {
      trigger: 'item',
      formatter: (params) => {
        const { value } = params
        return `Temperature: ${value[0]}\u00B0C<br />
        Pressure: ${value[1]} hPa`
      },
    },
    xAxis: {
      type: 'value',
      scale: true,
      name: 'Temperature (\u00B0C)',
      nameLocation: 'center',
      nameGap: 30,
    },
    yAxis: {
      type: 'value',
      scale: true,
      name: 'Pressure (hPa)',
      nameLocation: 'center',
      nameGap: 55,
    },
  }
}

export const createSeries = (data) => {
  return [
    {
      data: getFieldColumns(data, 'air_temperature', 'air_pressure'),
      type: 'scatter',
      symbol: 'circle',
      symbolSize: 7,
      itemStyle: {
        color: '#8378ea',
      },
    },
  ]
}

export const mediaQuery = [
  {
    query: {
      maxWidth: 575.98,
    },
    option: {
      grid: {
        left: 75,
        right: 15,
        top: 90,
      },
      yAxis: {
        nameLocation: 'center',
        nameGap: 55,
        nameTextStyle: {
          align: 'center',
        },
      },
      title: { top: 25, textStyle: { fontSize: 13 } },
    },
  },
]
