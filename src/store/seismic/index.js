import cluster from './cluster'
import bulletin from './bulletin'
import energy from './energy'
import equivalentEnergy from './equivalent-energy'
import eventDaily from './event-daily'
import hypocenter from './hypocenter'
import seismicity from './seismicity'
import seismicityCluster from './seismicity/seismicity-cluster'
import rsam from './rsam'

export default {
  namespaced: true,
  modules: {
    namespaced: true,
    cluster,
    bulletin,
    energy,
    equivalentEnergy,
    eventDaily,
    hypocenter,
    seismicity,
    seismicityCluster,
    rsam,
  },
}
