export const SamplingTypes = Object.freeze({
  DAY: 'day',
  MINUTE: 'minute',
})

export const DataTypes = Object.freeze({
  PLATFORM: 'platform',
  PLATFORM_RAW: 'platform_raw',
  BOREHOLE: 'borehole',
  TLR: 'tlr',
})

export const AggregationTypes = Object.freeze({
  AVG: 'avg',
  MEAN: 'mean',
  COUNT: 'count',
  MIN: 'min',
  MAX: 'max',
})

export const tiltmeterStations = Object.freeze({
  platform: [
    'babadan',
    'grawah',
    'gunungijo',
    'klatakan',
    'labuhan',
    'patuk',
    'selokopo',
  ],
  platform_raw: [
    'babadan',
    'grawah',
    'gunungijo',
    'klatakan',
    'labuhan',
    'patuk',
    'selokopo',
  ],
  borehole: [
    'bawahkendit',
    'kendit',
    'klatakan',
    'lavaflow1902',
    'lavaflow1953',
  ],
  tlr: ['babadan', 'deles', 'plawangan', 'gadjahmungkur'],
})

export const FIELDS = {
  x: 'x',
  y: 'y',
  temperature: 'temperature',
}
