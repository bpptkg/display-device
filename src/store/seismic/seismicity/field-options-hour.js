import { numberFormatterFactory } from '@/utils/formatter-factory'

export default [
  {
    key: 'event',
    label: 'Event',
  },
  {
    key: 'sum',
    label: 'Sum',
  },
  {
    key: 'min',
    label: 'Min',
  },
  {
    key: 'max',
    label: 'Max',
  },
  {
    key: 'mean',
    label: 'Mean (N/hour)',
    formatter: numberFormatterFactory(2),
  },
]
