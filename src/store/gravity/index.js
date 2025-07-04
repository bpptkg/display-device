import client from '../../utils/client'

export const SET_G1 = 'SET_G1'
export const SET_G2 = 'SET_G2'
export const SET_DATA = 'SET_DATA'
export const SET_PERIODS = 'SET_PERIODS'
export const SET_ERROR = 'SET_ERROR'
export const SET_ISLOADING = 'SET_ISLOADING'

export const FETCH_GRAVITY_ITEMS = 'FETCH_GRAVITY_ITEMS'
export const FETCH_GRAVITY_PERIODS = 'FETCH_GRAVITY_PERIODS'

export const NAMESPACE = 'gravity'

const initialState = {
  g1: '',
  g2: '',
  periods: [],
  data: {
    g1: [],
    g2: [],
    dcba: [],
  },
  error: null,
}

export const state = () => {
  return { ...initialState }
}

export const getters = {
  isPeriodValid: (state) => {
    return state.g1 && state.g2
  },
}

export const mutations = {
  [SET_G1](state, g1) {
    state.g1 = g1
  },
  [SET_G2](state, g2) {
    state.g2 = g2
  },
  [SET_PERIODS](state, periods) {
    state.periods = periods.sort((a, b) => {
      return new Date(b.period) - new Date(a.period)
    })
  },
  [SET_DATA](state, data) {
    state.data = data
  },
  [SET_ERROR](state, error) {
    state.error = error
  },
}

export const actions = {
  async [FETCH_GRAVITY_ITEMS]({ commit, state }) {
    const data = await client
      .get('/gravity/items/', {
        params: {
          g1: state.g1,
          g2: state.g2,
        },
      })
      .then((response) => response.data)
      .catch((error) => {
        commit(SET_ERROR, error)
        return {}
      })

    commit(SET_DATA, data)
  },
  async [FETCH_GRAVITY_PERIODS]({ commit }) {
    const periods = await client
      .get('/gravity/periods/')
      .then((response) => response.data)
      .catch((error) => {
        commit(SET_ERROR, error)
        return []
      })

    commit(SET_PERIODS, periods)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
