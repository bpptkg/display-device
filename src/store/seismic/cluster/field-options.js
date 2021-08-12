import { numberFormatterFactory } from '@/utils/formatter-factory'

export default [
  {
    key: 'cluster',
    label: 'Cluster',
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
    label: 'Mean (N/day)',
    formatter: numberFormatterFactory(2),
  },
]
