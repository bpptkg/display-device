import { initState, mutations, getters, actions } from '@/store/rsam'

const period = {
  count: 3,
  type: 'day',
  text: '3 days',
}

export default {
  namespaced: true,
  state: initState('MEPAS_HHZ_VG_00', period),
  getters,
  mutations,
  actions,
}
