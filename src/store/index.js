import Vue from 'vue'
import Vuex from 'vuex'

import edm from './edm'
import gbinsar from './gbinsar'
import geochemistry from './geochemistry'
import gps from './gps'
import helicorder from './helicorder'
import home from './home'
import lavaDome from './lava-domes'
import magnetic from './magnetic'
import observation from './observation'
import pageLoader from './loader'
import rainfallCatalog from './rainfall-catalog'
import rainfallStation from './rainfall-station'
import realtime from './realtime'
import rfapDirection from './rfap-direction'
import rfapDistance from './rfap-distance'
import rfapDistdir from './rfap-distdir'
import rfapType from './rfap-type'
import rsam from './rsam'
import search from './search'
import seismic from './seismic'
import sidebarMenu from './sidebar-menu'
import thermal from './thermal'
import thermalAxis from './thermal-axis'
import tiltmeter from './tiltmeter'
import user from './user'
import version from './version'
import visual from './visual'
import weather from './weather'

import infographic from '@/lib/infographic/store'
import modeling from '@/lib/modeling/store'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    edm,
    gbinsar,
    geochemistry,
    gps,
    helicorder,
    home,
    infographic,
    lavaDome,
    magnetic,
    modeling,
    observation,
    pageLoader,
    rainfallCatalog,
    rainfallStation,
    realtime,
    rfapDirection,
    rfapDistance,
    rfapDistdir,
    rfapType,
    rsam,
    search,
    seismic,
    sidebarMenu,
    thermal,
    thermalAxis,
    tiltmeter,
    user,
    version,
    visual,
    weather,
  },
})
