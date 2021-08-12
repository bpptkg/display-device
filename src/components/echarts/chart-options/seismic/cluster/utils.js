import { min, max, sum } from 'lodash'
import { SamplingTypes } from '@/constants/seismicity'

export const getStatsInfo = (clusterGroup, duration, sampling) => {
  const stats = []

  let durationBySample = null
  if (sampling === SamplingTypes.HOUR) {
    // Duration is in seconds, so we need to convert to hours first.
    durationBySample = duration ? duration / (60 * 60) : null
  } else {
    // Duration is in seconds, so we need to convert to days first.
    durationBySample = duration ? duration / (24 * 60 * 60) : null
  }

  clusterGroup.forEach((group, index) => {
    const count = group.data.map((v) => v.count)

    stats.push({
      cluster: group.cluster,
      min: min(count) || 0,
      max: max(count) || 0,
      mean: durationBySample ? sum(count) / durationBySample : undefined,
      sum: sum(count),
    })
  })
  return stats
}
