import { min, max, mean, sum } from 'lodash'

const keys = [
  {
    name: 'RF count',
    field: 'rf_count',
  },
  {
    name: 'AP count',
    field: 'ap_count',
  },
  {
    name: 'RF max. dist. (m)',
    field: 'rf_dist',
    excludeSum: true,
  },
  {
    name: 'AP max. dist. (m)',
    field: 'ap_dist',
    excludeSum: true,
  },
]

export const getStatsInfo = (data) => {
  const stats = []

  keys.forEach((k) => {
    const series = data.map((v) => v[k.field])

    stats.push({
      name: k.name,
      field: k.field,
      min: min(series.filter((v) => v > 0)),
      max: max(series),
      mean: mean(series),
      sum: k.excludeSum ? null : sum(series),
    })
  })

  // Add sum info of both RF & AP count.
  const count = data.map((v) => {
    const rf_count = v.rf_count > 0 ? v.rf_count : 0
    const ap_count = v.ap_count > 0 ? v.ap_count : 0
    return rf_count + ap_count
  })

  stats.push({
    name: 'RF & AP count',
    field: 'count',
    min: min(count.filter((v) => v > 0)),
    max: max(count),
    mean: mean(count),
    sum: sum(count),
  })

  return stats
}
