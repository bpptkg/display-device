import {
  initState,
  getters,
  mutations,
  actions,
} from '../../weather/pasarbubar/rainfall'

const period = {
  count: 10,
  type: 'minute',
  text: '10 minutes',
}

export default {
  namespaced: true,
  state: initState(period),
  getters,
  mutations,
  actions,
}
