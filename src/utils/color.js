import colormap from 'colormap'

/**
 * Convert hex color to rgb array
 *
 * @param hex string
 * @returns array|null
 */
export const hexToRgb = (hex) => {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  const fullHex = hex.replace(
    shorthandRegex,
    (_m, r, g, b) => r + r + g + g + b + b
  )

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex)
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : null
}

export const textColorForBackground = (backgroundColor) => {
  const [r, g, b] = hexToRgb(backgroundColor)

  if (r + g + b > 500) {
    return '#333333'
  }
  return '#FFFFFF'
}

/**
 * Test if hex color is valid.
 *
 * @param {String} hex Hex color.
 * @returns {Boolean}
 */
export const isHexColorValid = (hex) => {
  if (!hex) return false

  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i
  const fullHex = hex.replace(
    shorthandRegex,
    (_m, r, g, b) => r + r + g + g + b + b
  )

  return /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.test(fullHex)
}

export const SUPPORTED_COLORMAP = [
  'jet',
  'hsv',
  'hot',
  'cool',
  'spring',
  'summer',
  'autumn',
  'winter',
  'bone',
  'copper',
  'greys',
  'YIGnBu',
  'greens',
  'YIOrRd',
  'bluered',
  'RdBu',
  'picnic',
  'rainbow',
  'portland',
  'blackbody',
  'earth',
  'electric',
  'viridis',
  'inferno',
  'magma',
  'plasma',
  'warm',
  'cool',
  'rainbow-soft',
  'bathymetry',
  'cdom',
  'chlorophyll',
  'density',
  'freesurface-blue',
  'freesurface-red',
  'oxygen',
  'par',
  'phase',
  'salinity',
  'temperature',
  'turbidity',
  'velocity-blue',
  'velocity-green',
  'cubehelix',
]

/**
 * Generate colors array from colormap name.
 *
 * @param {String} name Colormap name.
 * @param {Object} options Colormap spec options. Options can be one of the
 * following:
 * - nshades {Number} Number of colors in returned array. Default to 32.
 * - format {String} `'hex'` for `#aabbcc`, `'rgbaString'` for `rgba(255, 255,
 *   255, 1)`, `'rba'` for `[255, 255, 255, 1]`, `'float'` for `[1, 1, 1, 1]`.
 * - alpha {Number|Array} Alpha range, can be an array with alpha values or just
 *   2 values for start/end colors.
 * @returns {Array} Colormap array.
 */
export const generateColormap = (
  name,
  { nshades = 32, format = 'hex', alpha = 1 } = {}
) => {
  return colormap({
    colormap: name,
    nshades,
    format,
    alpha,
  })
}
