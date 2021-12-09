import moment from 'moment'

export const MIN_WIDTH = 150
export const MIN_HEIGHT = 150

export const MAX_WIDTH = 4000
export const MAX_HEIGHT = 4000

export const DEFAULT_HEIGHT_MOBILE = 600
export const DEFAULT_HEIGHT_SCREEN = 800

export const isMobile = (width) => {
  return width <= 575
}

export const validateWidth = (value) => {
  if (value >= MIN_WIDTH && value <= MAX_HEIGHT) {
    return value
  } else if (value < MIN_WIDTH) {
    return MIN_WIDTH
  } else {
    return MAX_WIDTH
  }
}

export const validateHeight = (width, height) => {
  if (isMobile(width)) {
    return DEFAULT_HEIGHT_MOBILE
  } else if (height >= MIN_HEIGHT && height <= MAX_HEIGHT) {
    return height
  } else {
    return DEFAULT_HEIGHT_SCREEN
  }
}

export const durationAsHours = (t1, t2) => {
  return moment.duration(t2.diff(t1)).asHours()
}

/**
 * Calculate update interval in miliseconds.
 */
export const calculateInterval = (t1, t2) => {
  const duration = durationAsHours(t1, t2)
  return duration / 24 > 1 ? 30000 : 10000
}
