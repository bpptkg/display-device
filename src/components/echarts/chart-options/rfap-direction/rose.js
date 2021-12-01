import { saveAsImageToolbox } from '../common/toolbox'
import { createCircleTemplate } from '@/utils/series'
import { numberFormatterFactory } from '@/utils/formatter-factory'

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

export const baseChartOptions = ({ title = {} } = {}) => {
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
    polar: {
      radius: '60%',
    },
    radiusAxis: {
      axisLine: { show: false },
      axisLabel: { show: true, fontSize: 9 },
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
    },
  }
}

export const createSeries = (data) => {
  if (data.length === 0) return []

  const series = []
  data.forEach((d) => {
    series.push({
      type: 'bar',
      data: d.binData,
      coordinateSystem: 'polar',
      stack: 'a',
      name: d.direction,
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
