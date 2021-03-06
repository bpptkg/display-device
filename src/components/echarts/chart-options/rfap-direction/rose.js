import { saveAsImageToolbox } from '../common/toolbox'
import { createCircleTemplate } from '@/utils/series'
import { numberFormatterFactory } from '@/utils/formatter-factory'

import { colorMap, smartIndex } from '../rfap-distdir'

const f = numberFormatterFactory(0)

const SECTOR = 8
const START_ANGLE = 360 / SECTOR / 2 + 90
export const DATA = [
  'N [Utara]',
  'NE [Timur Laut]',
  'E [Timur]',
  'SE [Tenggara]',
  'S [Selatan]',
  'SW [Barat Daya]',
  'W [Barat]',
  'NW [Barat Laut]',
]

export const DATA_SHORT = [
  'N [U]',
  'NE [TL]',
  'E [T]',
  'SE [TG]',
  'S [S]',
  'SW [BD]',
  'W [B]',
  'NW [BL]',
]

export const baseChartOptions = ({
  title = {},
  axisLabel = {},
  tooltip = {},
} = {}) => {
  return {
    angleAxis: {
      type: 'category',
      startAngle: START_ANGLE,
      axisLine: {
        show: true,
      },
      axisTick: {
        alignWithLabel: true,
      },
      data: DATA,
    },
    backgroundColor: '#fff',
    legend: {
      type: 'plain',
      bottom: 0,
      itemWidth: 15,
      itemHeight: 10,
      textStyle: { fontSize: 11 },
    },
    polar: {
      radius: '60%',
    },
    radiusAxis: {
      axisLine: { show: false },
      axisLabel: { show: true, fontSize: 9, ...axisLabel },
      minorTick: { show: false },
      axisTick: { show: false },
    },
    title: {
      align: 'right',
      left: 'center',
      show: true,
      text: 'RF & AP Direction Group',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
      },
      subtext: '',
      subtextStyle: { color: '#363636' },
      ...title,
    },
    toolbox: {
      feature: {
        saveAsImage: saveAsImageToolbox,
      },
    },
    tooltip: {
      show: true,
      formatter: function (params) {
        return `
        ${createCircleTemplate(params.color)} ${params.seriesName}: ${f(
          params.value
        )}<br />
        `
      },
      ...tooltip,
    },
  }
}

export const createSeries = (data) => {
  if (data.length === 0) return []

  const series = []
  data.forEach((d, index) => {
    series.push({
      type: 'bar',
      data: d.binData,
      coordinateSystem: 'polar',
      stack: 'a',
      name: d.direction,
      itemStyle: {
        color: colorMap[smartIndex(index, data.length, colorMap.length)],
      },
    })
  })
  return series
}

export const mediaQuery = () => {
  return [
    {
      query: {
        maxWidth: 575.98,
      },
      option: {
        polar: {
          radius: '50%',
        },
      },
    },
  ]
}
