import { numberFormatterFactory } from '@/utils/formatter-factory'

const COUNT_FIELDS = ['count_ROCKFALL', 'count_AWANPANAS', 'count']

export default [
  {
    key: 'name',
    label: 'Name',
  },
  {
    key: 'sum',
    label: 'Sum',
    formatter: (v, _, row) => {
      return COUNT_FIELDS.includes(row.field)
        ? numberFormatterFactory(0)(v)
        : numberFormatterFactory(2)(v)
    },
  },
  {
    key: 'min',
    label: 'Min',
    formatter: (v, _, row) => {
      return COUNT_FIELDS.includes(row.field)
        ? numberFormatterFactory(0)(v)
        : numberFormatterFactory(2)(v)
    },
  },
  {
    key: 'max',
    label: 'Max',
    formatter: (v, _, row) => {
      return COUNT_FIELDS.includes(row.field)
        ? numberFormatterFactory(0)(v)
        : numberFormatterFactory(2)(v)
    },
  },
  {
    key: 'mean',
    label: 'Mean',
    formatter: numberFormatterFactory(2),
  },
]
