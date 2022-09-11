import { min, max, mean, get, sum } from 'lodash'
import { STATIONS } from './index'

export const getStatsInfo = (data) => {
  const stats = []

  STATIONS.forEach((station) => {
    const series = data.map((d) => {
      const obj = d.countsta
      return get(obj, station.id) || get(obj, String(station.id))
    })
    stats.push({
      name: station.name,
      min: min(series.filter((v) => v > 0)),
      max: max(series),
      mean: mean(series),
      sum: sum(series),
    })
  })

  return stats
}
