import { min, max, mean } from 'lodash'
import { getSeriesByIndex } from '../../../../utils/series'

export const getStatsInfo = (data, areas) => {
  const stats = []

  areas.forEach((area, index) => {
    const array = getSeriesByIndex(data, index).map((v) => v.temp)

    stats.push({
      name: area.name,
      min: min(array),
      max: max(array),
      mean: mean(array),
    })
  })

  return stats
}
