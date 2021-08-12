import { min, max, sum } from 'lodash'
import eventTypes from './event-types'
import { getSeriesByIndex } from '@/utils/series'
import { SamplingTypes } from '@/constants/seismicity'

export const getStatsInfo = (data, duration, sampling) => {
  const stats = []

  let durationBySample = null
  if (sampling === SamplingTypes.HOUR) {
    // Duration is in seconds, so we need to convert to hours first.
    durationBySample = duration ? duration / (60 * 60) : null
  } else {
    // Duration is in seconds, so we need to convert to days first.
    durationBySample = duration ? duration / (24 * 60 * 60) : null
  }

  eventTypes.forEach((event, index) => {
    const count = getSeriesByIndex(data, index).map((v) => v.count)

    stats.push({
      event: event.type,
      min: min(count) || 0,
      max: max(count) || 0,
      mean: durationBySample ? sum(count) / durationBySample : undefined,
      sum: sum(count),
    })
  })
  return stats
}
