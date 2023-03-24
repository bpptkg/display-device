import { isNull } from 'lodash'
import moment from 'moment'
import { DATETIME_FORMAT } from '@/constants/date'
import { fromLatLon } from '@/lib/geo/utm'
import { ZONE_NUMBER } from '@/constants/seismicity'
import { numberFormatterFactory } from '@/utils/formatter-factory'

const numberFormatter = numberFormatterFactory(2)

export default {
  eventid: {
    label: 'Event ID',
  },
  eventdate: {
    label: 'Event Date',
    formatter: (value, key, item) => {
      if (!value) return '-'

      const dateString = `${value}.${item.eventdate_microsecond || '00'}`
      const dateFormat = 'YYYY-MM-DD HH:mm:ss.SS'
      return moment(dateString).format(dateFormat)
    },
  },
  eventdateutc: {
    label: 'Event Date (UTC)',
    useField: 'eventdate',
    formatter: (value, key, item) => {
      if (!value) return '-'

      const dateFormat = 'YYYY-MM-DD HH:mm:ss.SS'
      const dateString = `${value}.${item.eventdate_microsecond || '00'}`
      return moment.utc(moment(dateString)).format(dateFormat)
    },
  },
  duration: {
    label: 'Duration (s)',
    formatter: numberFormatter,
  },
  amplitude: {
    label: 'Amplitude',
  },
  magnitude: {
    label: 'SeisComP Magnitude',
    formatter: numberFormatter,
  },
  easting: {
    label: 'Easting (m)',
    formatter: (_, { latitude, longitude }) => {
      if (!latitude || !longitude) return ''
      const utm = fromLatLon(latitude, longitude, ZONE_NUMBER)
      return numberFormatter(utm.easting.toFixed(2))
    },
  },
  northing: {
    label: 'Northing (m)',
    formatter: (_, { latitude, longitude }) => {
      if (!latitude || !longitude) return ''
      const utm = fromLatLon(latitude, longitude, ZONE_NUMBER)
      return numberFormatter(utm.northing.toFixed(2))
    },
  },
  longitude: {
    label: 'Longitude (\u00B0)',
    formatter: numberFormatter,
  },
  latitude: {
    label: 'Latitude (\u00B0)',
    formatter: numberFormatter,
  },
  depth: {
    label: 'Depth (km)',
    formatter: numberFormatter,
  },
  elevation: {
    label: 'Elevation (m)',
    useField: 'depth',
    formatter: (item) => {
      if (!item) return ''
      return item * -1000
    },
  },
  eventtype: {
    label: 'Event Type',
  },
  cluster: {
    label: 'Cluster',
    formatter: (v) => {
      if (isNull(v)) {
        return '-1 (Clustering has not been done yet)'
      } else {
        return v
      }
    },
  },
  clusterEvent: {
    label: 'Cluster Event',
  },
  corr_coef: {
    label: 'Corr. Coef.',
  },
  seiscompid: {
    label: 'SeisComP ID',
  },
  ml_deles: {
    label: 'ML Deles',
    formatter: numberFormatter,
  },
  ml_labuhan: {
    label: 'ML Labuhan',
    formatter: numberFormatter,
  },
  ml_pasarbubar: {
    label: 'ML Pasarbubar',
    formatter: numberFormatter,
  },
  ml_pusunglondon: {
    label: 'ML Pusunglondon',
    formatter: numberFormatter,
  },
  location_mode: {
    label: 'Location Mode',
  },
  location_type: {
    label: 'Location Type',
  },
  validated: {
    label: 'Validated',
  },
  projection: {
    label: 'Projection',
  },
  operator: {
    label: 'Operator',
  },
  last_modified: {
    label: 'Last Modified',
    formatter: (v) => {
      return moment(v).format(DATETIME_FORMAT)
    },
  },
  seiscomp: {
    label: 'Standard Error',
    formatter: (v) => {
      return v ? v.EventParameters.origin.quality.standardError : '-'
    },
  },
  btbbLon: {
    label: 'Btbb Longitude (\u00B0)',
    useField: 'btbb',
    formatter: (v) => (v ? v.lon : '-'),
  },
  btbbLat: {
    label: 'Btbb Latitude (\u00B0)',
    useField: 'btbb',
    formatter: (v) => (v ? v.lat : '-'),
  },
  btbbDepth: {
    label: 'Btbb Depth (km)',
    useField: 'btbb',
    formatter: (v) => (v ? v.z : '-'),
  },
}
