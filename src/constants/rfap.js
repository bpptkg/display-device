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
  [DIRECTION.utara],

  // Timur Laut
  [DIRECTION.timurlaut],

  // Timur
  [DIRECTION.timur],

  // Tenggara
  [DIRECTION.tenggara, DIRECTION.gendol, DIRECTION.woro],

  // Selatan
  [DIRECTION.selatan, DIRECTION.kuning, DIRECTION.opak],

  // Barat Daya
  [
    DIRECTION.baratdaya,
    DIRECTION.satputih,
    DIRECTION.krasak,
    DIRECTION.bebeng,
    DIRECTION.boyong,
  ],

  // Barat
  [
    DIRECTION.barat,
    DIRECTION.senowo2,
    DIRECTION.senowo3,
    DIRECTION.batang,
    DIRECTION.lamat,
  ],

  // Barat Laut
  [DIRECTION.baratlaut, DIRECTION.apu, DIRECTION.trising, DIRECTION.senowo1],
]

export const DIRECTION_GROUP_INDEX = [
  'N [Utara]',
  'NE [Timur Laut]',
  'E [Timur]',
  'SE [Tenggara]',
  'S [Selatan]',
  'SW [Barat Daya]',
  'W [Barat]',
  'NW [Barat Laut]',
]
