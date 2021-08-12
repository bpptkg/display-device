import moment from 'moment'
import { min, max, mean } from 'lodash'
import { getSeriesByIndex, getFieldColumns } from '@/utils/series'
import regression from '@/lib/math/regression'

const UNIX_SECONDS_TO_DAYS = 1 / (60 * 60 * 24)
const METER_TO_MILIMETER = 1000

/**
 * Make 1D array to 2D array with index. The first column will be index, and
 * the second column will be its value.
 *
 * @param {Array} data 1D array.
 * @returns {Array} 2D array with format [index, value].
 */
export const reshape = (data) => {
  return data.map((v, i) => [i, v])
}

export const getStatsInfo = (data, reflectors) => {
  const stats = []

  reflectors.forEach((name, index) => {
    const array = getSeriesByIndex(data, index).map((v) => v.slope_distance)

    stats.push({
      reflector: name,
      min: min(array),
      max: max(array),
      mean: mean(array),
    })
  })
  return stats
}

/**
 * Calculate linear regression on EDM data.
 *
 * @param {Array} data Array of EDM slope distance data associated with
 * particular reflectors. For example:
 *
 *     [
 *        [{ timestamp: "2020-12-01 05:11:00", slope_distance: 4038.925, ...}, ...],
 *        [{ timestamp: "2020-12-01 05:15:00", slope_distance: 3853.650, ...}, ...]
 *     ]
 *
 * @param {Array} reflectors Array of EDM reflectors. For example: [RB1, RB2].
 * @returns {Array} Array of objects containing linear regression info. Slope
 * distance regression is returned as mm unit.
 */
export const getLinearRegressionInfo = (data, reflectors) => {
  const info = []

  reflectors.forEach((name, index) => {
    const array = getFieldColumns(
      getSeriesByIndex(data, index),

      // Slope distance is converted from meter to milimeter. Date time string
      // is converted to unix timestamp and using day unit. So, we will get
      // gradient as mm/day.
      ['timestamp', (v) => moment(v).unix() * UNIX_SECONDS_TO_DAYS],
      ['slope_distance', (v) => v * METER_TO_MILIMETER]
    )

    const result = regression.linear(array)
    info.push({
      reflector: name, // Reflector name, e.g. RB1, RB2.
      m: result.equation[0], // Gradient in mm/day.
      c: result.equation[1], // Intercept in mm.
      r2: result.r2, // Coefficient of determination (r-squared).
      points: result.points, // Regression points.
    })
  })
  return info
}
