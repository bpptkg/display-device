import Cache from '@/utils/cache'

export const cache = new Cache()

const DATE_FORMAT = 'YYYY-MM-DD-HH-mm-ss'

export const createIntervalCacheKey = (startTime, endTime) => {
  return `${startTime.format(DATE_FORMAT)}~${endTime.format(DATE_FORMAT)}`
}

export const createCacheKey = (key, startTime, endTime) => {
  return `modeling/${key}/${createIntervalCacheKey(startTime, endTime)}`
}
