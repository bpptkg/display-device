import { min, max, mean } from 'lodash'

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
  },
  {
    name: 'AP max. dist. (m)',
    field: 'ap_dist',
  },
]

export const getStatsInfo = (data) => {
  const stats = []

  keys.forEach((k) => {
    const series = data.map((v) => v[k.field])
    stats.push({
      name: k.name,
      min: min(series),
      max: max(series),
      mean: mean(series),
    })
  })

  return stats
}
