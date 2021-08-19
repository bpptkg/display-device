import moment from 'moment'
import { mapFieldColumns, createCircleTemplate } from '@/utils/series'
import { defaultToolbox } from '../../common/toolbox'
import { SamplingTypes } from '@/constants/seismicity'

export const createSeries = (clusterGroup) => {
  return clusterGroup.map((group) => {
    return {
      barCategoryGap: '0%',
      barGap: '5%',
      barWidth: '80%',
      data: mapFieldColumns(group.data, 'timestamp', 'count'),
      name: `${group.cluster}`,
      stack: 'one',
      type: 'bar',
    }
  })
}

export const createLegend = (clusterGroup) => {
  return {
    type: 'scroll',
    // Value and type must be the same with series name.
    data: clusterGroup.map((group) => `${group.cluster}`),
    bottom: 0,
  }
}

export const createXAxis = (min, max) => {
  return {
    axisLabel: { show: true },
    axisTick: { show: true },
    min,
    max,
    splitLine: { show: false },
    type: 'time',
  }
}

export const baseChartOptions = ({ title = {} } = {}) => {
  return {
    backgroundColor: '#fff',
    dataZoom: [
      {
        type: 'slider',
        realtime: false,
        bottom: 28,
      },
    ],
    grid: {
      bottom: 93,
    },
    title: {
      text: 'Seismicity',
      left: 'center',
      align: 'right',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      subtextStyle: {
        color: '#363636',
      },
      ...title,
    },
    yAxis: {
      name: 'Count',
      nameGap: 35,
      nameLocation: 'center',
      scale: false,
      splitLine: { show: false },
      type: 'value',
    },
    toolbox: defaultToolbox,
  }
}

export const tooltipFormatter = (sampling) => {
  return (param) => {
    const { seriesName, value, color } = param
    const dateFormat =
      sampling === SamplingTypes.HOUR ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD'
    return `${moment(value[0]).format(dateFormat)}<br/>
          ${createCircleTemplate(color)}
          Cluster ${seriesName}: ${value[1]}`
  }
}

export const mediaQuery = () => {
  return [
    {
      query: {
        maxWidth: 575.98,
      },
      option: {
        yAxis: {
          nameLocation: 'end',
          nameGap: 20,
        },
        grid: {
          top: 75,
        },
        title: {
          top: 20,
        },
      },
    },
  ]
}
