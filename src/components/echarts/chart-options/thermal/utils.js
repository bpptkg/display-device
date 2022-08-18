import { min, max, mean } from 'lodash'
import { AREAS_STATION_MAP } from '@/store/thermal'

export const getStatsInfo = (data, station) => {
  const stats = []

  const areas = AREAS_STATION_MAP[station]
  areas.forEach((area, index) => {
    const array = data.map((v) => v[`temperature_${area.id}`])

    stats.push({
      name: area.name,
      min: min(array),
      max: max(array),
      mean: mean(array),
    })
  })

  return stats
}

export const getDensityStatsInfo = (data, station) => {
  const stats = []

  const areas = AREAS_STATION_MAP[station]
  areas.forEach((area, index) => {
    const array = data.map((v) => v[`density_${area.id}`])

    stats.push({
      name: area.name,
      min: min(array),
      max: max(array),
      mean: mean(array),
    })
  })

  return stats
}
