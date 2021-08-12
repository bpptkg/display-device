import moment from 'moment'

export const PeriodTypes = {
  /**
   * Seconds.
   */
  SECOND: 'second',
  SECONDS: 'seconds',
  /**
   * Minutes.
   */
  MINUTE: 'minute',
  MINUTES: 'minutes',
  /**
   * Hours.
   */
  HOUR: 'hour',
  HOURS: 'hours',
  /**
   * Days.
   */
  DAY: 'day',
  DAYS: 'days',
  /**
   * Months.
   */
  MONTH: 'month',
  MONTHS: 'months',
  /**
   * Years.
   */
  YEAR: 'year',
  YEARS: 'years',
  /**
   * Custom or absolute.
   */
  CUSTOM: 'custom',
  ABSOLUTE: 'absolute',
}

export const parseDate = (value) => {
  if (typeof value === 'object') {
    return value
  } else {
    return moment(value)
  }
}

export const calculatePeriod = ({ type, count, start, end }) => {
  let duration
  switch (type) {
    case PeriodTypes.SECOND:
    case PeriodTypes.SECONDS:
      duration = 'seconds'
      break

    case PeriodTypes.MINUTE:
    case PeriodTypes.MINUTES:
      duration = 'minutes'
      break

    case PeriodTypes.HOUR:
    case PeriodTypes.HOURS:
      duration = 'hours'
      break

    case PeriodTypes.DAY:
    case PeriodTypes.DAYS:
      duration = 'days'
      break

    case PeriodTypes.MONTH:
    case PeriodTypes.MONTHS:
      duration = 'months'
      break

    case PeriodTypes.YEAR:
    case PeriodTypes.YEARS:
      duration = 'years'
      break

    case PeriodTypes.ABSOLUTE:
    case PeriodTypes.CUSTOM:
      duration = PeriodTypes.CUSTOM
      break

    default:
      duration = PeriodTypes.CUSTOM
  }
  if (duration === PeriodTypes.CUSTOM) {
    if (!start)
      throw new Error('Start time is required if using custom duration.')
    if (!end) throw new Error('End time is required if using custom duration.')

    return {
      startTime: parseDate(start),
      endTime: parseDate(end),
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

/**
 * A period object. It represent a time range duration between two dates.
 *
 * Creating an instance can be made by providing required `type` argument. If
 * `type` is relative period, `count` value is default to 1. If `type` is
 * `custom` or `absolute` period, you have to provide `startTime` and `endTime`
 * values and count would be optional. Both can be moment object, Unix
 * timestamp, or date string.
 *
 * Example:
 *
 * - `Period({count: 1, type: 'month'})`
 * - `Period({count: 2, type: 'days'})`
 * - `Period({type: 'custom', startTime: '2020-01-01', endTime: '2020-03-01'})`
 */
export default class Period {
  constructor({
    type,
    count = 1,
    startTime = undefined,
    endTime = undefined,
  } = {}) {
    this.count = count

    if (this._isAbsolute(type)) {
      this._checkTimeEdges(type, startTime, endTime)
      this.startTime = startTime
      this.endTime = endTime
    }
    this.type = type
  }

  _isAbsolute(type) {
    return (
      type.toLowerCase() === PeriodTypes.CUSTOM ||
      type.toLowerCase() === PeriodTypes.ABSOLUTE
    )
  }

  _checkTimeEdges(type, startTime, endTime) {
    if (!startTime) throw new Error(`startTime is required if type is ${type}`)
    if (!endTime) throw new Error(`endTime is required if type is ${type}`)
  }

  getCount() {
    return this.count
  }

  getType() {
    return this.type
  }

  setCount(count) {
    this.count = count
  }

  setType(type, { startTime = undefined, endTime = undefined } = {}) {
    if (this._isAbsolute(type)) {
      this._checkTimeEdges(type, startTime, endTime)
      this.startTime = startTime
      this.endTime = endTime
    }
    this.type = type
  }

  /**
   * Check if current period is relative type. Relative period means that the
   * value of start and end time change as current time change.
   *
   * For example, if we have 1 month period and current date is 2020-10-30, then
   * the value of start and end time would be 2020-09-01 and 2020-10-30
   * respectively. As current time change, for example to 2020-11-01, start and
   * end time would be 2020-09-02 and 2020-11-01 respectively.
   */
  isRelative() {
    return !this.isAbsolute()
  }

  /**
   * Check if current period is absolute type. Absolute period means the value
   * of start and end time don't change all the time.
   */
  isAbsolute() {
    return this._isAbsolute(this.type)
  }

  /**
   * Get period values of startTime and endTime as moment object.
   *
   * @returns {Object} Period object.
   */
  getPeriod() {
    const { startTime, endTime } = calculatePeriod({
      type: this.type,
      count: this.count,
      start: this.startTime,
      end: this.endTime,
    })

    return {
      type: this.type,
      count: this.count,
      startTime: startTime,
      endTime: endTime,
      isRelative: this.isRelative(),
      isAbsolute: this.isAbsolute(),
    }
  }

  /**
   * Get period values of startTime and endTime as JavaScript date object.
   *
   * @returns {Object} Period object.
   */
  getPeriodAsDate() {
    const period = this.getPeriod()

    return {
      ...period,
      startTime: period.startTime.toDate(),
      endTime: period.endTime.toDate(),
    }
  }

  /**
   * Get period values as text. For example 1 month, 3 months. It provides
   * better representation than concatenating count and type fields.
   */
  getPeriodText() {
    const { startTime, endTime } = this.getPeriod()
    return moment.duration(startTime.diff(endTime)).humanize()
  }

  /**
   * Get duration value as moment duration object.
   *
   * @returns {Object} Moment duration.
   */
  getDuration() {
    const { startTime, endTime } = this.getPeriod()
    return moment.duration(startTime.diff(endTime))
  }

  /**
   * Get start time of this period as moment object.
   */
  getStartTime() {
    const { startTime } = this.getPeriod()
    return startTime
  }

  /**
   * Get end time of this period as moment object.
   */
  getEndTime() {
    const { endTime } = this.getPeriod()
    return endTime
  }

  /**
   * Get string representation of current period.
   */
  toString() {
    if (this.isAbsolute()) {
      return this.getPeriodText()
    }
    const isPlural = this.count > 1
    return `${this.count} ${this.type}${isPlural ? 's' : ''}`
  }
}
