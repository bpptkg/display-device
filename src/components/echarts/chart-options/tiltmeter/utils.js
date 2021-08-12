import { min, max, mean, get } from 'lodash'

const arrayMeta = [
  {
    name: 'x',
    label: 'X',
  },
  {
    name: 'y',
    label: 'Y',
  },
  {
    name: 'temperature',
    label: 'Temperature',
  },
]

export const getStatsInfo = (data) => {
  const stats = []

  arrayMeta.forEach((meta) => {
    const array = data.map((v) => get(v, meta.name))

    stats.push({
      name: meta.label,
      min: min(array),
      max: max(array),
      mean: mean(array),
    })
  })

  return stats
}
