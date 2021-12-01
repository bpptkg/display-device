import { LavaDome } from '../../constants/lava-domes'

export const getNamespaceLocation = (loc) => {
  switch (loc) {
    case LavaDome.DOME_SOUTHWEST:
      return 'domeSouthwest'
    case LavaDome.DOME_CENTER:
      return 'domeCenter'
    default:
      return 'domeSouthwest'
  }
}

export const getTitlebyLocation = (loc) => {
  switch (loc) {
    case LavaDome.DOME_SOUTHWEST:
      return 'Lava Dome Growth (Barat Daya)'
    case LavaDome.DOME_CENTER:
      return 'Lava Dome Growth (Tengah Kawah)'
    default:
      return 'Lava Dome Growth'
  }
}
