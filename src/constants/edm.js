export const EDMBenchmark = Object.freeze({
  BAB0: 'BAB0',
  BAB1: 'BAB1',
  BAT0: 'BAT0',
  BEL0: 'BEL0',
  CEP0: 'CEP0',
  DEL0: 'DEL0',
  GEB0: 'GEB0',
  JRK0: 'JRK0',
  KAJ0: 'KAJ0',
  KAL0: 'KAL0',
  MRY0: 'MRY0',
  SAP0: 'SAP0',
  SEL0: 'SEL0',
  STA0: 'STA0',
  TRI0: 'TRI0',
})

export const EDMReflector = Object.freeze({
  RB1: 'RB1',
  RB2: 'RB2',
  RB3: 'RB3',
  RB4: 'RB4',
  RD1: 'RD1',
  RD2: 'RD2',
  RD3: 'RD3',
  RJ1: 'RJ1',
  RJ2: 'RJ2',
  RK1: 'RK1',
  RK2: 'RK2',
  RK3: 'RK3',
  RM1: 'RM1',
  RM2: 'RM2',
  RS1: 'RS1',
  RS2: 'RS2',
  RS3: 'RS3',
  RS4: 'RS4',
})

export const edmBenchmarks = Object.values(EDMBenchmark)
export const edmReflectors = Object.values(EDMReflector)

export const EDMBenchmarkReflectorRelation = {
  [EDMBenchmark.BAB0]: [EDMReflector.RB1, EDMReflector.RB2, EDMReflector.RB3],
  [EDMBenchmark.BAB1]: [EDMReflector.RB1, EDMReflector.RB2, EDMReflector.RB3],
  [EDMBenchmark.BAT0]: [EDMReflector.RK1, EDMReflector.RK2],
  [EDMBenchmark.BEL0]: [EDMReflector.RM1, EDMReflector.RM2],
  [EDMBenchmark.CEP0]: [
    EDMReflector.RS1,
    EDMReflector.RS2,
    EDMReflector.RS3,
    EDMReflector.RS4,
  ],
  [EDMBenchmark.DEL0]: [EDMReflector.RD1],
  [EDMBenchmark.GEB0]: [EDMReflector.RS1, EDMReflector.RS2, EDMReflector.RS4],
  [EDMBenchmark.JRK0]: [EDMReflector.RJ1, EDMReflector.RJ2],
  [EDMBenchmark.KAJ0]: [
    EDMReflector.RJ1,
    EDMReflector.RJ2,
    EDMReflector.RS2,
    EDMReflector.RS3,
  ],
  [EDMBenchmark.KAL0]: [EDMReflector.RK2, EDMReflector.RK3],
  [EDMBenchmark.MRY0]: [EDMReflector.RM1, EDMReflector.RM2],
  [EDMBenchmark.SAP0]: [EDMReflector.RD1],
  [EDMBenchmark.SEL0]: [
    EDMReflector.RS1,
    EDMReflector.RS2,
    EDMReflector.RS3,
    EDMReflector.RS4,
  ],
  [EDMBenchmark.STA0]: [
    EDMReflector.RB1,
    EDMReflector.RB2,
    EDMReflector.RB3,
    EDMReflector.RJ2,
  ],
  [EDMBenchmark.TRI0]: [EDMReflector.RK2, EDMReflector.RK3],
}

export const FIELDS = {
  timestamp: 'timestamp',
  slope_distance: 'slope_distance',
}

export const edmBenchmarkInfo = {
  [EDMBenchmark.BAB0]: {
    code: EDMBenchmark.BAB0,
    name: 'Babadan 0',
    reflectors: EDMBenchmarkReflectorRelation.BAB0,
  },
  [EDMBenchmark.BAB1]: {
    code: EDMBenchmark.BAB1,
    name: 'Babadan 1',
    reflectors: EDMBenchmarkReflectorRelation.BAB1,
  },
  [EDMBenchmark.BAT0]: {
    code: EDMBenchmark.BAT0,
    name: 'Batu Alin',
    reflectors: EDMBenchmarkReflectorRelation.BAT0,
  },
  [EDMBenchmark.BEL0]: {
    code: EDMBenchmark.BEL0,
    name: 'Beling',
    reflectors: EDMBenchmarkReflectorRelation.BEL0,
  },
  [EDMBenchmark.CEP0]: {
    code: EDMBenchmark.CEP0,
    name: 'Cepogo',
    reflectors: EDMBenchmarkReflectorRelation.CEP0,
  },
  [EDMBenchmark.DEL0]: {
    code: EDMBenchmark.DEL0,
    name: 'Deles',
    reflectors: EDMBenchmarkReflectorRelation.DEL0,
  },
  [EDMBenchmark.GEB0]: {
    code: EDMBenchmark.GEB0,
    name: 'Gebyok',
    reflectors: EDMBenchmarkReflectorRelation.GEB0,
  },
  [EDMBenchmark.JRK0]: {
    code: EDMBenchmark.JRK0,
    name: 'Jrakah',
    reflectors: EDMBenchmarkReflectorRelation.JRK0,
  },
  [EDMBenchmark.KAJ0]: {
    code: EDMBenchmark.KAJ0,
    name: 'Kajor',
    reflectors: EDMBenchmarkReflectorRelation.KAJ0,
  },
  [EDMBenchmark.KAL0]: {
    code: EDMBenchmark.KAL0,
    name: 'Kaliurang',
    reflectors: EDMBenchmarkReflectorRelation.KAL0,
  },
  [EDMBenchmark.MRY0]: {
    code: EDMBenchmark.MRY0,
    name: 'Mriyan',
    reflectors: EDMBenchmarkReflectorRelation.MRY0,
  },
  [EDMBenchmark.SAP0]: {
    code: EDMBenchmark.SAP0,
    name: 'Sapu Angin',
    reflectors: EDMBenchmarkReflectorRelation.SAP0,
  },
  [EDMBenchmark.SEL0]: {
    code: EDMBenchmark.SEL0,
    name: 'Selo',
    reflectors: EDMBenchmarkReflectorRelation.SEL0,
  },
  [EDMBenchmark.STA0]: {
    code: EDMBenchmark.STA0,
    name: 'Stabelan',
    reflectors: EDMBenchmarkReflectorRelation.STA0,
  },
  [EDMBenchmark.TRI0]: {
    code: EDMBenchmark.TRI0,
    name: 'Tritis',
    reflectors: EDMBenchmarkReflectorRelation.TRI0,
  },
}
