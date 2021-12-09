import { initState, getters, mutations, actions } from '../../tiltmeter'
import { DataTypes } from '@/constants/tiltmeter'

const period = {
  count: 1,
  type: 'month',
  text: '1 month',
}

export default {
  namespaced: true,
  state: initState(DataTypes.BOREHOLE, 'klatakan', period),
  getters,
  mutations,
  actions,
}
