import { initState, getters, mutations, actions } from '../../gps/baseline'

const period = {
  count: 1,
  type: 'month',
  text: '1 month',
}

export default {
  namespaced: true,
  state: initState('p1', period),
  getters,
  mutations,
  actions,
}
