import rangeSelector from './range-selector'
import { initState, mutations, getters, actions } from './index'

const defaultPeriod = rangeSelector[2]

export default {
  namespaced: true,
  state: initState(defaultPeriod),
  getters,
  mutations,
  actions,
}
