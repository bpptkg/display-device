// Tab20 color map is used because we need to differentiate the item to the
// others.
export const tab20ColorMap = [
  '#1f77b4',
  '#aec7e8',
  '#ff7f0e',
  '#ffbb78',
  '#2ca02c',
  '#98df8a',
  '#d62728',
  '#ff9896',
  '#9467bd',
  '#c5b0d5',
  '#8c564b',
  '#c49c94',
  '#e377c2',
  '#f7b6d2',
  '#7f7f7f',
  '#c7c7c7',
  '#bcbd22',
  '#dbdb8d',
  '#17becf',
  '#9edae5',
]

export const smartIndex = (index, length) => {
  const clength = tab20ColorMap.length
  if (length === clength) {
    return index
  }
  return Math.floor(index * (clength / length))
}
