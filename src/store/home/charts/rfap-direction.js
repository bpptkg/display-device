import { initState, getters, mutations, actions } from '../../rfap-direction'

const period = {
  count: 1,
  type: 'month',
  text: '1 month',
}

export default {
  namespaced: true,
  state: initState(period),
  getters,
  mutations,
  actions,
}
