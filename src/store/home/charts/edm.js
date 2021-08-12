import { initState, getters, mutations, actions } from '../../edm'

const period = {
  count: 3,
  type: 'month',
  text: '3 months',
}

export default {
  namespaced: true,
  state: initState('BAB0', period),
  getters,
  mutations,
  actions,
}
