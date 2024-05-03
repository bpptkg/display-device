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
import rangeSelector from './range-selector-minute'
import { Points } from '../../components/echarts/chart-options/gbinsar/babadanpoint'
import { Areas } from '../../components/echarts/chart-options/gbinsar/babadanarea'

// Mutations.
export const SET_SAMPLING = 'SET_SAMPLING'
export const SET_TYPE = 'SET_TYPE'
export const SET_VISIBLE = 'SET_VISIBLE'
export const SET_AUTO_UPDATE = 'SET_AUTO_UPDATE'

// Actions.
export const FETCH_GBINSAR = 'FETCH_GBINSAR'
export const UPDATE_GBINSAR = 'UPDATE_GBINSAR'

// Initial state.
export const initialState = {
  ...baseState,
  annotationOptions: annotations,
  sampling: 'minute',
  series: [],
  type: 'babadanarea',
  autoUpdate: true,
}

export const initState = (type, series, period) => {
  const { startTime, endTime } = calculatePeriod(period)

  return {
    ...initialState,
    type,
    series: series.map((item) => ({ ...item, isVisible: true })),
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
  [SET_VISIBLE](state, { index, isVisible }) {
    state.series[index].isVisible = isVisible
  },
  [SET_AUTO_UPDATE](state, autoUpdate) {
    state.autoUpdate = autoUpdate
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

export const initModule = (type, series, period) => {
  return {
    namespaced: true,
    state: initState(type, series, period),
    getters,
    mutations,
    actions,
  }
}

export default {
  namespaced: true,
  modules: {
    namespaced: true,
    babadanarea: initModule('babadanarea', Areas, rangeSelector[0]),
    babadanpoint: initModule('babadanpoint', Points, rangeSelector[0]),
  },
}
