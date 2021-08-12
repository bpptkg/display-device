import { min, max, mean } from 'lodash'
import { cumulativeSum1D } from '@/utils/series'

const keys = [
  {
    name: 'Count',
    field: 'count',
    cumulative: false,
  },
  {
    name: 'Energy',
    field: 'energy',
    cumulative: false,
  },
  {
    name: 'Cum. energy',
    field: 'energy',
    cumulative: true,
  },
]

export const getStatsInfo = (data) => {
  const stats = []

  keys.forEach((k) => {
    const series = data.map((v) => v[k.field])
    const array = k.cumulative ? cumulativeSum1D(series) : series
    stats.push({
      name: k.name,
      min: min(array),
      max: max(array),
      mean: mean(array),
    })
  })

  return stats
}
