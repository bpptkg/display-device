import { min, max, mean } from 'lodash'
import { getSeriesByIndex } from '@/utils/series'

import tiltOptions from './tilt-options'

export const getStatsInfo = (data) => {
  const stats = []

  tiltOptions.forEach((tilt, index) => {
    const array = getSeriesByIndex(data, index)
    const x = array.map((v) => v.x)
    const y = array.map((v) => v.y)

    stats.push({
      type: tilt.type,
      station: tilt.station,
      label: tilt.label,
      minx: min(x),
      maxx: max(x),
      meanx: mean(x),
      miny: min(y),
      maxy: max(y),
      meany: mean(y),
    })
  })

  return stats
}
