import moment from 'moment'
import Axios from 'axios'

import { SET_USER, SET_CSRF_TOKEN } from './mutations'
import { UPDATE_USER, UPDATE_USER_DATA, GET_CSRF_TOKEN } from './actions'
import { SET_LAST_UPDATED, SET_ERROR } from '../base/mutations'

export const NAMESPACE = 'user'

const client = Axios.create({
  baseURL: process.env.VUE_APP_CENDANA_URL,
})

export const state = {
  user: {},
  csrfToken: null,
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
  [SET_CSRF_TOKEN](state, token) {
    state.csrfToken = token
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
  /**
   * Update user data. If succeed, return current user. Otherwise, throw and
   * error.
   */
  async [UPDATE_USER_DATA]({ commit }) {
    return client
      .get('/user')
      .then(({ data }) => {
        commit(SET_USER, data)
        commit(SET_LAST_UPDATED, moment())
        return data
      })
      .catch((error) => {
        throw error
      })
  },
  /**
   * Fetch CSRF token.
   */
  async [GET_CSRF_TOKEN]({ commit }) {
    const token = await client
      .get('/csrf-token')
      .then(({ data }) => data)
      .catch((error) => null)
    commit(SET_CSRF_TOKEN, token)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
