import moment from 'moment'

/**
 * Calculate actual rainfall from meteorology data.
 *
 * @param {Array} data Array of object fetched from BMA meteorolgy API.
 * @returns {Array} Two columns array of rainfall data.
 */
export const calculateRainfall = (data) => {
  const maxCounterValue = 655.35

  return data.map((item, index, array) => {
    const timestamp = moment(item.timestamp).unix() * 1000
    if (index === 0) {
      return [timestamp, null]
    } else {
      const delta = item.rainfall - array[index - 1].rainfall
      return [timestamp, delta >= 0 ? delta : maxCounterValue + delta]
    }
  })
}

/**
 * Calculate cumulated rainfall value based on last timestamp when the rain
 * dropped. When the rain happens, accumulated the value if rainfall is not
 * zero. Track the last timestamp when the rain dropped, if it greater than 15
 * minutes, restart accumulated values to zero. This period of time was chosen
 * because 15 minutes is defined by the U.S. National Weather Service as
 * intervening time upon which one rain "event" is considered separate from
 * another rain "event".
 *
 * @params {Array} data Array of object fetched from BMA meteorolgy API.
 * @return {Array} result Two columns array of rainfall data.
 */
export const calculateCumulatedRainfall = (data) => {
  const maxCounterValue = 655.35
  const durationThreshold = 15 /* 15 minutes */
  let total = 0
  let lastDropTimestamp = null
  let previousRainfall = null
  const result = []

  for (let i = 0; i < data.length; i++) {
    const timestamp = moment(data[i].timestamp)

    if (i === 0) {
      lastDropTimestamp = timestamp
      previousRainfall = data[i].rainfall
      continue
    }

    const duration = moment.duration(timestamp.diff(lastDropTimestamp))
    if (duration.asMinutes() > durationThreshold) {
      total = 0
    }

    const currentRainfall = data[i].rainfall
    if (currentRainfall !== previousRainfall) {
      lastDropTimestamp = timestamp
    }

    const delta = currentRainfall - previousRainfall
    total += delta >= 0 ? delta : maxCounterValue + delta
    result.push([timestamp.unix() * 1000, total])
    previousRainfall = currentRainfall
  }
  return result
}

export const getWindowedArray = (array, index, size) => {
  return index - size < 0
    ? array.slice(0, index + 1)
    : array.slice(index - size + 1, index + 1)
}

export const movingSum = (data, size, factor) => {
  return data.map((item, index, array) => {
    const windowedArray = getWindowedArray(array, index, size)
    const sum = windowedArray.reduce((total, item) => {
      return (total += item[1])
    }, 0)
    return [item[0], sum * factor]
  })
}

/**
 * Calculate rainfall sum by range. Total sum unit is mm.
 *
 * @param {Array} data Array of two columns with timestamp and rainfall value.
 * It can be calculated using calculateRainfall function.
 * @param {Moment} startTime Start time of range window.
 * @param {Moment} endTime End time of range window.
 */
export const calculateRainfallTotalByRange = (data, startTime, endTime) => {
  return data
    .filter((item) => {
      const timestamp = moment(item[0])
      return timestamp.isBetween(startTime, endTime)
    })
    .reduce((total, item) => {
      return (total += item[1])
    }, 0)
}
