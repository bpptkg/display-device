import moment from 'moment'
import {
  getSeriesByIndex,
  makeIndex,
  mapFieldColumns,
  createCircleTemplate,
  createDividerTemplate,
} from '@/utils/series'
import { defaultToolbox } from '../common/toolbox'

export const CHART_VIEWS = Object.freeze({
  slope_distance: 'slope_distance',
  slope_distance_and_rate: 'slope_distance_and_rate',
  csd_and_rate: 'csd_and_rate',
})

export const SERIES = Object.freeze({
  slope_distance: 'Slope Dist.',
  rate: 'Rate',
  csd: 'CSD',
})

export const createSeries = (
  data,
  reflectors,
  { annotations = [], chartView = CHART_VIEWS.slope_distance } = {}
) => {
  return reflectors
    .map((name, index) => {
      const reflectorSeries = {
        data: mapFieldColumns(
          getSeriesByIndex(data, index),
          'timestamp',
          (function () {
            switch (chartView) {
              case CHART_VIEWS.slope_distance:
              case CHART_VIEWS.slope_distance_and_rate:
                return 'slope_distance'
              case CHART_VIEWS.csd_and_rate:
                // Convert CSD from mm to cm.
                return ['csd', (csd) => csd / 10]
              default:
                return 'slope_distance'
            }
          })()
        ),
        markLine: {
          symbol: 'none',
          data: annotations,
          animation: false,
        },
        name: (function () {
          switch (chartView) {
            case CHART_VIEWS.slope_distance:
            case CHART_VIEWS.slope_distance_and_rate:
              return `${name} ${SERIES.slope_distance}`
            case CHART_VIEWS.csd_and_rate:
              return `${name} ${SERIES.csd}`
            default:
              return SERIES.slope_distance
          }
        })(),
        symbol: 'circle',
        symbolSize: 6,
        type: 'line',
        xAxisIndex: index,
        yAxisIndex:
          chartView === CHART_VIEWS.slope_distance ? index : index * 2,
        zindex: 10,
      }

      if (chartView !== CHART_VIEWS.slope_distance) {
        const rateSeries = {
          data: mapFieldColumns(
            getSeriesByIndex(data, index),
            'timestamp',
            'rate', // Index 1
            'intercept', // Index 2
            'r2', // Index 3
            'pvalue', // Index 4
            'stderr' // Index 5
          ),
          name: `${name} ${SERIES.rate}`,
          symbol: 'circle',
          symbolSize: 6,
          type: 'line',
          xAxisIndex: index,
          yAxisIndex: index * 2 + 1,
        }

        return [reflectorSeries, rateSeries]
      }

      return [reflectorSeries]
    })
    .flat(1)
}

export const createRegressionSeries = (
  data,
  { chartView = CHART_VIEWS.slope_distance } = {}
) => {
  // Data from regression info are in unix days and milimeter. So, we need to
  // convert unix days to miliseconds and milimeter to meter.
  return data.map((item, index) => {
    return {
      data: item.points.length
        ? item.points.map((v) => [v[0] * 86400000, v[1] / 1000.0])
        : [],
      lineStyle: {
        color: 'black',
      },
      itemStyle: {
        color: 'black',
      },
      name: 'Regression',
      type: 'line',
      xAxisIndex: index,
      yAxisIndex: (function () {
        switch (chartView) {
          case CHART_VIEWS.slope_distance:
            return index
          case CHART_VIEWS.slope_distance_and_rate:
          case CHART_VIEWS.csd_and_rate:
            return index * 2
          default:
            return index
        }
      })(),
    }
  })
}

export const createXAxis = (nrows, min, max) => {
  const axis = []
  const indices = makeIndex(nrows)

  indices.forEach((index) => {
    if (index === nrows - 1) {
      axis.push({
        gridIndex: index,
        min,
        max,
        splitLine: { show: false },
        type: 'time',
      })
    } else {
      axis.push({
        axisLabel: { show: false },
        axisTick: { show: false },
        gridIndex: index,
        min,
        max,
        splitLine: { show: false },
        type: 'time',
      })
    }
  })
  return axis
}

