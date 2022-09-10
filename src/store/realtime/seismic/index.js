import seismicity from './seismicity'
import energy from './energy'
import hypocenter from './hypocenter'
import rfapEnergy from './rfap-energy'

export default {
  namespaced: true,
  modules: {
    seismicity,
    energy,
    hypocenter,
    rfapEnergy,
  },
}
