import { getFieldColumns } from '@/utils/series'
import { defaultToolbox } from '../common/toolbox'

export const baseChartOptions = {
  backgroundColor: '#fff',
  title: {
    align: 'right',
    left: 'center',
    show: false,
    text: 'Air Pressure',
    textStyle: { fontSize: 14, fontWeight: 'normal' },
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
    nameGap: 40,
  },
}

export const createSeries = (data) => {
  return [
    {
      data: getFieldColumns(data, 'air_temperature', [
        'air_pressure',
        (v) => v * 10, // Convert kPa to hPa.
      ]),
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
        left: '15%',
        right: '5%',
      },
      yAxis: {
        nameLocation: 'end',
        nameGap: 15,
        nameTextStyle: {
          align: 'center',
        },
      },
    },
  },
]
