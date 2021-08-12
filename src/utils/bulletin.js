import moment from 'moment'
import { isArray, isObject, isString } from 'lodash'
import { DateRangeTypes } from '../constants/date'
import { BMA_URL } from './client'

export const isVolcanicEvent = (event) => {
  const volcanicEvents = 'vta,vtb'
  return (
    volcanicEvents.split(',').includes(event.eventtype) ||
    volcanicEvents.toLocaleUpperCase().split(',').includes(event.eventtype)
  )
}

export const isPlottableVolcanicEvent = (event) => {
  if (!isVolcanicEvent(event)) return false
  return (
    Number.isFinite(event.latitude) &&
    Number.isFinite(event.longitude) &&
    Number.isFinite(event.depth)
  )
}

/**
 * Create CSV content string from array of objects or object.
 *
 * If data is array of objects, header values are determined using the first
 * object keys. Otherwise, it will use keys in each item entries.
 *
 * @param {Array|Object} data
 * @returns {String}
 */
export const createCSVContent = (data) => {
  const stringifyObject = (
    obj,
    { globalKeys = null, withKeys = true } = {}
  ) => {
    const keys = globalKeys || Object.keys(obj)
    const template =
      keys
        .map((k) => {
          const v = obj[k]
          return isString(v) ? JSON.stringify(v) : v
        })
        .join(',') + '\n'

    return withKeys ? keys.join(',') + '\n' + template : template
  }

  if (isArray(data)) {
    const header = Object.keys(data[0] || {})
    return (
      header.join(',') +
      '\n' +
      data
        .map((item) =>
          stringifyObject(item, { globalKeys: header, withKeys: false })
        )
        .join('')
    )
  } else if (isObject(data)) {
    return stringifyObject(data)
  } else {
    throw new Error('Unsupported data format')
  }
}

export const createFilenameFromEventDate = (date, extension = 'csv') => {
  const ext = extension.split('.')
  return `${moment(date).format('YYYY-MM-DD_HH-mm-ss')}.${ext[ext.length - 1]}`
}

export const createShortNameFromPeriod = (period) => {
  const { type, count = undefined } = period
  switch (type) {
    case DateRangeTypes.SECOND:
      return `${count}s`
    case DateRangeTypes.MINUTE:
      return `${count}m`
    case DateRangeTypes.HOUR:
      return `${count}h`
    case DateRangeTypes.DAY:
      return `${count}d`
    case DateRangeTypes.MONTH:
      return `${count}mo`
    case DateRangeTypes.YEAR:
      return `${count}y`
    default:
      return `custom`
  }
}

export const buildClusterMediaParentLink = (eventId) => {
  const mediaURL = eventId
    .split('#')
    .map((v) => v.split('-'))
    .flat(1)
    .join('/')

  return `${BMA_URL}/cluster/${mediaURL}`
}
