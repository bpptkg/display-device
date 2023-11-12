import { defaultToolbox } from '../common/toolbox'
import { createRowGrid } from '../../../../utils/echarts/grid'
import { defaultTooltipFormatter } from '../../../../utils/echarts/tooltip'
import { mapFieldColumns } from '../../../../utils/series'

const createSeries = (data) => {
  return {
    data: mapFieldColumns(data, 'timestamp', 'baseline'),
    name: 'Klatakan-Labuhan',
    symbol: 'circle',
    symbolSize: 6,
    type: 'line',
    xAxisIndex: 0,
    yAxisIndex: 0,
  }
}

const createXAxis = (min, max) => {
  return [
    {
      gridIndex: 0,
      min,
      max,
      splitLine: { show: true },
      type: 'time',
    },
  ]
}

const createYAxis = () => {
  return [
    {
      axisLabel: { formatter: (v) => (v ? v.toFixed(3) : v) },
      gridIndex: 0,
      name: 'Klatakan-Labuhan (m)',
      nameGap: 10,
      nameLocation: 'end',
      scale: true,
      splitLine: { show: true },
      splitNumber: 4,
      type: 'value',
      axisLine: { show: true },
      axisTick: { show: true },
      nameTextStyle: { align: 'left', fontSize: 11 },
    },
  ]
}

const mediaQuery = [
  {
    query: {
      maxWidth: 575.98,
    },
    option: {
      grid: createRowGrid(1, { left: 20, bottom: 15, top: 18 }),
    },
  },
]

export const createChartOptions = ({ data, min, max }) => {
  return {
    baseOption: {
      backgroundColor: '#fff',
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          lineStyle: {
            type: 'dashed',
          },
        },
        formatter: defaultTooltipFormatter({
          format: 'YYYY-MM-DD HH:mm:ss',
          valueDecimals: 3,
          valueSuffix: ' m',
        }),
      },
      title: {
        text: 'GPS Baseline',
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
      grid: createRowGrid(1, { margin: 5, top: 15 }),
      series: createSeries(data),
      xAxis: createXAxis(min, max),
      yAxis: createYAxis(),
    },
    media: mediaQuery,
  }
}
