import { numberFormatterFactory } from '@/utils/formatter-factory'

export default [
  {
    key: 'name',
    label: 'Name',
  },
  {
    key: 'min',
    label: 'Min',
    formatter: numberFormatterFactory(0),
  },
  {
    key: 'max',
    label: 'Max',
    formatter: numberFormatterFactory(0),
  },
  {
    key: 'mean',
    label: 'Mean',
    formatter: numberFormatterFactory(0),
  },
]
