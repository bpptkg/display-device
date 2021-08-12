import { EventCodes } from '@/constants/bulletin'

export const filters = [
  {
    checked: true,
    label: 'VTA',
    name: EventCodes.VTA,
  },
  {
    checked: true,
    label: 'VTB',
    name: EventCodes.VTB,
  },
  {
    checked: false,
    label: 'MP',
    name: EventCodes.MP,
  },
  {
    checked: false,
    label: 'LF',
    name: EventCodes.LF,
  },
  {
    checked: false,
    label: 'RF',
    name: EventCodes.ROCKFALL,
  },
  {
    checked: false,
    label: 'DG',
    name: EventCodes.GASBURST,
  },
  {
    checked: false,
    label: 'AP',
    name: EventCodes.AWANPANAS,
  },
  {
    checked: false,
    label: 'TECT',
    name: EventCodes.TECT,
  },
]

export default filters
