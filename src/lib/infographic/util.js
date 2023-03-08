export function toPlain(obj) {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * Convert object to JSON string.
 */
export function objectStringify(obj) {
  return JSON.stringify(obj)
}

/**
 * Convert JSON string into an object.
 */
export function objectParse(obj) {
  return JSON.parse(obj)
}
