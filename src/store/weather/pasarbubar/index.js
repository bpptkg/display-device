import latestRecord from './latest-record'
import windRose from './wind-rose'
import rainfall from './rainfall'

export default {
  namespaced: true,
  modules: {
    namespaced: true,
    latestRecord,
    windRose,
    rainfall,
  },
}
