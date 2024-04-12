import client from '@/utils/client'
import axios from 'axios'
import moment from 'moment'
import { calculatePeriod } from '@/utils/datetime'
import { DATETIME_FORMAT, DateRangeTypes } from '@/constants/date'

import {
  SET_DATA,
  SET_END_TIME,
  SET_ERROR,
  SET_LAST_UPDATED,
  SET_START_TIME,
  SET_CANCEL_TOKEN,
} from '../base/mutations'
import { baseState, baseMutations } from '../base'

import rangeSelector from './range-selector'

// Mutations.
export const SET_STATION = 'SET_STATION'

// Actions.
export const FETCH_DATA = 'FETCH_DATA'
export const UPDATE_DATA = 'UPDATE_DATA'

export const initialState = {
  ...baseState,
  station: '',
}

export const mutations = {
  ...baseMutations,
  [SET_STATION](state, station) {
    state.station = station
  },
  [SET_ERROR](state, error) {
    state.error = error
  },
}

export const actions = {
  async [FETCH_DATA]({ commit, state }) {
    if (state.cancelToken !== null) {
      state.cancelToken.cancel('Operation canceled due to new request')
    }

    commit(SET_CANCEL_TOKEN, axios.CancelToken.source())

    if (state.error) {
      commit(SET_ERROR, null)
    }

    await client
      .get('/rainfall-catalog/catalogs/', {
        params: {
          station: state.station,
          start: state.startTime.format(DATETIME_FORMAT),
          end: state.endTime.format(DATETIME_FORMAT),
        },
        cancelToken: state.cancelToken.token,
      })
      .then((response) => {
        commit(SET_DATA, response.data)
        commit(SET_LAST_UPDATED, moment())
      })
      .catch((error) => {
        commit(SET_ERROR, error)
      })
  },

  async [UPDATE_DATA]({ dispatch, commit, state }) {
    if (state.period.type === DateRangeTypes.CUSTOM) {
      return dispatch(FETCH_DATA)
    } else {
      const { startTime, endTime } = calculatePeriod(state.period)
      commit(SET_START_TIME, startTime)
      commit(SET_END_TIME, endTime)
      return dispatch(FETCH_DATA)
    }
  },
}

export const initState = (period, station) => {
  const { startTime, endTime } = calculatePeriod(period)

  return {
    ...initialState,
    startTime,
    endTime,
    station,
    period,
  }
}

export const defaultPeriod = rangeSelector[0]

export default {
  namespaced: true,
  state: initState(defaultPeriod, 'pasarbubar'),
  mutations,
  actions,
}
