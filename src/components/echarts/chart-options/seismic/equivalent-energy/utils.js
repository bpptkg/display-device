import { min, max, mean, sum } from 'lodash'
import { cumulativeSum1D } from '@/utils/series'

const keys = [
  {
    name: 'Count RF',
    field: 'count_ROCKFALL',
  },
  {
    name: 'Count AP',
    field: 'count_AWANPANAS',
  },
  {
    name: 'Count RF & AP',
    field: 'count',
  },
  {
    name: 'Energy',
    field: 'energy',
  },
  {
    name: 'Cum. energy',
    field: 'energy',
    cumulative: true,
    excludeSum: true,
  },
]

export const getStatsInfo = (data) => {
  const stats = []

  keys.forEach((k) => {
    const series = data.map((v) => v[k.field])
    const array = k.cumulative ? cumulativeSum1D(series) : series
    stats.push({
      name: k.name,
      field: k.field,
      min: min(array),
      max: max(array),
      mean: mean(array),
      sum: k.excludeSum ? null : sum(array),
    })
  })

  return stats
}
