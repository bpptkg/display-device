/**
 * Patch RfapEnergy chart option to match the grid spec of SeismicEnergy chart.
 * This used to align the left and right y axis to match both chart layouts. To
 * reset to default, simply omit the function or set enable to false in the
 * function option.
 */
export const patchRfapEnergyGrid = (option, { enable = true } = {}) => {
  return enable
    ? {
        ...option,
        baseOption: {
          ...option.baseOption,
          grid: {
            ...option.baseOption.grid,
            // Grid value from SeismicEnergy chart option.
            left: 80,
            right: 190,
            bottom: 70,
          },
        },
      }
    : option
}

/**
 * Patch media query maxWidth to use 768px instead of default one that provided
 * by each data type function factory. To reset to default, you can simply,
 * remove the function or set enable option to false.
 */
export const patchMediaQueryMaxWidth = (
  option,
  { enable = true, maxWidth = 768 }
) => {
  const patchMaxWidth = (mediaQuery) => {
    return {
      ...mediaQuery,
      query: {
        ...mediaQuery.query,
        maxWidth,
      },
    }
  }
  return enable
    ? {
        ...option,
        media: option.media.map((query) => patchMaxWidth(query)),
      }
    : option
}
