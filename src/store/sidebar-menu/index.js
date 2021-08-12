import { SET_ISCOLLAPSED } from './mutations'
import { TOGGLE_MENU, HIDE_MENU, OPEN_MENU } from './actions'

const initialState = {
  isCollapsed: true,
}

export const state = { ...initialState }

export const mutations = {
  [SET_ISCOLLAPSED](state, isCollapsed) {
    state.isCollapsed = isCollapsed
  },
}

export const actions = {
  [TOGGLE_MENU]({ commit, state }) {
    commit(SET_ISCOLLAPSED, !state.isCollapsed)
  },
  [HIDE_MENU]({ commit }) {
    commit(SET_ISCOLLAPSED, true)
  },
  [OPEN_MENU]({ commit }) {
    commit(SET_ISCOLLAPSED, false)
  },
}

export default {
  state,
  mutations,
  actions,
}
