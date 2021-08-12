import { defaultToolbox } from '../common/toolbox'
import { defaultTooltipFormatter } from '@/utils/echarts/tooltip'
import { mapFieldColumns } from '@/utils/series'

export const baseChartOptions = {
  backgroundColor: '#fff',
  dataZoom: [{ type: 'slider', realtime: false, bottom: 0 }],
  title: {
    align: 'right',
    left: 'center',
    show: true,
    text: 'DOAS',
    textStyle: { fontSize: 14, fontWeight: 'normal' },
  },
  grid: {
    bottom: 80,
  },
  toolbox: defaultToolbox,
  tooltip: {
    trigger: 'item',
    formatter: defaultTooltipFormatter({
      format: 'YYYY-MM-DD HH:mm:ss',
      valueDecimals: 2,
      valueSuffix: ' ton/day',
    }),
  },
  yAxis: {
    type: 'value',
    scale: true,
    name: 'SO\u2082 flux (ton/day)',
    nameLocation: 'center',
    nameGap: 45,
  },
}

export const createSeries = (data, { annotations = [] }) => {
  return [
    {
      data: mapFieldColumns(data, 'starttime', 'flux'),
      name: 'Flux',
      markLine: {
        symbol: 'none',
        data: annotations,
        animation: false,
      },
      type: 'scatter',
      symbol: 'circle',
      symbolSize: 7,
      itemStyle: {
        color: '#8378ea',
      },
    },
  ]
}

export const createXAxis = (min, max) => {
  return {
    min,
    max,
    type: 'time',
    splitLine: { show: false },
  }
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
          align: 'left',
        },
      },
    },
  },
]
