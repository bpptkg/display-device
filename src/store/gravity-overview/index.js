import { DATE_FORMAT } from '../../constants/date'
import client from '../../utils/client'
import rangeSelector from './range-selector'
import { calculatePeriod } from '../../utils/datetime'

export const SET_PERIOD = 'SET_PERIOD'
export const SET_START_TIME = 'SET_START_TIME'
export const SET_END_TIME = 'SET_END_TIME'
export const SET_DATA = 'SET_DATA'
export const SET_ERROR = 'SET_ERROR'
export const FETCH_GRAVITY_TIMESERIES = 'FETCH_GRAVITY_TIMESERIES'
export const SET_VISIBLE = 'SET_VISIBLE'
export const NAMESPACE = 'gravityOverview'
const initialState = {
  period: null,
  data: [],
  error: null,
  startTime: null,
  endTime: null,
  series: {},
}

export const initState = (period) => {
  const { startTime, endTime } = calculatePeriod(period)
  return { ...initialState, period, startTime, endTime }
}

export const getters = {}

export const mutations = {
  [SET_PERIOD](state, period) {
    state.period = period
  },
  [SET_DATA](state, data) {
    state.data = data
  },
  [SET_ERROR](state, error) {
    state.error = error
  },
  [SET_START_TIME](state, value) {
    state.startTime = value
  },
  [SET_END_TIME](state, value) {
    state.endTime = value
  },
  [SET_VISIBLE](state, { id, isVisible }) {
    state.series[id] = isVisible
  },
}

export const actions = {
  async [FETCH_GRAVITY_TIMESERIES]({ commit, state }) {
    commit(SET_ERROR, null)
    const data = await client
      .get('/gravity/timeseries/', {
        params: {
          start: state.startTime.format(DATE_FORMAT),
          end: state.endTime.format(DATE_FORMAT),
        },
      })
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
  state: initState(rangeSelector[0]),
  getters,
  mutations,
  actions,
}
