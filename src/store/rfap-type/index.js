import _ from 'lodash'
import moment from 'moment'

import client from '@/utils/client'
import { DATETIME_FORMAT, DateRangeTypes } from '@/constants/date'
import { calculatePeriod } from '@/utils/datetime'

import { Sampling } from '@/constants/rfap-distance'

import {
  SET_DATA,
  SET_END_TIME,
  SET_ERROR,
  SET_LAST_UPDATED,
  SET_START_TIME,
} from '../base/mutations'
import { baseState, baseMutations, baseActions } from '../base'
import { SET_SAMPLING } from '../base/mutations'
import { FETCH_DATA, UPDATE_DATA } from '../base/actions'
import { TOGGLE_RFAP_TYPE } from './mutations'

import rangeSelector from '../rfap-direction/range-selector'

export const NAMESPACE = 'rfapType'

export const initialState = {
  ...baseState,
  sampling: Sampling.DAY,
  rfapTypes: [
    {
      value: 1,
      text: 'Terlihat',
      selected: false,
      tooltip: 'Guguran yang hanya terlihat',
    },
    {
      value: 2,
      text: 'Terdengar',
      selected: false,
      tooltip: 'Guguran yang hanya terdengar',
    },
    {
      value: 3,
      text: 'Terlihat & Terdengar',
      selected: false,
      tooltip: 'Guguran yang terlihat dan terdengar',
    },
  ],
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

export const getters = {
  isRfapTypeSelected(state) {
    return state.rfapTypes.some((obj) => obj.selected === true)
  },
}

export const mutations = {
  ...baseMutations,
  [SET_SAMPLING](state, sampling) {
    state.sampling = sampling
  },
  [TOGGLE_RFAP_TYPE](state, value) {
    const index = state.rfapTypes.findIndex((obj) => obj.value === value)
    if (index !== -1) {
      state.rfapTypes[index].selected = !state.rfapTypes[index].selected
    }
  },
}

export const actions = {
  ...baseActions,
  async [FETCH_DATA]({ commit, state, getters }) {
    if (state.error) {
      commit(SET_ERROR, null)
    }

    const data = await client
      .get('/rfap-type/', {
        params: {
          start: state.startTime.format(DATETIME_FORMAT),
          end: state.endTime.format(DATETIME_FORMAT),
          sampling: state.sampling,
          type: getters.isRfapTypeSelected
            ? state.rfapTypes
                .filter((v) => v.selected)
                .map((v) => v.value)
                .join(',')
            : '',
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
