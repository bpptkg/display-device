import { initState, getters, mutations, actions } from '../../edm'
import { EDMBenchmark } from '@/constants/edm'

const period = {
  count: 1,
  type: 'month',
  text: '1 month',
}

export default {
  namespaced: true,
  state: initState(EDMBenchmark.BAB0, period),
  getters,
  mutations,
  actions,
}
