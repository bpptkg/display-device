export const EDMBenchmarks = Object.freeze({
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
  SEL0: 'SEL0',
  STA0: 'STA0',
  TRI0: 'TRI0',
})

export const EDMReflectors = Object.freeze({
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

export const edmBenchmarks = Object.values(EDMBenchmarks)
export const edmReflectors = Object.values(EDMReflectors)

export const EDMBenchmarkReflectorRelations = {
  BAB0: ['RB1', 'RB2'],
  BAB1: ['RB1', 'RB2'],
  BAT0: ['RK1', 'RK2'],
  BEL0: ['RM1', 'RM2'],
  CEP0: ['RS1', 'RS2', 'RS3', 'RS4'],
  DEL0: ['RD1'],
  GEB0: ['RS1', 'RS2', 'RS4'],
  JRK0: ['RJ1', 'RJ2'],
  KAJ0: ['RJ1', 'RJ2', 'RS2', 'RS3'],
  KAL0: ['RK2', 'RK3'],
  MRY0: ['RM1', 'RM2'],
  SEL0: ['RS1', 'RS2', 'RS3', 'RS4'],
  STA0: ['RB1', 'RB2', 'RB3', 'RJ2'],
  TRI0: ['RK2', 'RK3'],
}

export const FIELDS = {
  timestamp: 'timestamp',
  slope_distance: 'slope_distance',
}

export const edmBenchmarkInfo = {
  BAB0: {
    code: 'BAB0',
    name: 'Babadan 0',
    reflectors: EDMBenchmarkReflectorRelations.BAB0,
  },
  BAB1: {
    code: 'BAB1',
    name: 'Babadan 1',
    reflectors: EDMBenchmarkReflectorRelations.BAB1,
  },
  BAT0: {
    code: 'BAT0',
    name: 'Batu Alin',
    reflectors: EDMBenchmarkReflectorRelations.BAT0,
  },
  BEL0: {
    code: 'BEL0',
    name: 'Beling',
    reflectors: EDMBenchmarkReflectorRelations.BEL0,
  },
  CEP0: {
    code: 'CEP0',
    name: 'Cepogo',
    reflectors: EDMBenchmarkReflectorRelations.CEP0,
  },
  DEL0: {
    code: 'DEL0',
    name: 'Deles',
    reflectors: EDMBenchmarkReflectorRelations.DEL0,
  },
  GEB0: {
    code: 'GEB0',
    name: 'Gebyok',
    reflectors: EDMBenchmarkReflectorRelations.GEB0,
  },
  JRK0: {
    code: 'JRK0',
    name: 'Jrakah',
    reflectors: EDMBenchmarkReflectorRelations.JRK0,
  },
  KAJ0: {
    code: 'KAJ0',
    name: 'Kajor',
    reflectors: EDMBenchmarkReflectorRelations.KAJ0,
  },
  KAL0: {
    code: 'KAL0',
    name: 'Kaliurang',
    reflectors: EDMBenchmarkReflectorRelations.KAL0,
  },
  MRY0: {
    code: 'MRY0',
    name: 'Mriyan',
    reflectors: EDMBenchmarkReflectorRelations.MRY0,
  },
  SEL0: {
    code: 'SEL0',
    name: 'Selo',
    reflectors: EDMBenchmarkReflectorRelations.SEL0,
  },
  STA0: {
    code: 'STA0',
    name: 'Stabelan',
    reflectors: EDMBenchmarkReflectorRelations.STA0,
  },
  TRI0: {
    code: 'TRI0',
    name: 'Tritis',
    reflectors: EDMBenchmarkReflectorRelations.TRI0,
  },
}
