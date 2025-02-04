export const GPSStations = Object.freeze({
  p1: 'p1',
  babadan: 'babadan',
  bpptkg: 'bpptkg',
  // deles: 'deles',
  kalitengahlor: 'kalitengahlor',
  delessendang: 'delessendang',
  grawah: 'grawah',
  jrakah: 'jrakah',
  klatakan: 'klatakan',
  // kendit: 'kendit',
  labuhan: 'labuhan',
  pasarbubar: 'pasarbubar',
  plawangan: 'plawangan',
  selo: 'selo',
})

export const gpsStations = Object.values(GPSStations)

export const gpsStationCodes = {
  babadan: 'BABA',
  bpptkg: 'BPPTK',
  deles: 'DELS',
  delessendang: 'DLSS',
  grawah: 'GRWH',
  jrakah: 'JRAK',
  klatakan: 'KLAT',
  kendit: 'KNDT',
  labuhan: 'LABH',
  pasarbubar: 'PASB',
  plawangan: 'PLAW',
  selo: 'SELO',
  puncak: 'PNCK',
  p1: 'P1',
  kalitengahlor: 'KALL',
}

export const gpsLabels = {
  babadan: 'Babadan',
  bpptkg: 'BPPTKG',
  deles: 'Deles1',
  delessendang: 'Deles0',
  grawah: 'Grawah',
  jrakah: 'Jrakah',
  klatakan: 'Klatakan',
  kendit: 'Kendit',
  labuhan: 'Labuhan',
  pasarbubar: 'Pasarbubar',
  plawangan: 'Plawangan',
  selo: 'Selo',
  puncak: 'Puncak',
  p1: '2km Depth',
  kalitengahlor: 'Kali Tengah Lor',
}

export const FIELDS = Object.freeze({
  timestamp: 'timestamp',
  east: 'east',
  north: 'north',
  up: 'up',
  err_east: 'err_east',
  err_north: 'err_north',
  err_up: 'err_up',
  orbit: 'orbit',
})

export const BASELINE_FIELDS = Object.freeze({
  timestamp: 'timestamp',
  baseline: 'baseline',
})
