import moment from 'moment'
import { DATETIME_FORMAT } from '@/constants/date'

const fieldOptions = [
  {
    key: 'eventid',
    label: 'Event ID',
    sortable: true,
  },
  {
    key: 'eventdate',
    label: 'Event Date',
    sortable: true,
    formatter: (v) => {
      return moment(v).format(DATETIME_FORMAT)
    },
  },
  {
    key: 'eventtype',
    label: 'Event Type',
    sortable: true,
  },
  {
    key: 'duration',
    label: 'Duration (s)',
    sortable: true,
  },
  {
    key: 'amplitude',
    label: 'Amplitude',
  },
  {
    key: 'seiscomp_magnitude',
    label: 'SeisComP Magnitude',
    sortable: true,
  },
  {
    key: 'magnitude',
    label: 'Magnitude',
    sortable: true,
  },
  {
    key: 'longitude',
    label: 'Longitude (\u00B0)',
    sortable: true,
  },
  {
    key: 'latitude',
    label: 'Latitude (\u00B0)',
    sortable: true,
  },
  {
    key: 'depth',
    label: 'Depth (km)',
    sortable: true,
  },
  {
    key: 'location_mode',
    label: 'Location Mode',
    sortable: true,
  },
  {
    key: 'location_type',
    label: 'Location Type',
    sortable: true,
  },
  {
    key: 'seiscompid',
    label: 'SeisComP ID',
  },
]

const interceptor = (options) => {
  return options.map((v) => {
    return {
      ...v,
      class: 'text-nowrap',
    }
  })
}

export default interceptor(fieldOptions)
