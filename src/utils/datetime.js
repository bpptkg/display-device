import moment from 'moment'
import { isString, isNumber } from 'lodash'
import { DateRangeTypes, DATETIME_FORMAT } from '../constants/date'
import '@/lib/moment-duration-format'

export function calculatePeriod({ type, count, start, end }) {
  let duration
  switch (type) {
    case DateRangeTypes.SECOND:
      duration = 'seconds'
      break
    case DateRangeTypes.MINUTE:
      duration = 'minutes'
      break
    case DateRangeTypes.HOUR:
      duration = 'hours'
      break
    case DateRangeTypes.DAY:
      duration = 'days'
      break
    case DateRangeTypes.MONTH:
      duration = 'months'
      break
    case DateRangeTypes.YEAR:
      duration = 'years'
      break
    default:
      duration = DateRangeTypes.CUSTOM
  }
  if (duration === DateRangeTypes.CUSTOM) {
    if (!start)
      throw new Error('Start time is required if using custom duration.')
    if (!end) throw new Error('End time is required if using custom duration.')

    return {
      startTime: moment(start),
      endTime: moment(end),
    }
  } else {
    if (!count)
      throw new Error('Count is required if not using custom duration.')

    const endTime = moment()
    const startTime = endTime.clone().subtract(count, duration)
    return {
      startTime,
      endTime,
    }
  }
}

export const createPeriodText = (startTime, endTime) => {
  let start = ''
  let end = ''

  if (typeof startTime === 'object') {
    start = startTime.format(DATETIME_FORMAT)
  } else if (typeof startTime === 'string') {
    start = startTime
  } else {
    start = startTime.toString()
  }

  if (typeof endTime === 'object') {
    end = endTime.format(DATETIME_FORMAT)
  } else if (typeof endTime === 'string') {
    end = endTime
  } else {
    end = endTime.toString()
  }

  return `${start} - ${end}`
}

/**
 * Format date using moment formatting. Date type can be a string, unix
 * timestamp number, or moment object.
 *
 * @param {String|Number|Object} date
 * @param {String} format
 * @returns {String}
 */
export const formatDate = (date, format = 'MMM, D YYYY h:mma ZZ') => {
  if (isString(date) | isNumber(date)) {
    return moment(date).format(format)
  } else {
    return date.format(format)
  }
}

/**
 * Helper function to format Moment duration.
 *
 * Note that this function requires Moment.js plugins in
 * @/lib/moment-duration-format. So you have to import it first.
 *
 * @param {Object} duration Moment duration object.
 * @returns {String} Moment duration formatted string.
 */
export function humanizeDuration(duration) {
  if (duration.asDays() > 0) {
    return duration.format('d [days] h [hours] m [minutes]')
  } else if (duration.asHours() > 0) {
    return duration.format('h [hours] m [minutes]')
  } else {
    return duration.format('m [minutes]')
  }
}
