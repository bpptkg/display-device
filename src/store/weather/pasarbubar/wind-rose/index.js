import moment from 'moment'
import axios from 'axios'

import client from '@/utils/client'
import { calculatePeriod } from '@/utils/datetime'
import { DATETIME_FORMAT, DateRangeTypes } from '@/constants/date'

import {
  SET_DATA,
  SET_END_TIME,
  SET_ERROR,
  SET_LAST_UPDATED,
  SET_START_TIME,
  SET_CANCEL_TOKEN,
} from '../../../base/mutations'
import { baseState, baseMutations } from '../../../base'
import { FETCH_WIND_ROSE, UPDATE_WIND_ROSE } from './actions'
import rangeSelector from '../rainfall/range-selector'

export const NAMESPACE = 'weather/pasarbubar/windRose'

export const initialState = {
  ...baseState,
  data: {},
}

export const initState = (period) => {
  const { startTime, endTime } = calculatePeriod(period)

  return {
    ...initialState,
    period,
    startTime,
    endTime,
  }
}

export const getters = {
  windRose(state) {
    if (state.data.data) {
      return state.data.data
    } else {
      return []
    }
  },
  windSpeedBins(state) {
    if (state.data.wind_speed_bins) {
      return state.data.wind_speed_bins
    } else {
      return []
    }
  },
}

export const mutations = {
  ...baseMutations,
}

export const actions = {
  async [FETCH_WIND_ROSE]({ commit, state }) {
    if (state.cancelToken !== null) {
      state.cancelToken.cancel('Operation canceled due to new request')
    }

    commit(SET_CANCEL_TOKEN, axios.CancelToken.source())

    if (state.error) {
      commit(SET_ERROR, null)
    }

    const data = await client
      .get('/meteorology/windrose/', {
        params: {
          timestamp__gte: state.startTime.format(DATETIME_FORMAT),
          timestamp__lt: state.endTime.format(DATETIME_FORMAT),
          nolimit: true,
          bins: 8,
          sector: 16,
          normed: true,
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
  async [UPDATE_WIND_ROSE]({ dispatch, commit, state }) {
    if (state.period.type === DateRangeTypes.CUSTOM) {
      return dispatch(FETCH_WIND_ROSE)
    } else {
      const { startTime, endTime } = calculatePeriod(state.period)
      commit(SET_START_TIME, startTime)
      commit(SET_END_TIME, endTime)
      return dispatch(FETCH_WIND_ROSE)
    }
  },
}

const defaultPeriod = rangeSelector[1]

export default {
  namespaced: true,
  state: initState(defaultPeriod),
  getters,
  mutations,
  actions,
}
