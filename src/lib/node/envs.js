const process = require('process')

/**
 * Read OS environment variable. If strict, raise error when value is empty or
 * undefined.
 *
 * @param {String} name
 * @param {Boolean} strict
 * @returns {String}
 */
export function readOSEnvironmentVariable(name, strict = false) {
  const value = process.env[name]
  if (strict) {
    if (typeof value === 'undefined' || !value) {
      throw new Error(`Unable to read ${name} from environment variable`)
    } else {
      return value
    }
  } else {
    return value
  }
}

/**
 * Get BMA Resource URL.
 */
export function getBMAResourceURL(name = 'MIX_BMA_URL') {
  return readOSEnvironmentVariable(name, true)
}

/**
 * Get BMA credential API key.
 */
export function getBMACredentialKey(name = 'MIX_BMA_API_KEY') {
  return readOSEnvironmentVariable(name, true)
}

/**
 * Get Plorequest service resource URL.
 */
export function getPlotrequestResourceURL(name = 'MIX_PLOTREQUEST_URL') {
  return readOSEnvironmentVariable(name, true)
}

/**
 * Get Plotrequest service credentrial API key.
 */
export function getPlotrequestCredentialKey(name = 'MIX_PLOTREQUEST_API_KEY') {
  return readOSEnvironmentVariable(name, true)
}
