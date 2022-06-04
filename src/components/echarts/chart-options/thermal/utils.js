import { min, max, mean } from 'lodash'
import { AREAS_STATION_MAP } from '@/store/thermal'
import { getSeriesByIndex } from '@/utils/series'

export const getStatsInfo = (data, station) => {
  const stats = []

  const areas = AREAS_STATION_MAP[station]
  areas.forEach((area, index) => {
    const array = getSeriesByIndex(data, index).map((v) => v.temperature)

    stats.push({
      name: area.name,
      min: min(array),
      max: max(array),
      mean: mean(array),
    })
  })

  return stats
}
