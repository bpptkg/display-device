import { SamplingTypes } from '@/constants/seismicity'
import {
  initState,
  mutations,
  getters,
  actions,
} from '@/store/seismic/seismicity'

const period = {
  count: 3,
  type: 'day',
  text: '3 days',
}

export default {
  namespaced: true,
  state: initState(period, SamplingTypes.HOUR),
  getters,
  mutations,
  actions,
}
