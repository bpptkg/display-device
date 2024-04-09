import { max, mean, min } from 'lodash'
import { Areas } from './babadanarea'
import { Points } from './babadanpoint'

export const getStatsPointInfo = (data) => {
  return Points.map((point) => {
    const array = data.map((v) => v[point.field])
    return {
      name: point.name,
      min: min(array),
      max: max(array),
      mean: mean(array),
    }
  })
}

export const getStatsAreaInfo = (data) => {
  return Areas.map((area) => {
    const array = data.map((v) => v[area.field])
    return {
      name: area.name,
      min: min(array),
      max: max(array),
      mean: mean(array),
    }
  })
}
