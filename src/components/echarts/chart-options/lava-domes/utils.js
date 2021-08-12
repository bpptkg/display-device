import { min, max, mean } from 'lodash'

const keys = [
  {
    name: 'Volume',
    field: 'volume',
  },
  {
    name: 'Rate',
    field: 'rate',
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
