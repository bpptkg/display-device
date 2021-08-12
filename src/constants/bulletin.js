export const EventCodes = Object.freeze({
  ANTHROP: 'ANTHROP',
  AUTO: 'AUTO',
  EXPLOSION: 'EXPLOSION',
  GASBURST: 'GASBURST',
  LF: 'LF',
  MP: 'MP',
  ROCKFALL: 'ROCKFALL',
  SOUND: 'SOUND',
  TECLOC: 'TECLOC',
  TECT: 'TECT',
  TELE: 'TELE',
  TPHASE: 'TPHASE',
  TREMOR: 'TREMOR',
  UNKNOWN: 'UNKNOWN',
  VTA: 'VTA',
  VTB: 'VTB',
  AWANPANAS: 'AWANPANAS',
  LAHAR: 'LAHAR',
})

export const EventCodesList = Object.values(EventCodes)

export const seismicEvents = [
  {
    code: EventCodes.ANTHROP,
    name: 'Anthropogenic',
  },
  {
    code: EventCodes.AUTO,
    name: 'Automatic',
  },
  {
    code: EventCodes.EXPLOSION,
    name: 'Explosion',
  },
  {
    code: EventCodes.GASBURST,
    name: 'Degassing',
  },
  {
    code: EventCodes.LF,
    name: 'Low-Frequency',
  },
  {
    code: EventCodes.MP,
    name: 'Multi-Phase',
  },
  {
    code: EventCodes.ROCKFALL,
    name: 'Rockfall',
  },
  {
    code: EventCodes.SOUND,
    name: 'Sound',
  },
  {
    code: EventCodes.TECLOC,
    name: 'Local Tectonic',
  },
  {
    code: EventCodes.TECT,
    name: 'Tectonic',
  },
  {
    code: EventCodes.TELE,
    name: 'Teleseism',
  },
  {
    code: EventCodes.TPHASE,
    name: 'T-Phase',
  },
  {
    code: EventCodes.TREMOR,
    name: 'Tremor',
  },
  {
    code: EventCodes.UNKNOWN,
    name: 'Unknown',
  },
  {
    code: EventCodes.VTA,
    name: 'VTA',
  },
  {
    code: EventCodes.VTB,
    name: 'VTB',
  },
  {
    code: EventCodes.AWANPANAS,
    name: 'Awanpanas',
  },
  {
    code: EventCodes.LAHAR,
    name: 'Lahar',
  },
]
