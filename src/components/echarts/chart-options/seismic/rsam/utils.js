import { min, max, mean } from 'lodash'
import { BANDS } from './index'

// TODO(indra): Refactor this function to efficiently calculate stats info.
export const getStatsInfo = (data) => {
  const stats = []

  BANDS.forEach((band) => {
    const series = data.map((v) => v[band.name])
    const trueMaxValue = max(series)
    const normalMaxValue = trueMaxValue > 0 ? trueMaxValue : 1

    stats.push({
      band: `Band ${band.band}`,
      min: min(series) / normalMaxValue,
      max: max(series) / normalMaxValue,
      mean: mean(series) / normalMaxValue,
    })
  })

  return stats
}
