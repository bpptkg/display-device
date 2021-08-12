import { numberFormatterFactory } from '@/utils/formatter-factory'

export default [
  {
    key: 'benchmark',
    label: 'Benchmark',
  },
  {
    key: 'reflector',
    label: 'Reflector',
  },
  {
    key: 'min',
    label: 'Min',
    formatter: numberFormatterFactory(3),
  },
  {
    key: 'max',
    label: 'Max',
    formatter: numberFormatterFactory(3),
  },
  {
    key: 'mean',
    label: 'Mean',
    formatter: numberFormatterFactory(3),
  },
]
