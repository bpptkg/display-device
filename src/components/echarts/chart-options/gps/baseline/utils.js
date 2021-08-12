import { min, max, mean, sum } from 'lodash'
import { gpsLabels } from '@/constants/gps'
import { getSeriesByIndex } from '@/utils/series'

export const getStatsInfo = (data, references) => {
  const stats = []

  references.forEach((name, index) => {
    const array = getSeriesByIndex(data, index).map((v) => v.baseline)

    stats.push({
      station: gpsLabels[name],
      min: min(array),
      max: max(array),
      mean: mean(array),
      sum: sum(array),
    })
  })
  return stats
}
