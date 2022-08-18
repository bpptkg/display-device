import moment from 'moment'

/**
 * Humanize duration between two timestamps.
 *
 * @param {moment} startTime Start time.
 * @param {moment} endTime End time.
 * @returns {string} Duration formatted.
 */
export const humanizeDuration = (startTime, endTime) => {
  if (startTime && endTime) {
    const duration = moment.duration(endTime.diff(startTime))
    return duration.humanize()
  } else {
    return ''
  }
}
