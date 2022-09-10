import {
  initState,
  mutations,
  getters,
  actions,
} from '@/store/seismic/equivalent-energy'

const period = {
  count: 3,
  type: 'day',
  text: '3 days',
}

export default {
  namespaced: true,
  state: initState(period),
  getters,
  mutations,
  actions,
}
