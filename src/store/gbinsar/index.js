import moment from 'moment'
import client from '@/utils/client'
import { calculatePeriod } from '@/utils/datetime'
import { DATETIME_FORMAT, DateRangeTypes } from '@/constants/date'
import annotations from '@/components/event-annotation/annotations'
import {
  SET_DATA,
  SET_END_TIME,
  SET_ERROR,
  SET_LAST_UPDATED,
  SET_START_TIME,
} from '../base/mutations'
import { baseState, baseMutations, baseActions } from '../base'
import rangeSelectorDay from './range-selector-day'

// Mutations.
export const SET_SAMPLING = 'SET_SAMPLING'
export const SET_TYPE = 'SET_TYPE'

// Actions.
export const FETCH_GBINSAR = 'FETCH_GBINSAR'
export const UPDATE_GBINSAR = 'UPDATE_GBINSAR'

// Initial state.
export const initialState = {
  ...baseState,
  annotationOptions: annotations,
  sampling: 'day',
  type: 'babadanarea',
}

export const initState = (type, period) => {
  const { startTime, endTime } = calculatePeriod(period)

  return {
    ...initialState,
    type,
    period,
    startTime,
    endTime,
  }
}

// Getters.
const getters = {}

// Mutations.
const mutations = {
  ...baseMutations,
  [SET_SAMPLING](state, sampling) {
    state.sampling = sampling
  },
  [SET_TYPE](state, type) {
    state.type = type
  },
}

// Actions.
const actions = {
  ...baseActions,
  async [FETCH_GBINSAR]({ commit, state }) {
    commit(SET_ERROR, null)

    const { startTime, endTime } = state
    const params = {
      start: startTime.format(DATETIME_FORMAT),
      end: endTime.format(DATETIME_FORMAT),
      sampling: state.sampling,
    }

    try {
      const { data } = await client.get(`/gbinsar/${state.type}/`, { params })
      commit(SET_DATA, data)
      commit(SET_LAST_UPDATED, moment())
    } catch (error) {
      commit(SET_ERROR, error)
    }
  },

  async [UPDATE_GBINSAR]({ dispatch, commit, state }) {
    if (state.period.type === DateRangeTypes.CUSTOM) {
      return dispatch(FETCH_GBINSAR)
    } else {
      const { startTime, endTime } = calculatePeriod(state.period)
      commit(SET_START_TIME, startTime)
      commit(SET_END_TIME, endTime)
      return dispatch(FETCH_GBINSAR)
    }
  },
}

export const initModule = (type, period) => {
  return {
    namespaced: true,
    state: initState(type, period),
    getters,
    mutations,
    actions,
  }
}

export default {
  namespaced: true,
  modules: {
    namespaced: true,
    babadanarea: initModule('babadanarea', rangeSelectorDay[2]),
    babadanpoint: initModule('babadanpoint', rangeSelectorDay[2]),
  },
}
