import { makeIndex } from '@/utils/series'

export const createDataZoom = (axisLength, options = {}) => {
  return [
    {
      type: 'slider',
      xAxisIndex: makeIndex(axisLength),
      realtime: false,
      ...options,
    },
  ]
}
