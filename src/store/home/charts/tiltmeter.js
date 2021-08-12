import { initState, getters, mutations, actions } from '../../tiltmeter'
import { DataTypes } from '@/constants/tiltmeter'

const period = {
  count: 6,
  type: 'month',
  text: '6 months',
}

export default {
  namespaced: true,
  state: initState(DataTypes.PLATFORM, 'selokopo', period),
  getters,
  mutations,
  actions,
}
