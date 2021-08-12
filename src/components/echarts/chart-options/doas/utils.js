import { min, max, mean } from 'lodash'

export const getStatsInfo = (data) => {
  const stats = []
  const flux = data.map((v) => v.flux)

  stats.push({
    name: 'Flux (ton/day)',
    min: min(flux),
    max: max(flux),
    mean: mean(flux),
  })

  return stats
}
