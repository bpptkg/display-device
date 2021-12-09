import {
  initState,
  getters,
  mutations,
  actions,
} from '../../weather/pasarbubar/rainfall'

const period = {
  count: 6,
  type: 'hour',
  text: '6 hours',
}

export default {
  namespaced: true,
  state: initState(period),
  getters,
  mutations,
  actions,
}