export const createYAxis = (
  reflectors,
  { chartView = CHART_VIEWS.slope_distance } = {}
) => {
  return reflectors
    .map((name, index) => {
      const reflectorYAxis = {
        axisLabel: {
          formatter: (v) =>
            v
              ? v.toFixed(
                  chartView === CHART_VIEWS.slope_distance ||
                    chartView === CHART_VIEWS.slope_distance_and_rate
                    ? 3
                    : 0
                )
              : v,
        },
        gridIndex: index,
        name:
          chartView === CHART_VIEWS.csd_and_rate
            ? `CSD ${name} (cm)`
            : `${name} (m)`,
        nameGap: 10,
        nameLocation: 'end',
        scale: true,
        splitLine: { show: true },
        splitNumber: 4,
        type: 'value',
      }

      if (chartView !== CHART_VIEWS.slope_distance) {
        const rateYAxis = {
          axisLabel: { formatter: (v) => (v ? v.toFixed(0) : v) },
          gridIndex: index,
          name: 'Rate (mm/day)',
          nameGap: 10,
          nameLocation: 'end',
          scale: true,
          splitLine: { show: false },
          splitNumber: 4,
          type: 'value',
        }

        return [reflectorYAxis, rateYAxis]
      }

      return [reflectorYAxis]
    })
    .flat(1)
}

export const baseChartOptions = {
  backgroundColor: '#fff',
  toolbox: defaultToolbox,
  legend: { type: 'scroll', bottom: 0 },
}

/**
 * Calculate adaptive height based on number of suplots.
 *
 * @param {Number} nrows Number of subplots
 * @returns {Number} Height in pixel.
 */
export const calculateAdaptiveHeight = (nrows) => {
  // All values are in pixel.
  if (nrows === 1) {
    return 400
  } else if (nrows === 2) {
    return 425
  } else if (nrows === 3) {
    return 450
  } else if (nrows === 3) {
    return 500
  } else if (nrows === 4) {
    return 550
  } else {
    return 150 * 5
  }
}

export const tooltipFormatter = (chartView) => {
  const noData = '-'

  return (params) => {
    if (Array.isArray(params) && params.length) {
      const template = []

      params.forEach((param, index) => {
        const { seriesName, value, color } = param
        if (index === 0) {
          template.push(
            `${moment(value[0]).format('YYYY-MM-DD HH:mm:ss')}<br />`
          )
        }

        let valueFormatted = ''
        switch (chartView) {
          case CHART_VIEWS.slope_distance:
            if (seriesName.includes(SERIES.slope_distance)) {
              valueFormatted = `
              ${createCircleTemplate(color)}
              ${seriesName}: ${value[1] ? value[1].toFixed(3) : noData} m<br />`
            } else if (seriesName.includes('Regression')) {
              valueFormatted = `
              ${createCircleTemplate(color)}
              ${seriesName}: ${value[1] ? value[1].toFixed(3) : noData} m<br />`
            }
            break

          case CHART_VIEWS.slope_distance_and_rate:
            if (seriesName.includes(SERIES.slope_distance)) {
              // Slope Distance.
              valueFormatted = `
                ${createCircleTemplate(color)}
                ${seriesName}: ${
                value[1] ? value[1].toFixed(3) : noData
              } m<br />
                `
            } else if (seriesName.includes(SERIES.rate)) {
              // Rate.
              valueFormatted = `
                ${createCircleTemplate(color)}
                ${seriesName}: ${
                value[1] ? value[1].toFixed(2) : noData
              } mm/day<br />
                ${createDividerTemplate()}
                Intercept: ${value[2] ? value[2].toFixed(3) : noData} m<br />
                R\u00B2: ${value[3] ? value[3].toFixed(3) : noData}<br />
                Std. error: ${
                  value[5] ? value[5].toExponential(3) : noData
                }<br />
                `
            }
            break

          case CHART_VIEWS.csd_and_rate:
            if (seriesName.includes(SERIES.csd)) {
              // CSD.
              valueFormatted = `
                ${createCircleTemplate(color)}
                ${seriesName}: ${
                value[1] ? value[1].toFixed(2) : noData
              } cm<br />
                `
            } else if (seriesName.includes(SERIES.rate)) {
              // Rate.
              valueFormatted = `
                ${createCircleTemplate(color)}
                ${seriesName}: ${
                value[1] ? value[1].toFixed(2) : noData
              } mm/day<br />
                ${createDividerTemplate()}
                Intercept: ${value[2] ? value[2].toFixed(3) : noData} m<br />
                R\u00B2: ${value[3] ? value[3].toFixed(3) : noData}<br />
                Std. error: ${
                  value[5] ? value[5].toExponential(3) : noData
                }<br />
                `
            }
            break
        }

        template.push(valueFormatted)
      })
      return template.join('')
    } else {
      const { seriesName, value, color, name, componentType } = params
      if (componentType === 'markLine') {
        return `${moment(value[0]).format('YYYY-MM-DD HH:mm:ss')}<br />
        ${createCircleTemplate(color)}
        ${name}`
      } else {
        return `${moment(value[0]).format('YYYY-MM-DD HH:mm:ss')}<br />
        ${createCircleTemplate(color)} 
        ${seriesName}: ${value[1] ? value[1].toFixed(3) : noData} m<br />`
      }
    }
  }
}
