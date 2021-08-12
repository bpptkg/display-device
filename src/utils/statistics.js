import { get, maxBy, minBy, sumBy, meanBy } from 'lodash'
import { StatisticalInfo } from '@/constants/stats'

const FN_MAP = {
  [StatisticalInfo.MIN]: (array, name) => {
    const result = minBy(array, (v) => get(v, name))
    return get(result, name)
  },
  [StatisticalInfo.MAX]: (array, name) => {
    const result = maxBy(array, (v) => get(v, name))
    return get(result, name)
  },
  [StatisticalInfo.SUM]: (array, name) => {
    return sumBy(array, (v) => get(v, name))
  },
  [StatisticalInfo.MEAN]: (array, name) => {
    return meanBy(array, (v) => get(v, name))
  },
}

const FEATURE_KEY = 'feature'

/**
 * Transpose array of objects for a given field names.
 *
 * @param {Object[]} array Array of objects.
 * @param {String[]} fieldNames Array of field names to transpose.
 * @param {String[]} columnNames Source data array column names.
 * @returns {Object[]}
 */
export function transpose(array, fieldNames, columnNames) {
  if (!Array.isArray(array) || !array.length) return []

  const columns = columnNames.length ? columnNames : Object.keys(array[0])
  const result = []

  columns.forEach((col) => {
    const obj = {}
    fieldNames.forEach((name, index) => {
      obj[name] = array[index][col]
    })
    result.push(obj)
  })

  return result
}

export class StatisticalInformation {
  constructor(array, { featureName = false } = {}) {
    this.array = Array.isArray(array) ? array : []
    this.options = { featureName }
  }

  getData() {
    return this.array
  }

  getColumnNames() {
    if (!this.array.length) {
      return []
    } else {
      return Object.keys(this.array[0])
    }
  }

  setOptions(options) {
    this.options = {
      ...this.options,
      ...options,
    }
  }

  /**
   * Get statistical information for given features.
   *
   * @param {String[]} features
   * @param  {...String} columnNames
   * @returns {Object[]}
   */
  getInfo(features, ...columnNames) {
    if (!this.array.length || !features.length) return []

    const columns = columnNames.length ? columnNames : this.getColumnNames()
    if (!columns.length) return []

    const info = []

    features.forEach((name) => {
      const obj = {}
      columns.forEach((col) => {
        // Map feature name to calculation function.
        obj[col] = FN_MAP[name](this.array, col)

        if (this.options.featureName) {
          obj[FEATURE_KEY] = name
        }
      })
      info.push(obj)
    })

    return info
  }

  /**
   * Get statistical information for given features as object.
   *
   * @param {String[]} features
   * @param  {...String} columnNames
   * @returns {Object}
   */
  getInfoAsObject(features, ...columnNames) {
    if (!this.array.length || !features.length) return {}

    const columns = columnNames.length ? columnNames : this.getColumnNames()
    if (!columns.length) return {}

    const info = {}

    columns.forEach((col) => {
      info[col] = features.reduce((acc, name) => {
        acc[name] = FN_MAP[name](this.array, col)
        return acc
      }, {})
    })

    return info
  }

  /**
   * Get statistical information for given features as array transposed.
   * @param {String[]} features
   * @param  {...String} columnNames
   * @returns {Object[]}
   */
  getInfoTransposed(features, ...columnNames) {
    const info = this.getInfo(features, ...columnNames)
    return transpose(info, features, columnNames)
  }

  minBy(name) {
    return minBy(this.array, (v) => v[name])[name]
  }

  maxBy(name) {
    return maxBy(this.array, (v) => v[name])[name]
  }

  sumBy(name) {
    return sumBy(this.array, (v) => v[name])
  }
}
