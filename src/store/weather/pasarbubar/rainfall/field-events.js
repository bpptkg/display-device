import moment from 'moment'
import { numberFormatterFactory } from '@/utils/formatter-factory'
import { humanizeDuration } from '@/components/echarts/chart-options/weather-pasarbubar'

const dateFormatterFactory = () => {
  return (v) => moment(v).format('YYYY-MM-DD HH:mm:ss')
}

const durationFormatterFactory = () => {
  return (v) => humanizeDuration(moment.duration(v, 'seconds'))
}

export default [
  {
    key: 'start',
    label: 'Start',
    formatter: dateFormatterFactory(),
  },
  {
    key: 'end',
    label: 'End',
    formatter: dateFormatterFactory(),
  },
  {
    key: 'duration',
    label: 'Duration',
    formatter: durationFormatterFactory(),
  },
  {
    key: 'total',
    label: 'Total (mm)',
    formatter: numberFormatterFactory(2),
  },
  {
    key: 'intensity',
    label: 'Intensity (mm/h)',
    formatter: numberFormatterFactory(2),
  },
  {
    key: 'state',
    label: 'State',
    formatter: (v) => {
      return v === 0 ? 'Ended' : 'Ongoing'
    },
  },
]
