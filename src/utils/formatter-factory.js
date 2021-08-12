import { isFinite as finite } from 'lodash'
import { NO_DATA_NOTATION } from '@/constants/stats'

export const numberFormatterFactory = (digits = 3) => {
  return (v) => (finite(v) ? v.toFixed(digits) : NO_DATA_NOTATION)
}
