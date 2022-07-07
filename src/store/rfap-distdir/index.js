import _ from 'lodash'
import moment from 'moment'
import axios from 'axios'

import client from '../../utils/client'
import { DATETIME_FORMAT, DateRangeTypes } from '../../constants/date'
import { calculatePeriod } from '../../utils/datetime'

import { Sampling } from '../../constants/rfap-distance'

import {
  SET_DATA,
  SET_END_TIME,
  SET_ERROR,
  SET_LAST_UPDATED,
  SET_START_TIME,
  SET_CANCEL_TOKEN,
} from '../base/mutations'
import { baseState, baseMutations, baseActions } from '../base'
import { SET_SAMPLING } from '../base/mutations'
import { FETCH_DATA, UPDATE_DATA } from '../base/actions'

import rangeSelector from '../rfap-direction/range-selector'

export const NAMESPACE = 'rfapDistdir'

export const initialState = {
  ...baseState,
  sampling: Sampling.DAY,
}

export const initState = (period) => {
  const { startTime, endTime } = calculatePeriod(period)

  return {
    ...initialState,
    endTime,
    startTime,
    period,
  }
}

export const state = () => {
  return { ...initialState }
}

export const getters = {}

export const mutations = {
  ...baseMutations,
  [SET_SAMPLING](state, sampling) {
    state.sampling = sampling
  },
}

export const actions = {
  ...baseActions,
  async [FETCH_DATA]({ commit, state }) {
    if (state.cancelToken !== null) {
      state.cancelToken.cancel('Operation canceled due to new request')
    }

    commit(SET_CANCEL_TOKEN, axios.CancelToken.source())

    if (state.error) {
      commit(SET_ERROR, null)
    }

    const data = await client
      .get('/rfap-distdir/', {
        params: {
          start: state.startTime.format(DATETIME_FORMAT),
          end: state.endTime.format(DATETIME_FORMAT),
          sampling: state.sampling,
        },
        cancelToken: state.cancelToken.token,
      })
      .then((response) => response.data)
      .catch((error) => {
        commit(SET_ERROR, error)
        return []
      })

    commit(SET_DATA, data)
    commit(SET_LAST_UPDATED, moment())
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

const defaultPeriod = rangeSelector[2]

export default {
  namespaced: true,
  state: initState(defaultPeriod),
  getters,
  mutations,
  actions,
}
