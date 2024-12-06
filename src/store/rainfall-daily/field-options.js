import { numberFormatterFactory } from '@/utils/formatter-factory'

export default [
  {
    key: 'station',
    label: 'Station',
  },
  {
    key: 'min',
    label: 'Min',
    formatter: numberFormatterFactory(2),
  },
  {
    key: 'max',
    label: 'Max',
    formatter: numberFormatterFactory(2),
  },
  {
    key: 'mean',
    label: 'Mean',
    formatter: numberFormatterFactory(2),
  },
]
