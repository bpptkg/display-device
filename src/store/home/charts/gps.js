import { initState, getters, mutations, actions } from '../../gps/baseline'

const period = {
  count: 3,
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
