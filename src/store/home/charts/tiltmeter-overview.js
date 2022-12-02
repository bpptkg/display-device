import {
  initState,
  getters,
  mutations,
  actions,
} from '../../tiltmeter/overview'

const period = {
  count: 1,
  type: 'month',
  text: '1 month',
}

const tiltOptions = [
  {
    type: 'tlr',
    station: 'gadjahmungkur',
    label: 'Gadjah Mungkur',
  },
  {
    type: 'platform',
    station: 'patuk',
    label: 'Patuk',
  },
  {
    type: 'platform',
    station: 'labuhan',
    label: 'Labuhan',
  },
  {
    type: 'tlr',
    station: 'deles',
    label: 'Deles',
  },
]

export default {
  namespaced: true,
  state: initState(period, tiltOptions),
  getters,
  mutations,
  actions,
}
