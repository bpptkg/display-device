import { SHOW_PAGE_LOADER, HIDE_PAGE_LOADER } from './actions'

export const NAMESPACE = 'pageLoader'
export const state = {}
export const getters = {}
export const mutations = {}
export const actions = {
  async [SHOW_PAGE_LOADER](context) {
    document.getElementById('page-loader').style.display = 'flex'
  },
  async [HIDE_PAGE_LOADER](content) {
    document.getElementById('page-loader').style.display = 'none'
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
