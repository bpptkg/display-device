import { min, max, mean } from 'lodash'
import { getSeriesByIndex } from '@/utils/series'

export const getStatsInfo = (data, edmOptions) => {
  const stats = []

  edmOptions.forEach((edm, index) => {
    const array = getSeriesByIndex(data, index).map((v) => v.slope_distance)

    stats.push({
      benchmark: edm.benchmark,
      reflector: edm.reflector,
      min: min(array),
      max: max(array),
      mean: mean(array),
    })
  })

  return stats
}
