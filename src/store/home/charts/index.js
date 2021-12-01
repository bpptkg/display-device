import edm from './edm'
import gps from './gps'
import seismicity from './seismicity'
import tiltmeter from './tiltmeter'
import weather from './weather'

export default {
  namespaced: true,
  modules: {
    edm,
    gps,
    seismicity,
    tiltmeter,
    weather,
  },
}
