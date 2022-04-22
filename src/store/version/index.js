import {
  SET_REFRESHING,
  SET_REGISTRATION,
  SET_UPDATE_EXISTS,
} from './mutations'

export const NAMESPACE = 'version'

export const state = {
  refreshing: false,
  registration: null,
  updateExists: false,
}

export const getters = {}

export const mutations = {
  [SET_REFRESHING](state, value) {
    state.refreshing = value
  },
  [SET_REGISTRATION](state, registration) {
    state.registration = registration
  },
  [SET_UPDATE_EXISTS](state, value) {
    state.updateExists = value
  },
}

export const actions = {}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
