export const EnergyTypes = Object.freeze({
  TOTAL: 'total',
  VT: 'vt',
  VTA: 'vta',
  VTB: 'vtb',
  VTBMP: 'vtbmp',
})

const entries = new Map([
  [EnergyTypes.TOTAL, { eventtype: ['VTB,MP', 'VTA', 'VTA,VTB,MP'] }],
  [EnergyTypes.VT, { eventtype: 'VTA,VTB' }],
  [EnergyTypes.VTA, { eventtype: 'VTA' }],
  [EnergyTypes.VTB, { eventtype: 'VTB' }],
  [EnergyTypes.VTBMP, { eventtype: 'VTB,MP' }],
])

export const EnergyEventTypes = Object.freeze(Object.fromEntries(entries))

export const EnergyTotalSeriesIndex = {
  [EnergyTypes.VTBMP]: 0,
  [EnergyTypes.VTA]: 1,
  [EnergyTypes.TOTAL]: 2,
}

export const FIELDS_DEFAULT = Object.freeze({
  eventid: 'eventid',
  eventdate: 'eventdate',
  eventtype: 'eventtype',
  duration: 'duration',
  amplitude: 'amplitude',
  magnitude: 'magnitude',
  longitude: 'longitude',
  latitude: 'latitude',
  depth: 'depth',
  seiscompid: 'seiscompid',
  location_mode: 'location_mode',
  location_type: 'location_type',
  ml_deles: 'ml_deles',
  ml_labuhan: 'ml_labuhan',
  ml_pasarbubar: 'ml_pasarbubar',
  ml_pusunglondon: 'ml_pusunglondon',
  energy: 'energy',
})

export const FIELDS_ACCUMULATION_MODE = Object.freeze({
  timestamp: 'timestamp',
  energy: 'energy',
})

// 10^12 erg to MJ conversion factor.
export const CONVERSION_FACTOR = 10

export const SamplingTypes = {
  HOUR: 'hour',
  DAY: 'day',
}
