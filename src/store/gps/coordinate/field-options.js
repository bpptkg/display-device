import { FIELDS } from '@/constants/gps'
import { capitalize } from '@/utils/common'
import { numberFormatterFactory } from '@/utils/formatter-factory'

export default [
  {
    key: 'feature',
    label: 'Name',
    formatter: capitalize,
  },
  {
    key: FIELDS.east,
    label: 'Easting',
    formatter: numberFormatterFactory(),
  },
  {
    key: FIELDS.north,
    label: 'Northing',
    formatter: numberFormatterFactory(),
  },
  {
    key: FIELDS.up,
    label: 'Elevation',
    formatter: numberFormatterFactory(),
  },
]
