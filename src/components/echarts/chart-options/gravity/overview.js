import moment from 'moment'
import { NO_DATA_NOTATION } from '../../../../constants/stats'
import { createRowGrid } from '../../../../utils/echarts/grid'
import {
  createCircleTemplate,
  toUnixMiliSeconds,
} from '../../../../utils/series'
import { tab20ColorMap } from '../../../../utils/tab20'
import { defaultToolbox } from '../common/toolbox'
import { smartIndex } from '../rfap-distdir'

const createXAxis = () => {
  const options = [
    {
      gridIndex: 0,
      axisLabel: { show: true },
      splitLine: { show: false },
      position: 'bottom',
      type: 'time',
    },
  ]

  return options
}

const createYAxis = () => {
  const options = [
    {
      gridIndex: 0,
      nameGap: 60,
      name: 'Gravity (mGal)',
      nameLocation: 'center',
      scale: true,
      splitLine: { show: false },
      type: 'value',
      axisLabel: {
        show: true,
      },
    },
  ]

  return options
}

const mediaQuery = [
  {
    query: {
      maxWidth: 575.98,
    },
    option: {
      grid: createRowGrid(1, { top: 10, bottom: 20, left: 20, right: 5 }),
    },
  },
]

const createSeries = ({ data }) => {
  return data.map((benchmark, index) => ({
    data: benchmark.ts.map((d) => [
      toUnixMiliSeconds(d.period),
      d.g_obs,
      benchmark.sta_fid,
      benchmark.sta,
    ]),
    name: `${benchmark.sta_fid}`,
    type: 'line',
    symbol: 'none',
    symbolSize: 3,
    itemStyle: {
      color:
        tab20ColorMap[smartIndex(index, data.length, tab20ColorMap.length)],
    },
  }))
}

export const tooltipFormatter = () => {
  return (params) => {
    if (Array.isArray(params) && params.length) {
      const template = []

      params.forEach((param, index) => {
        const { seriesName, value, color } = param
        if (index === 0) {
          template.push(`
            ${moment(value[0]).format('YYYY-MM-DD')}<br />
          `)
        }
        template.push(`
        ${createCircleTemplate(color)} 
        ${value[3]} (${seriesName}): ${
          isFinite(value[1]) ? value[1].toFixed(4) : NO_DATA_NOTATION
        }<br />
        `)
      })
      return template.join('')
    } else {
      return ''
    }
  }
}

export const createGravityOverviewChartOptions = ({ data }) => {
  return {
    baseOption: {
      backgroundColor: '#fff',
      title: {
        text: 'Gravity Overview',
        textStyle: {
          fontWeight: 'bold',
          fontSize: 14,
        },
        left: 'center',
      },
      legend: {
        type: 'plain',
        left: 'center',
        bottom: 0,
        itemWidth: 10,
        itemHeight: 10,
        textStyle: { fontSize: 9 },
      },
      toolbox: defaultToolbox,
      grid: createRowGrid(1, { top: 10, bottom: 10, left: 8, right: 2 }),
      xAxis: createXAxis(),
      yAxis: createYAxis(),
      series: createSeries({
        data,
      }),
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          lineStyle: {
            type: 'dashed',
          },
        },
        formatter: tooltipFormatter(),
      },
    },
    media: mediaQuery,
  }
}
