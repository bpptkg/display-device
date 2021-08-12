import moment from 'moment'
import { isNull } from 'lodash'

const fieldOptions = [
  {
    key: 'actions',
    label: '',
  },
  {
    key: 'eventid',
    label: 'Event ID',
    sortable: true,
  },
  {
    key: 'eventdate',
    label: 'Event Date',
    sortable: true,
    formatter: (value, key, item) => {
      if (!value) return '-'

      const dateString = `${value}.${item.eventdate_microsecond || '00'}`
      const dateFormat = 'YYYY-MM-DD HH:mm:ss.SS'
      return moment(dateString).format(dateFormat)
    },
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
    key: 'eventtype',
    label: 'Event Type',
    sortable: true,
  },
  {
    key: 'cluster',
    label: 'Cluster',
    sortable: true,
    formatter: (v) => {
      if (isNull(v)) {
        return -1
      } else {
        return v
      }
    },
  },
  {
    key: 'clusterEvent',
    label: 'Cluster Event',
    sortable: true,
  },
  {
    key: 'seiscompid',
    label: 'SeisComP ID',
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
