import { numberFormatterFactory } from '@/utils/formatter-factory'

export default [
  {
    key: 'label',
    label: 'Station',
  },
  {
    key: 'minx',
    label: 'Min X',
    formatter: numberFormatterFactory(2),
  },
  {
    key: 'maxx',
    label: 'Max X',
    formatter: numberFormatterFactory(2),
  },
  {
    key: 'meanx',
    label: 'Mean X',
    formatter: numberFormatterFactory(2),
  },
  {
    key: 'miny',
    label: 'Min Y',
    formatter: numberFormatterFactory(2),
  },
  {
    key: 'maxy',
    label: 'Max Y',
    formatter: numberFormatterFactory(2),
  },
  {
    key: 'meany',
    label: 'Mean Y',
    formatter: numberFormatterFactory(2),
  },
]
