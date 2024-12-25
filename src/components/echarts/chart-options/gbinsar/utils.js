import { max, mean, min } from 'lodash'

export const getStatsPointInfo = (points, data) => {
  return points.map((point) => {
    const array = data.map((v) => v[point.field])
    return {
      name: point.name,
      min: min(array),
      max: max(array),
      mean: mean(array),
    }
  })
}

export const getStatsAreaInfo = (areas, data) => {
  return areas.map((area) => {
    const array = data.map((v) => v[area.field])
    return {
      name: area.name,
      min: min(array),
      max: max(array),
      mean: mean(array),
    }
  })
}
