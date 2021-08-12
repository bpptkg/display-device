import { NO_DATA_NOTATION } from '@/constants/stats'
import moment from 'moment'
import '@/lib/moment-duration-format'
import { POS } from '@/constants/stations'

export function getImagesFromAttachments(attachments) {
  return attachments.map((v) => {
    return {
      src: v.path,
    }
  })
}

export function valueFormatter(value) {
  return value || NO_DATA_NOTATION
}

export function distanceFormatter(value, { unit = 'm', precision = 2 } = {}) {
  if (Number.isFinite(value)) {
    switch (unit) {
      case 'cm':
        return `${(value * 100).toFixed(precision)} cm`
      case 'm':
        return `${value.toFixed(precision)} m`
      case 'km':
        return `${(value / 1000).toFixed(precision)} km`
      default:
        return value.toFixed(precision)
    }
  } else {
    return NO_DATA_NOTATION
  }
}

/**
 * Calculate time parts from duration in seconds. Output will be an object with
 * `days`, `hours`, `minutes`, and `seconds` attributes.
 */
export function calculateTimeParts(value) {
  const duration = moment.duration(value, 'seconds')

  const days = Math.floor(duration.asDays())
  duration.subtract(moment.duration(days, 'days'))

  const hours = duration.hours()
  duration.subtract(moment.duration(hours, 'hours'))

  const minutes = duration.minutes()
  duration.subtract(moment.duration(minutes, 'minutes'))

  const seconds = duration.seconds()

  return {
    days,
    hours,
    minutes,
    seconds,
  }
}

/**
 * Simple formatter function to format duration.
 */
export function durationFormatter(value, { locale = 'id' } = {}) {
  if (!value) return NO_DATA_NOTATION

  if (locale === 'id') {
    const template = []
    const timepart = calculateTimeParts(value)
    if (timepart.days) {
      template.push(`${timepart.days} hari`)
    }
    if (timepart.hours) {
      template.push(`${timepart.hours} jam`)
    }
    if (timepart.minutes) {
      template.push(`${timepart.minutes} menit`)
    }
    if (timepart.seconds) {
      template.push(`${timepart.seconds} detik`)
    }
    return template.join(' ')
  } else {
    const duration = moment.duration(value, 'seconds')
    return duration.format('d [days] h [hours] m [minutes] s [seconds]')
  }
}

export function columnColorFormatter(value) {
  switch (value) {
    case '0':
      return 'Putih'
    case '1':
      return 'Abu-Abu'
    case '2':
      return 'Hitam'
    default:
      return NO_DATA_NOTATION
  }
}

export function windDirectionFormatter(value) {
  switch (value) {
    case null:
    case undefined:
      return NO_DATA_NOTATION
    case '0':
      return 'Tidak Teramati'
    case 'UTARA':
      return 'Utara'
    case 'TIMUR_LAUT':
      return 'Timur Laut'
    case 'TIMUR':
      return 'Timur'
    case 'TENGGARA':
      return 'Tenggara'
    case 'SELATAN':
      return 'Selatan'
    case 'BARAT_DAYA':
      return 'Barat Daya'
    case 'BARAT':
      return 'Barat'
    case 'BARAT_LAUT':
      return 'Barat Laut'
    default:
      return value
  }
}

export function directionFormatter(value) {
  const caseValue = value ? value.toUpperCase() : value

  switch (caseValue) {
    case null:
    case undefined:
      return NO_DATA_NOTATION
    case '0':
      return 'Tidak Teramati'
    case 'UTARA':
      return 'Utara'
    case 'TIMUR_LAUT':
    case 'TIMUR LAUT':
      return 'Timur Laut'
    case 'TIMUR':
      return 'Timur'
    case 'TENGGARA':
      return 'Tenggara'
    case 'SELATAN':
      return 'Selatan'
    case 'BARAT_DAYA':
    case 'BARAT DAYA':
      return 'Barat Daya'
    case 'BARAT':
      return 'Barat'
    case 'BARAT_LAUT':
    case 'BARAT LAUT':
      return 'Barat Laut'
    default:
      return value
  }
}

export function calculateDurationFromTime(first, second) {
  if (!first || !second) return null

  const date1 = first.split(':')
  if (date1.length < 2) return null
  const date2 = second.split(':')
  if (date2.length < 2) return null

  const DATE_REF = '1970-01-01'
  const value1 = `${DATE_REF} ${date1[0]}:${date1[1]}:00`
  const value2 = `${DATE_REF} ${date2[0]}:${date2[1]}:00`
  return moment.duration(moment(value2).diff(moment(value1))).asSeconds()
}

export function rainfallFormatter(value) {
  return `${value} mm`
}

export function stationFormatter(id) {
  const value = POS.find((pos) => pos.id === id)
  return value ? value.name : NO_DATA_NOTATION
}

export const timeConcat = (dateString, timeString) => {
  const date = moment(dateString)
  const time = moment(timeString, 'HH:mm')

  date.set({
    hour: time.get('hour'),
    minute: time.get('minute'),
    second: 0,
  })

  return date
}

/**
 * Combines all events from all observatory stations with additional fields.
 *
 * @param {Array} reports Array of report obtained from cendana daily report
 * API.
 * @param {String} eventField Field name, for example `event_avalanches`,
 * `event_lavas`.
 */
export function eventListReducer(reports, eventField, timeKey) {
  return reports
    .reduce((acc, report) => {
      const list = eventField in report ? report[eventField] : []
      const events = [...list].map((event) => {
        return {
          ...event,
          station_id: report.station_id,
          report_date: report.report_date,
        }
      })

      acc.push(events)

      return acc
    }, [])
    .flat(1)
    .sort((a, b) => {
      const first = timeConcat(a.report_date, a[timeKey])
      const second = timeConcat(b.report_date, b[timeKey])

      return first < second ? 1 : first > second ? -1 : 0
    })
}
