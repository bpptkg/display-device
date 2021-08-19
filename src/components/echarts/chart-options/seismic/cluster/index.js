import { mapFieldColumns, makeIndex } from '@/utils/series'
import { createSubplotGrid } from '@/utils/echarts/grid'
import { defaultToolbox } from '../../common/toolbox'
import { createYAxis } from '../seismicity/index'

export const createSeries = (clusterGroup, { annotations = [] } = {}) => {
  return clusterGroup.map((group, index) => {
    return {
      barGap: '5%',
      barWidth: '80%',
      barCategoryGap: '0%',
      data: mapFieldColumns(group.data, 'timestamp', 'count'),
      markLine: {
        symbol: 'none',
        data: annotations,
        animation: false,
      },
      name: `Cluster ${group.cluster}`,
      type: 'bar',
      xAxisIndex: index,
      yAxisIndex: index,
    }
  })
}

export const baseChartOptions = (clusterGroup, { title = {} } = {}) => {
  return {
    backgroundColor: '#fff',
    dataZoom: [
      {
        type: 'slider',
        xAxisIndex: makeIndex(clusterGroup.length || 1),
        realtime: false,
      },
    ],
    grid: createSubplotGrid(
      clusterGroup.length || 1,
      calculateAdaptiveHeight(clusterGroup.length || 1),
      { margin: 20, top: 50, right: 20, bottom: 60, left: 65 }
    ),
    title: {
      text: 'Seismicity',
      left: 'center',
      align: 'right',
      textStyle: {
        fontSize: 15,
        fontWeight: 'bold',
      },
      ...title,
    },
    yAxis: createYAxis(clusterGroup.map((v) => v.cluster) || [1]),
    toolbox: defaultToolbox,
  }
}

export const calculateAdaptiveHeight = (nrows) => {
  // All values are in pixel.
  if (nrows === 1) {
    return 300
  } else if (nrows === 2) {
    return 425
  } else if (nrows === 3) {
    return 450
  } else if (nrows === 3) {
    return 500
  } else if (nrows === 4) {
    return 550
  } else if (nrows > 4 && nrows <= 8) {
    return 800
  } else {
    return 80 * nrows
  }
}

export const createYAxisMobile = (names) => {
  return names.map(() => {
    return {
      nameGap: 7,
      nameLocation: 'end',
      nameTextStyle: { align: 'left', fontSize: 11 },
    }
  })
}

export const mediaQuery = (clusterGroup) => {
  return [
    {
      query: {
        maxWidth: 575.98,
      },
      option: {
        grid: createSubplotGrid(
          clusterGroup.length || 1,
          calculateAdaptiveHeight(clusterGroup.length || 1),
          { margin: 20, top: 50, right: 20, bottom: 60, left: 40 }
        ),
        title: {
          top: 5,
        },
        yAxis: createYAxisMobile(clusterGroup.map((v) => v.cluster) || [1]),
      },
    },
  ]
}
