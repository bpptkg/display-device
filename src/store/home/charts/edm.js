import { initState, getters, mutations, actions } from '../../edm'
import { EDMBenchmark } from '@/constants/edm'

const period = {
  count: 3,
  type: 'month',
  text: '3 months',
}

export default {
  namespaced: true,
  state: initState(EDMBenchmark.BAB0, period),
  getters,
  mutations,
  actions,
}
