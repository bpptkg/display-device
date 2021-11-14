import { min, max, mean, get } from 'lodash'
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
      min: min(series),
      max: max(series),
      mean: mean(series),
    })
  })

  return stats
}
