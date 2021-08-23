import {
  initState,
  mutations,
  getters,
  actions,
} from '../../seismic/seismicity'

const period = {
  count: 2,
  type: 'month',
  text: '2 months',
}

export default {
  namespaced: true,
  state: initState(period),
  getters,
  mutations,
  actions,
}
