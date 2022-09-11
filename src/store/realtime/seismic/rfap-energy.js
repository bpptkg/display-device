import {
  initState,
  mutations,
  getters,
  actions,
  SamplingTypes,
} from '@/store/seismic/equivalent-energy'

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
