import { initState, getters, mutations, actions } from '../../gps/baseline'

const period = {
  count: 2,
  type: 'month',
  text: '3 months',
}

export default {
  namespaced: true,
  state: initState('pasarbubar', period),
  getters,
  mutations,
  actions,
}
