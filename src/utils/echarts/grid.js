import { makeIndex } from '../series'

/**
 * Create ECharts row grid specs. Options can also be set to control grid,
 * including container `margin`, grid `top`, `right`, `bottom`, and `left`.
 *
 * @param {Number} nrows
 * @param {Object} options
 * @returns {Object}
 */
export const createRowGrid = (
  nrows,
  { margin = 2, top = 5, right = 10, bottom = 5, left = 10 } = {}
) => {
  const availableSpace = 100 - (top + bottom)
  const containerSize = (availableSpace - (nrows - 1) * margin) / nrows
  const indices = makeIndex(nrows)

  return indices.map((index) => {
    const topOffset = index * (containerSize + margin) + top
    const height = containerSize - margin

    return {
      top: `${topOffset}%`,
      height: `${height}%`,
      left: `${left}%`,
      right: `${right}%`,
    }
  })
}

/**
 * Create ECharts row grid specs using pixel unit. Options can be set to control
 * grid, including container `margin`, grid `top`, `right`, `bottom`, and
 * `left`.
 *
 * @param {Number} nrows Number of subplots.
 * @param {Number} height Chart height in pixel.
 * @param {Object} options Optional grid specs options.
 * @returns {Object} ECharts grid specs.
 */
export const createSubplotGrid = (
  nrows,
  height,
  { margin = 10, top = 15, right = 15, bottom = 15, left = 15 } = {}
) => {
  const availableHeight = height - (top + bottom)
  const containerSize = (availableHeight - (nrows - 1) * margin) / nrows
  const indices = makeIndex(nrows)

  return indices.map((index) => {
    const topOffset = index * (containerSize + margin) + top
    const height = containerSize - margin

    return {
      top: topOffset,
      height,
      left,
      right,
    }
  })
}
