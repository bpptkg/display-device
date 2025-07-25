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
export const SET_CHANNEL = 'setChannel'

export const initialState = {
  ...baseState,
  sampling: 'day',
  channel: 'ml_VG_MEPSL_00_HHZ',
  channelOptions: [
    { text: 'VG.MEDEL.00.HHZ', value: 'ml_deles' },
    { text: 'VG.MELAB.00.HHZ', value: 'ml_labuhan' },
    { text: 'VG.MEPAS.00.HHZ', value: 'ml_pasarbubar' },
    { text: 'VG.MEPUS.00.EHZ', value: 'ml_pusunglondon' },
    { text: 'VG.MEPSL.00.HHZ', value: 'ml_VG_MEPSL_00_HHZ' },
  ],
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
  [SET_CHANNEL](state, channel) {
    state.channel = channel
  },
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
      .get('/equivalent-energy-rfap/', {
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
