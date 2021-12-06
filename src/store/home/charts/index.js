import edm from './edm'
import gps from './gps'
import helicorder from './helicorder'
import lavaDome from './lavadomes'
import rfapDirection from './rfap-direction'
import seismicity from './seismicity'
import tiltmeter from './tiltmeter'
import weather from './weather'

export default {
  namespaced: true,
  modules: {
    edm,
    gps,
    helicorder,
    lavaDome,
    rfapDirection,
    seismicity,
    tiltmeter,
    weather,
  },
}
