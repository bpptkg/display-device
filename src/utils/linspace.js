/**
 * Make linear spacing.
 *
 * @param {Number} startValue Start value.
 * @param {Number} stopValue Stop value.
 * @param {Number} cardinality Number of items.
 */
export const linspace = (startValue, stopValue, cardinality) => {
  const arr = []
  const step = (stopValue - startValue) / (cardinality - 1)
  for (let i = 0; i < cardinality; i++) {
    arr.push(startValue + step * i)
  }
  return arr
}
