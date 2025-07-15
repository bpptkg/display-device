import Vue from 'vue'
import Vuex from 'vuex'

import edm from './edm'
import gbinsar from './gbinsar'
import geochemistry from './geochemistry'
import gps from './gps'
import helicorder from './helicorder'
import home from './home'
import lavaDome from './lava-domes'
import pageLoader from './loader'
import magnetic from './magnetic'
import observation from './observation'
import rainfallCatalog from './rainfall-catalog'
import rainfallDaily from './rainfall-daily'
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
import thermalAxisBbd from './thermal-axis-bbd'
import thermalAxisDel from './thermal-axis-del'
import thermalAxisJrg from './thermal-axis-jrg'
import thermalAxisKal from './thermal-axis-kal'
import tiltmeter from './tiltmeter'
import user from './user'
import version from './version'
import visual from './visual'
import weather from './weather'

import infographic from '@/lib/infographic/store'
import modeling from '@/lib/modeling/store'
import gravity from './gravity'
import gravityOverview from './gravity-overview'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    edm,
    gbinsar,
    geochemistry,
    gps,
    gravity,
    gravityOverview,
    helicorder,
    home,
    infographic,
    lavaDome,
    magnetic,
    modeling,
    observation,
    pageLoader,
    rainfallCatalog,
    rainfallDaily,
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
    thermalAxisBbd,
    thermalAxisDel,
    thermalAxisJrg,
    thermalAxisKal,
    tiltmeter,
    user,
    version,
    visual,
    weather,
  },
})
