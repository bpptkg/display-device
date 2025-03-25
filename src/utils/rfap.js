/**
 * Normalize the data to have a multiple direction and group them by direction.
 */
export const normalizeDirection = (input) => {
  const data = input.reduce((acc, v) => {
    const dirs = v.direction.split(',').map((dir) => dir.trim())
    dirs.forEach((dir) => {
      if (!acc[dir]) {
        acc[dir] = {
          ap_count: v.ap_count,
          ap_distance: v.ap_distance,
          count: v.count,
          direction: dir,
          distance: v.distance,
          rf_count: v.rf_count,
          rf_distance: v.rf_distance,
        }
      } else {
        acc[dir].ap_count += v.ap_count
        acc[dir].ap_distance = Math.max(acc[dir].ap_distance, v.ap_distance)
        acc[dir].count += v.count
        acc[dir].distance = Math.max(acc[dir].distance, v.distance)
        acc[dir].rf_count += v.rf_count
        acc[dir].rf_distance = Math.max(acc[dir].rf_distance, v.rf_distance)
      }
    })
    return acc
  }, {})
  return Object.values(data)
}
