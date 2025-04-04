import _ from 'lodash'
import { saveAsImageToolbox } from '../common/toolbox'
import { createCircleTemplate, createDividerTemplate } from '@/utils/series'
import { numberFormatterFactory } from '@/utils/formatter-factory'
import { normalizeDirection } from '../../../../utils/rfap'

export const SupportedXAxisType = Object.freeze({
  COUNT: 'count',
  DISTANCE: 'distance',
})

const f = numberFormatterFactory(0)

export const baseChartOptions = (
  input,
  { axis = SupportedXAxisType.COUNT, title = {} } = {}
) => {
  // Direction can be multiple values separated by comma. So, we need to split
  // it and create a new object for each direction.
  const data = normalizeDirection(input)
  let seriesData = []
  if (axis === SupportedXAxisType.COUNT) {
    seriesData = _.orderBy(data, ['count'], 'asc')
  } else {
    seriesData = _.orderBy(
      data.filter((v) => typeof v.distance === 'number'),
      ['distance'],
      'asc'
    ).map((d) => [d.distance, d.direction, d.count])
  }

  let series = []
  let legend = null
  if (axis === SupportedXAxisType.COUNT) {
    // Create stacked bar plot.
    series = [
      {
        name: 'RF',
        type: 'bar',
        stack: 'one',
        data: seriesData.map((v) => [
          v.rf_count,
          v.direction,
          v.rf_distance,
          v.distance,
        ]),
      },
      {
        name: 'AP',
        type: 'bar',
        stack: 'one',
        itemStyle: {
          color: '#c12e34',
        },
        data: seriesData.map((v) => [
          v.ap_count,
          v.direction,
          v.ap_distance,
          v.distance,
        ]),
      },
    ]

    legend = { type: 'scroll', bottom: 0, right: 0 }
  } else if (axis === SupportedXAxisType.DISTANCE) {
    series = [
      {
        name: 'Kali',
        type: 'bar',
        data: seriesData,
      },
    ]
  } else {
    series = []
  }

  const options = {
    backgroundColor: '#fff',
    legend: legend,
    grid: { left: 100 },
    title: {
      align: 'right',
      left: 'center',
      show: true,
      text:
        axis === SupportedXAxisType.COUNT
          ? 'RF & AP Direction'
          : 'RF & AP Distance',
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
    xAxis: {
      axisLabel: {
        formatter: (v) => {
          if (axis === SupportedXAxisType.COUNT) {
            return v
          } else if (axis === SupportedXAxisType.DISTANCE) {
            // Convert m to km.
            return typeof v === 'number' ? v / 1000 : '-'
          } else {
            return v
          }
        },
      },
      type: 'value',
      name: axis === SupportedXAxisType.COUNT ? 'Count' : 'Max. distance (km)',
      nameGap: 28,
      nameLocation: 'center',
    },
    yAxis: {
      type: 'category',
      axisLabel: {
        interval: 0,
      },
    },
    series: series,
    tooltip: {
      show: true,
      formatter: function (params) {
        if (axis === SupportedXAxisType.COUNT) {
          let countLabel = ''
          let distanceLabel = ''
          if (params.seriesName === 'RF') {
            countLabel = 'RF count'
            distanceLabel = 'RF max. dist'
          } else if (params.seriesName === 'AP') {
            countLabel = 'AP count'
            distanceLabel = 'AP max. dist'
          } else {
            countLabel = 'Count'
            distanceLabel = 'Max. distance'
          }

          return `
            ${createCircleTemplate(params.color)} ${params.value[1]}<br />
            ${countLabel}: ${f(params.value[0])}<br />
            ${distanceLabel}: ${f(params.value[2])} m<br />
            ${createDividerTemplate()}
            Max. distance: ${f(params.value[3])} m<br />
          `
        } else if (axis === SupportedXAxisType.DISTANCE) {
          return `
            ${createCircleTemplate(params.color)} ${params.value[1]}<br />
            Max. distance: ${f(params.value[0])} m<br />
            RF & AP count: ${f(params.value[2])}<br />
        `
        } else {
          return ''
        }
      },
    },
  }

  return options
}
