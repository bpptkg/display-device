import moment from 'moment'
import { EventCodes } from '@/constants/bulletin'
import { generateColormap } from '@/utils/color'

export const DomeEvent = 'DOME'

export const primaryAnnotations = [
  {
    checked: true,
    color: 'purple',
    isEarthquakeEvent: false,
    label: 'Dome',
    lineStyle: 'dashed',
    name: DomeEvent,
    xValue: moment('2018-08-01').unix() * 1000,
  },
  {
    checked: true,
    color: 'red',
    isEarthquakeEvent: true,
    label: 'Explosion',
    lineStyle: 'dashed',
    name: EventCodes.EXPLOSION,
  },
]

export const secondaryAnnotations = [
  {
    checked: false,
    isEarthquakeEvent: true,
    label: 'VTA',
    name: EventCodes.VTA,
  },
  {
    checked: false,
    isEarthquakeEvent: true,
    label: 'VTB',
    name: EventCodes.VTB,
  },
  {
    checked: false,
    isEarthquakeEvent: true,
    label: 'MP',
    name: EventCodes.MP,
  },
  {
    checked: false,
    isEarthquakeEvent: true,
    label: 'LF',
    name: EventCodes.LF,
  },
  {
    checked: false,
    isEarthquakeEvent: true,
    label: 'RF',
    name: EventCodes.ROCKFALL,
  },
  {
    checked: false,
    isEarthquakeEvent: true,
    label: 'DG',
    name: EventCodes.GASBURST,
  },
  {
    checked: false,
    isEarthquakeEvent: true,
    label: 'AP',
    name: EventCodes.AWANPANAS,
  },
  {
    checked: false,
    isEarthquakeEvent: true,
    label: 'TECT',
    name: EventCodes.TECT,
  },
]

export const baseAnnotations = [...primaryAnnotations, ...secondaryAnnotations]

// Reverse colormap so that red color is associated with explosion event.
export const annotationColormap = generateColormap('jet', {
  nshades: baseAnnotations.length,
}).reverse()

const annotations = baseAnnotations.map((v, index) => {
  return {
    ...v,
    color: annotationColormap[index],
    lineStyle: 'dashed',
  }
})

export default annotations
