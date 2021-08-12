import { v4 as uuidv4 } from 'uuid'
import moment from 'moment'
import client from '@/utils/client'
import { SET_DATA, SET_ERROR, SET_LAST_UPDATED } from '../../../base/mutations'
import { FETCH_LATEST_RECORD } from './actions'

export const NAMESPACE = 'weather/pasarbubar/latestRecord'

export const initialState = {
  data: {},
  error: null,
  lastUpdated: null,
}

export const state = () => {
  return { ...initialState }
}

const getters = {}

const mutations = {
  [SET_DATA](state, data) {
    state.data = data
  },
  [SET_ERROR](state, error) {
    state.error = error
  },
  [SET_LAST_UPDATED](state, lastUpdated) {
    state.lastUpdated = lastUpdated
  },
}

const actions = {
  async [FETCH_LATEST_RECORD]({ commit, state }) {
    if (state.error) {
      commit(SET_ERROR, null)
    }

    const data = await client
      .get('/meteorology/', {
        params: {
          ordering: '-timestamp',
          limit: 1,
          id: uuidv4(),
        },
      })
      .then((response) => response.data)
      .catch((error) => {
        commit(SET_ERROR, error)
        return {}
      })
    if (data.length > 0) {
      commit(SET_DATA, data[0])
    } else {
      commit(SET_DATA, data)
    }
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
