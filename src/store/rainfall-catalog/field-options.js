import moment from 'moment'
import { humanizeDuration } from '@/utils/datetime'

const fieldOptions = [
  {
    key: 'start',
    label: 'Start',
    sortable: true,
    formatter: (value) => {
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    },
  },
  {
    key: 'end',
    label: 'End',
    sortable: true,
    formatter: (value) => {
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    },
  },
  {
    key: 'duration',
    label: 'Duration',
    sortable: true,
    formatter: (value) => {
      const duration = moment.duration(value, 'seconds')
      return Number.isFinite(value) ? humanizeDuration(duration) : '-'
    },
  },
  {
    key: 'total',
    label: 'Total',
    sortable: true,
    formatter: (value) => {
      return Number.isFinite(value) ? `${value.toFixed(2)} mm` : '-'
    },
  },
  {
    key: 'intensity',
    label: 'Intensity',
    sortable: true,
    formatter: (value) => {
      return Number.isFinite(value) ? `${value.toFixed(2)} mm/h` : '-'
    },
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
