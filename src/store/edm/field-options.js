import { isFinite as finite } from 'lodash'
import { NO_DATA_NOTATION } from '@/constants/stats'
import { numberFormatterFactory } from '@/utils/formatter-factory'

export const linregressFieldOptions = [
  {
    key: 'reflector',
    label: 'Reflector',
  },
  {
    key: 'm',
    label: 'Slope (mm/day)',
    formatter: (v) => {
      return finite(v) ? (v === 0 ? 0 : v.toFixed(4)) : NO_DATA_NOTATION
    },
  },
  {
    key: 'c',
    label: 'Intercept (m)',
    formatter: (v) => {
      // Regression info return slope as mm. So we need to convert the value
      // to m, i.e. divide it by 1000.
      return finite(v) ? (v / 1000).toFixed(4) : NO_DATA_NOTATION
    },
  },
  {
    key: 'r2',
    label: 'R\u00B2',
    formatter: numberFormatterFactory(4),
  },
]

export default [
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
