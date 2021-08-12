/**
 * Create grid from array list specified by number of columns.
 *
 * For example, you want to create a grid with 3 columns from array with 5
 * items. By using this specification, the first row would be filled with the
 * first 3 items. Then, the second row would be filled with the remaining items.
 *
 * @param {Array} array Input array.
 * @param {Number} ncol Number of columns.
 */
export const gridFromListByColumn = (array, ncol) => {
  return array.reduce((acc, n, i) => {
    i % ncol ? acc[acc.length - 1].push(n) : acc.push([n])
    return acc
  }, [])
}
