import moment from 'moment'
import client from '@/utils/cendana-client'

import { SET_USER } from './mutations'
import { UPDATE_USER } from './actions'
import { SET_LAST_UPDATED, SET_ERROR } from '../base/mutations'

export const NAMESPACE = 'user'

export const state = {
  user: {},
  error: null,
  lastUpdated: moment(),
}

export const getters = {
  userPositionName({ user }) {
    if (!user.id) {
      return null
    }
    return user.department_position
      ? user.department_position.name
        ? user.department_position.name
        : null
      : null
  },
}

export const mutations = {
  [SET_USER](state, user) {
    state.user = { ...user }
  },
  [SET_ERROR](state, error) {
    state.error = error
  },
  [SET_LAST_UPDATED](state, lastUpdated) {
    state.lastUpdated = lastUpdated
  },
}

export const actions = {
  async [UPDATE_USER]({ commit, state }) {
    if (state.error) {
      commit(SET_ERROR, null)
    }

    const user = await client
      .get('/user')
      .then((response) => response.data)
      .catch((error) => {
        commit(SET_ERROR, error)
        return {}
      })

    commit(SET_USER, user)
    commit(SET_LAST_UPDATED, moment())
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
