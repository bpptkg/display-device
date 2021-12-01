import { LavaDome } from '../../../constants/lava-domes'
import { initModule } from '../../lava-domes'

const period = {
  count: 3,
  type: 'month',
  text: '1 months',
}

export default {
  namespaced: true,
  modules: {
    namespaced: true,
    domeSouthwest: initModule(LavaDome.DOME_SOUTHWEST, period),
    domeCenter: initModule(LavaDome.DOME_CENTER, period),
  },
}
