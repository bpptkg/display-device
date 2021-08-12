/**
 * Convert Hex color to RGB array
 *
 * @param {String} hex Hex color.
 * @returns {Array|null} Array of RGB color or null.
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

/**
 * Conver RGB color to hex.
 *
 * @param {Number} r Red color number.
 * @param {Number} g Green color number.
 * @param {Number} b Blue color number.
 * @returns {String} Hex color.
 */
export const rgbToHex = (r, g, b) => {
  const toHex = (c) => {
    const hex = c.toString(16)
    return hex.length === 1 ? '0' + hex : hex
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}
