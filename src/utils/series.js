import { reduce } from 'lodash'
import moment from 'moment'

export const toUnixMiliSeconds = (value) => {
  return moment(value).unix() * 1000
}

/**
 * Array of objects getter.
 *
 * This function acts as getter from array of objects. `timestamp` field is
 * required and be returned in Unix miliseconds. For example, if you have the
 * following data:
 *
 * ```
 * [
 *   {
 *     timestamp: "2020-08-20T17:30:00",
 *     wind_direction: 299,
 *     wind_speed: 8.17,
 *     air_temperature: 10.81,
 *     air_humidity: 91.1,
 *     air_pressure: 74.07,
 *     rainfall: 71.04,
 *     amount: 7999,
 *     battery_voltage: 12.62,
 *     power_temperature: 19.19,
 *     actual_rainfall: null,
 *     cumulative_rainfall: null,
 *     rate: null
 *   },
 *   ...
 * ]
 * ```
 *
 * Then by using this code:
 *
 * ```
 *   mapFieldColumns(data, 'timestamp', 'wind_direction', 'wind_speed')
 * ```
 *
 * You will get the following:
 *
 * ```
 * [
 *   [1597919400000, 299, 8.17],
 *   ...
 * ]
 * ```
 *
 * `columnNames` can also be an array that contains column to be processed and
 * its transform function:
 *
 * ```
 *   mapFieldColumns(data, 'timestamp', 'wind_direction', ['wind_speed',
 *    'wind_speed' => 'wind_speed' / 1000])
 * ```
 *
 * Results:
 *
 * ```
 * [
 *   [1597919400000, 299, 0.00817],
 *   ...
 * ]
 * ```
 *
 * @param {Array} data Array of objects.
 * @param {String} timestamp Timestamp field name.
 * @param  {...[String | Array]} columnNames Column name to get the value.
 * @returns {Array} Array of two or more columns asscociated with getter
 * arguments.
 */
export const mapFieldColumns = (data, timestamp, ...columnNames) => {
  return data.map((item) => {
    return [
      moment(item[timestamp]).unix() * 1000, // Convert to unix miliseconds
      ...columnNames.map((col, index) => {
        if (Array.isArray(col)) {
          if (col.length !== 2)
            throw new Error('Item array must be length of 2')
          const [name, callback] = col
          return callback(item[name], item, index, data)
        } else if (typeof col === 'object') {
          const { name, callback } = col
          return callback(item[name], item, index, data)
        } else {
          return item[col]
        }
      }),
    ]
  })
}

export const getFieldColumns = (data, ...columnNames) => {
  return data.map((item) => {
    return columnNames.map((col, index) => {
      if (Array.isArray(col)) {
        if (col.length !== 2) throw new Error('Item array must be length of 2')
        const [name, callback] = col
        return callback(item[name], item, index, data)
      } else if (typeof col === 'object') {
        const { name, callback } = col
        return callback(item[name], item, index, data)
      } else {
        return item[col]
      }
    })
  })
}

export function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const mapOrEmpty = (data, field) => {
  return data[field] ? data[field] : ''
}

export const makeIndex = (n) => {
  return [...Array(n).keys()]
}

/**
 * Create HTML circle template. It typically used for marking series name in the
 * chart tooltip.
 *
 * @param {String} color Circle color in hex, rgb or rga format.
 * @param {Number} size Size of circle in pixel.
 */
export const createCircleTemplate = (color, size = 12) => {
  return `<span style="background-color:${color};width:${size}px;height:${size}px;border-radius:50%;display:inline-block;"></span>`
}

export const createDividerTemplate = ({
  margin = '5px 0',
  bordercolor = '#fff',
  borderWidth = '1px',
  borderType = 'solid',
  height = '1px',
  width = '100%',
} = {}) => {
  return `<span style="margin:${margin};border-top:${borderWidth} ${borderType} ${bordercolor};display:block;height:${height};width:${width};"></span>`
}

/**
 * Get series data by index. Return empty if any error happen.
 *
 * @param {Array} data Array of seismicity data.
 * @param {Number} index Index number whose data to get.
 */
export const getSeriesByIndex = (data, index) => {
  if (index >= 0 && index < data.length) {
    return data[index]
  } else {
    return []
  }
}

/**
 * Calculate cumulative sum of time series data. Cumulative sum will be
 * calculated on the second column.
 *
 * @param {Array} data Array of two columns time series data.
 */
export const cumulativeSum = (data) => {
  const series = [...data]
  const arr = series.map((v) => v[1])
  arr.reduce((a, b, i) => (series[i][1] = a + b), 0)
  return series
}

/**
 * Calculate cumulative sum of 1D array.
 *
 * @param {Array} arr
 * @returns {Array}
 */
export const cumulativeSum1D = (arr) => {
  const builder = (acc, n) => {
    const lastNum = acc.length > 0 ? acc[acc.length - 1] : 0
    acc.push(lastNum + n)
    return acc
  }
  return reduce(arr, builder, [])
}

export const mapErrorBar = (data, timestamp, field, errorField) => {
  return data.map((v) => [
    moment(v[timestamp]).unix() * 1000,
    v[field] - v[errorField],
    v[field] + v[errorField],
  ])
}
