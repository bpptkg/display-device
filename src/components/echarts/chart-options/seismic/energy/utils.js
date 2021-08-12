import { min, max, mean } from 'lodash'
import {
  CONVERSION_FACTOR,
  EnergyTypes,
  EnergyTotalSeriesIndex,
} from '@/constants/energy'
import { cumulativeSum1D, getSeriesByIndex } from '@/utils/series'

const FEATURES = ['min', 'max', 'mean']

const FN_MAP = {
  min: (array) => {
    return min(array) || 0
  },
  max: (array) => {
    return max(array) || 0
  },
  mean: (array) => {
    return mean(array) || undefined
  },
}

export const arrayMeta = [
  {
    name: 'energy',
    label: 'Energy Total',
    dataIndex: EnergyTotalSeriesIndex[EnergyTypes.TOTAL],
    cumulative: false,
  },
  {
    name: 'cumEnergyVTBMP',
    label: 'Cum. Energy VTB+MP',
    dataIndex: EnergyTotalSeriesIndex[EnergyTypes.VTBMP],
    cumulative: true,
  },
  {
    name: 'cumEnergyVTA',
    label: 'Cum. Energy VTA',
    dataIndex: EnergyTotalSeriesIndex[EnergyTypes.VTA],
    cumulative: true,
  },
  {
    name: 'cumEnergyTotal',
    label: 'Cum. Energy Total',
    dataIndex: EnergyTotalSeriesIndex[EnergyTypes.TOTAL],
    cumulative: true,
  },
]

/**
 * Get statistics information of seismic energy data.
 *
 * Statistics features are min, max, and mean. If energy type is TOTAL, it
 * calculate the statistics for each other types in the list. Otherwise it
 * calculate statistics features for it value and cumulative. Statistics feature
 * names will be on the row.
 *
 * @param {Array} data Energy data fetched from BMA API.
 * @param {String} type Energy types.
 * @returns {Array} Array of statistics info.
 */
export const getStatsInfo = (data, type) => {
  const stats = []

  if (type === EnergyTypes.TOTAL) {
    arrayMeta.forEach((meta) => {
      const series = getSeriesByIndex(data, meta.dataIndex).map(
        (v) => v.energy / CONVERSION_FACTOR
      )
      const array = meta.cumulative ? cumulativeSum1D(series) : series

      stats.push({
        name: meta.label,
        min: min(array),
        max: max(array),
        mean: mean(array),
      })
    })
  } else {
    const series = data.map((v) => v.energy / CONVERSION_FACTOR)
    const array = cumulativeSum1D(series)

    stats.push({
      name: 'Energy',
      min: min(series),
      max: max(series),
      mean: mean(series),
    })

    stats.push({
      name: 'Cum. Energy',
      min: min(array),
      max: max(array),
      mean: mean(array),
    })
  }

  return stats
}

/**
 * Get statistics information of seismic energy data with feature names as
 * column.
 *
 * @param {Array} data Energy data fetched from BMA API.
 * @param {String} type Energy types.
 * @returns {Array} Array of statistics info.
 */
export const getStatsInfoAsColumn = (data, type) => {
  const stats = []

  if (type === EnergyTypes.TOTAL) {
    FEATURES.forEach((name) => {
      stats.push({
        name: name,
        ...arrayMeta.reduce((result, meta) => {
          const series = getSeriesByIndex(data, meta.dataIndex).map(
            (v) => v.energy / CONVERSION_FACTOR
          )
          const array = meta.cumulative ? cumulativeSum1D(series) : series
          result[meta.name] = FN_MAP[name](array)
          return result
        }, {}),
      })
    })
  } else {
    const array = data.map((v) => v.energy / CONVERSION_FACTOR)
    const cumulativeArray = cumulativeSum1D(array)

    FEATURES.forEach((name) => {
      stats.push({
        name: name,
        energy: FN_MAP[name](array),
        cumulativeEnergy: FN_MAP[name](cumulativeArray),
      })
    })
  }

  return stats
}
