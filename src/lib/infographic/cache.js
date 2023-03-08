import Cache from '@/utils/cache'

export const cache = new Cache()

const DATE_FORMAT = 'YYYY-MM-DD-HH-mm-ss'

export const createIntervalCacheKey = (startTime, endTime) => {
  return `${startTime.format(DATE_FORMAT)}~${endTime.format(DATE_FORMAT)}`
}

export const createSeismcitityCacheKey = (code, startTime, endTime) => {
  return `infographic/seismicity/${code}/${createIntervalCacheKey(
    startTime,
    endTime
  )}`
}

export const createEdmCacheKey = (benchmark, reflector, startTime, endTime) => {
  return `infographic/edm/${benchmark}-${reflector}/${createIntervalCacheKey(
    startTime,
    endTime
  )}`
}
