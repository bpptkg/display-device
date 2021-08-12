export const SizeTypes = Object.freeze({
  CURRENT_WIDTH: 'currentWidth',
  CURRENT_HEIGHT: 'currentHeight',
  CUSTOM: 'custom',
})

// Minimum and maximum allowed exported image width and height in pixel.
export const MIN_ALLOWED_VALUE = 0
export const MAX_ALLOWED_VALUE = 5000

export function isValid(value) {
  if (typeof value !== 'number') return false
  return value > MIN_ALLOWED_VALUE && value <= MAX_ALLOWED_VALUE
}
