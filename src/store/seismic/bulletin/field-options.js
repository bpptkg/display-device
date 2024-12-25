import { isNull } from 'lodash'
import moment from 'moment'
import formatter from '../../../components/observation/mixins/formatter'

const fieldOptions = [
  {
    key: 'actions',
    label: '',
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
    key: 'eventtype',
    label: 'Event Type',
    sortable: true,
  },
  {
    key: 'amplitude',
    label: 'Amplitude (mm)',
    sortable: true,
    formatter: (v) => {
      const value =
        typeof v === 'string' && v !== null
          ? parseFloat(v.replace(/[^0-9.]/g, ''))
          : NaN
      if (isFinite(value)) {
        return value.toFixed(2)
      }
      return 0
    },
  },
  {
    key: 'magnitude',
    label: 'Magnitude',
    sortable: true,
    formatter: (v) => {
      return isFinite(v) ? v.toFixed(2) : 0
    },
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
