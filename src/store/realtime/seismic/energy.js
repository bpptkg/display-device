import { initState, mutations, getters, actions } from '@/store/seismic/energy'
import { EnergyTypes, SamplingTypes } from '@/constants/energy'

const period = {
  count: 3,
  type: 'day',
  text: '3 days',
}

export default {
  namespaced: true,
  state: initState(EnergyTypes.TOTAL, period, SamplingTypes.HOUR),
  getters,
  mutations,
  actions,
}
