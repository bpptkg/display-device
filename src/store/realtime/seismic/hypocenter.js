import {
  initState,
  mutations,
  getters,
  actions,
} from '@/store/seismic/hypocenter'

import {
  DEFAULT_SETTINGS,
  THEMES,
} from '@/components/echarts/chart-options/hypocenter'

const period = {
  count: 3,
  type: 'day',
  text: '3 days',
}

const customSettings = {
  ...DEFAULT_SETTINGS,
  autoRotate: false,
  autoRotateSpeed: 3,
  showSurfaceColormapLegend: false,
  surfaceOpacity: 0.3,
  symbolSize: 10,
  theme: THEMES.light,
}

export default {
  namespaced: true,
  state: initState(period, customSettings),
  getters,
  mutations,
  actions,
}
