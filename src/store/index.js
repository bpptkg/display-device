import Vue from 'vue'
import Vuex from 'vuex'

import edm from './edm'
import geochemistry from './geochemistry'
import gps from './gps'
import home from './home'
import lavaDome from './lava-domes'
import observation from './observation'
import realtime from './realtime'
import rfapDistance from './rfap-distance'
import rfapDirection from './rfap-direction'
import seismic from './seismic'
import sidebarMenu from './sidebar-menu'
import tiltmeter from './tiltmeter'
import user from './user'
import weather from './weather'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    edm,
    geochemistry,
    gps,
    home,
    lavaDome,
    observation,
    realtime,
    rfapDistance,
    rfapDirection,
    seismic,
    sidebarMenu,
    tiltmeter,
    user,
    weather,
  },
})
