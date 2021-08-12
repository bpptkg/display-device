export const DIRECTION = Object.freeze({
  apu: 'Apu',
  batang: 'Batang',
  bebeng: 'Bebeng',
  bedog: 'Bedog',
  boyong: 'Boyong',
  gendol: 'Gendol',
  krasak: 'Krasak',
  kuning: 'Kuning',
  lamat: 'Lamat',
  opak: 'Opak',
  satputih: 'Sat/Putih',
  senowo1: 'Senowo1',
  senowo2: 'Senowo2',
  senowo3: 'Senowo3',
  trising: 'Trising',
  woro: 'Woro',
  timur: 'TIMUR',
  tenggara: 'TENGGARA',
  selatan: 'SELATAN',
  baratdaya: 'BARAT DAYA',
  barat: 'BARAT',
  baratlaut: 'BARAT LAUT',
  utara: 'UTARA',
  timurlaut: 'TIMUR LAUT',
})

export const DIRECTION_GROUP = [
  // Utara
  [],

  // Timur Laut
  [],

  // Timur
  [],

  // Tenggara
  [DIRECTION.gendol, DIRECTION.woro],

  // Selatan
  [DIRECTION.kuning, DIRECTION.opak],

  // Barat Daya
  [DIRECTION.satputih, DIRECTION.krasak, DIRECTION.bebeng, DIRECTION.boyong],

  // Barat
  [DIRECTION.senowo2, DIRECTION.senowo3, DIRECTION.batang, DIRECTION.lamat],

  // Barat Laut
  [DIRECTION.apu, DIRECTION.trising, DIRECTION.senowo1],
]
