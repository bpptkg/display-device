import { initModule, HelicorderChannel } from '../../helicorder'

export default {
  namespaced: true,
  modules: {
    namespaced: true,
    [HelicorderChannel.MEPAS_HHZ_VG_00]: initModule(),
  },
}
