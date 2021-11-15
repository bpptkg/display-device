import { min, max, mean } from 'lodash'
import { BANDS } from './index'

// TODO(indra): Refactor this function to efficiently calculate stats info.
export const getStatsInfo = (data) => {
  const stats = []

  BANDS.forEach((band) => {
    const series = data.map((v) => v[band.name])

    stats.push({
      band: `Band ${band.band}`,
      min: min(series),
      max: max(series),
      mean: mean(series),
    })
  })

  return stats
}
