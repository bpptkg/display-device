import { numberFormatterFactory } from '@/utils/formatter-factory'

export default [
  {
    key: 'station',
    label: 'Station',
  },
  {
    key: 'min',
    label: 'Min',
    formatter: numberFormatterFactory(),
  },
  {
    key: 'max',
    label: 'Max',
    formatter: numberFormatterFactory(),
  },
  {
    key: 'mean',
    label: 'Mean',
    formatter: numberFormatterFactory(),
  },
]
