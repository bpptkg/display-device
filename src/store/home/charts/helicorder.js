import { initModule, HelicorderChannel } from '../../helicorder'

export default {
  namespaced: true,
  modules: {
    namespaced: true,
    [HelicorderChannel.PASB_BHZ_MP_10]: initModule(),
  },
}
