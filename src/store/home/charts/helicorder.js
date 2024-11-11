import { initModule, HelicorderChannel } from '../../helicorder'

export default {
  namespaced: true,
  modules: {
    namespaced: true,
    [HelicorderChannel.MEPAS_HHZ_VG_00]: initModule(
      HelicorderChannel.MEPAS_HHZ_VG_00
    ),
    [HelicorderChannel.MELAB_HHZ_VG_00]: initModule(
      HelicorderChannel.MELAB_HHZ_VG_00
    ),
    [HelicorderChannel.MEPSL_HHZ_VG_00]: initModule(
      HelicorderChannel.MEPSL_HHZ_VG_00
    ),
  },
}
