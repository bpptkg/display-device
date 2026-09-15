import moment from 'moment'
import client from '@/utils/client'
import { calculatePeriod } from '@/utils/datetime'
import { DATE_FORMAT, DateRangeTypes } from '@/constants/date'
import annotations from '@/components/event-annotation/annotations'

import {
  SET_DATA,
  SET_END_TIME,
  SET_ERROR,
  SET_LAST_UPDATED,
  SET_START_TIME,
} from '../base/mutations'
import { baseState, baseMutations, baseActions } from '../base'

import rangeSelector from './range-selector'

export const NAMESPACE = 'gravityOverview'
export const FETCH_GRAVITY = 'fetchGravity'
export const UPDATE_GRAVITY = 'updateGravity'

export const initialState = {
  ...baseState,
  annotationOptions: annotations,
}

export const initState = (period) => {
  const { startTime, endTime } = calculatePeriod(period)
  return { ...initialState, period, startTime, endTime }
}

export const getters = {}

export const mutations = {
  ...baseMutations,
}

export const actions = {
  ...baseActions,
  async [FETCH_GRAVITY]({ commit, state }) {
    if (state.error) {
      commit(SET_ERROR, null)
    }

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
    commit(SET_LAST_UPDATED, moment())
  },
  async [UPDATE_GRAVITY]({ dispatch, commit, state }) {
    if (state.period.type === DateRangeTypes.CUSTOM) {
      return dispatch(FETCH_GRAVITY)
    } else {
      const { startTime, endTime } = calculatePeriod(state.period)
      commit(SET_START_TIME, startTime)
      commit(SET_END_TIME, endTime)
      return dispatch(FETCH_GRAVITY)
    }
  },
}

export default {
  namespaced: true,
  state: initState(rangeSelector[0]),
  getters,
  mutations,
  actions,
}
