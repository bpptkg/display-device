import Vue from 'vue'
import Vuex from 'vuex'

import edm from './edm'
import geochemistry from './geochemistry'
import gps from './gps'
import helicorder from './helicorder'
import home from './home'
import lavaDome from './lava-domes'
import magnetic from './magnetic'
import observation from './observation'
import pageLoader from './loader'
import realtime from './realtime'
import rfapDistance from './rfap-distance'
import rfapDirection from './rfap-direction'
import rfapDistdir from './rfap-distdir'
import rfapType from './rfap-type'
import seismic from './seismic'
import sidebarMenu from './sidebar-menu'
import tiltmeter from './tiltmeter'
import user from './user'
import weather from './weather'
import version from './version'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    edm,
    geochemistry,
    gps,
    helicorder,
    home,
    lavaDome,
    magnetic,
    observation,
    pageLoader,
    realtime,
    rfapDistance,
    rfapDirection,
    rfapDistdir,
    rfapType,
    seismic,
    sidebarMenu,
    tiltmeter,
    user,
    weather,
    version,
  },
})
