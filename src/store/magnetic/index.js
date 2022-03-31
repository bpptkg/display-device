import moment from 'moment'
import { DateRangeTypes, DATETIME_FORMAT } from '../../constants/date'
import client from '../../utils/client'
import { calculatePeriod } from '../../utils/datetime'
import { baseActions, baseMutations, baseState } from '../base'
import {
  SET_DATA,
  SET_END_TIME,
  SET_ERROR,
  SET_LAST_UPDATED,
  SET_START_TIME,
} from '../base/mutations'
import { SET_STATION } from './mutations'
import { FETCH_MAGNETIC, UPDATE_MAGNETIC } from './actions'
import rangeSelector from './range-selector'

export const initialState = {
  ...baseState,
  station: '',
}

export const initState = (station, period) => {
  const { startTime, endTime } = calculatePeriod(period)

  return {
    ...initialState,
    station,
    period,
    startTime,
    endTime,
  }
}

export const state = () => {
  return { ...initialState }
}

export const getters = {}

export const mutations = {
  ...baseMutations,
  [SET_STATION](state, station) {
    state.station = station
  },
}

export const actions = {
  ...baseActions,
  async [FETCH_MAGNETIC]({ commit, state }) {
    if (state.error) {
      commit(SET_ERROR, null)
    }

    const data = await client
      .get('/magnetic/imogiri/', {
        params: {
          timestamp__gte: state.startTime.format(DATETIME_FORMAT),
          timestamp__lt: state.endTime.format(DATETIME_FORMAT),
          nolimit: true,
        },
      })
      .then((response) => response.data)
      .catch((error) => {
        commit(SET_ERROR, error)
        return []
      })

    commit(SET_DATA, data)
    commit(SET_LAST_UPDATED, moment())
  },
  async [UPDATE_MAGNETIC]({ dispatch, commit, state }) {
    if (state.period.type == DateRangeTypes.CUSTOM) {
      return dispatch(FETCH_MAGNETIC)
    } else {
      const { startTime, endTime } = calculatePeriod(state.period)
      commit(SET_START_TIME, startTime)
      commit(SET_END_TIME, endTime)
      return dispatch(FETCH_MAGNETIC)
    }
  },
}

export const defaultPeriod = rangeSelector[0]

export const initModule = (station, period = defaultPeriod) => {
  return {
    namespaced: true,
    state: initState(station, period),
    getters,
    mutations,
    actions,
  }
}

export default {
  namespaced: true,
  modules: {
    namespaced: true,
    imogiri: initModule('imogiri'),
  },
}
