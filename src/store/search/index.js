import { SET_SEARCH_OPEN } from './mutations'

export const NAMESPACE = 'search'

export const state = {
  isSearchOpen: false,
}

export const getters = {}

export const mutations = {
  [SET_SEARCH_OPEN](state, value) {
    state.isSearchOpen = value
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
