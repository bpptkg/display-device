import client from '../../utils/client'

export const SET_DATA = 'SET_DATA'
export const SET_ERROR = 'SET_ERROR'
export const FETCH_GRAVITY_TIMESERIES = 'FETCH_GRAVITY_TIMESERIES'
export const NAMESPACE = 'gravityOverview'
const initialState = {
  data: [],
  error: null,
}

export const state = () => {
  return { ...initialState }
}

export const getters = {}

export const mutations = {
  [SET_DATA](state, data) {
    state.data = data
  },
  [SET_ERROR](state, error) {
    state.error = error
  },
}

export const actions = {
  async [FETCH_GRAVITY_TIMESERIES]({ commit }) {
    commit(SET_ERROR, null)
    const data = await client
      .get('/gravity/timeseries/')
      .then((response) => response.data)
      .catch((error) => {
        commit(SET_ERROR, error)
        return []
      })
    commit(SET_DATA, data)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
