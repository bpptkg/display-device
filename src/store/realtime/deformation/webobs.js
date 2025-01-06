import {
  initState,
  getters,
  mutations,
  actions,
  GPSGraphs,
} from '../../../store/gps/graphs'

export default {
  namespaced: true,
  state: initState({ graph: GPSGraphs.modeling }),
  getters,
  mutations,
  actions,
}
