import moment from 'moment'
import axios from 'axios'

import client from '@/utils/client'
import { DATETIME_FORMAT, DateRangeTypes } from '@/constants/date'
import { calculatePeriod } from '@/utils/datetime'

import {
  SET_DATA,
  SET_END_TIME,
  SET_ERROR,
  SET_LAST_UPDATED,
  SET_START_TIME,
  SET_CANCEL_TOKEN,
} from '../../base/mutations'
import { baseState, baseMutations, baseActions } from '../../base'

import { FETCH_ENERGY, UPDATE_ENERGY } from './actions'
import rangeSelector from './range-selector'

export const NAMESPACE = 'seismic/equivalentEnergy'

export const initialState = {
  ...baseState,
  sampling: '',
}

export const SamplingTypes = Object.freeze({
  DAY: 'day',
  HOUR: 'hour',
})

export const initState = (period, sampling = SamplingTypes.DAY) => {
  const { startTime, endTime } = calculatePeriod(period)

  return {
    ...initialState,
    endTime,
    period,
    startTime,
    sampling,
  }
}

export const state = () => {
  return { ...initialState }
}

export const getters = {}

export const mutations = {
  ...baseMutations,
}

export const actions = {
  ...baseActions,
  async [FETCH_ENERGY]({ commit, state }) {
    if (state.cancelToken !== null) {
      state.cancelToken.cancel('Operation canceled due to new request')
    }

    commit(SET_CANCEL_TOKEN, axios.CancelToken.source())

    if (state.error) {
      commit(SET_ERROR, null)
    }

    const data = await client
      .get('/equivalent-energy/', {
        params: {
          eventdate__gte: state.startTime.format(DATETIME_FORMAT),
          eventdate__lt: state.endTime.format(DATETIME_FORMAT),
          eventtype__in: 'ROCKFALL,AWANPANAS',
          nolimit: true,
          sep: true,
          accumulate: state.sampling,
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

  async [UPDATE_ENERGY]({ dispatch, commit, state }) {
    if (state.period.type === DateRangeTypes.CUSTOM) {
      return dispatch(FETCH_ENERGY)
    } else {
      const { startTime, endTime } = calculatePeriod(state.period)
      commit(SET_START_TIME, startTime)
      commit(SET_END_TIME, endTime)
      return dispatch(FETCH_ENERGY)
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
