import edm from './edm'
import gps from './gps'
import seismicity from './seismicity'
import tiltmeter from './tiltmeter'

export default {
  namespaced: true,
  modules: {
    edm,
    gps,
    seismicity,
    tiltmeter,
  },
}
