import moment from 'moment'
import axios from 'axios'
import { calculatePeriod } from '@/utils/datetime'
import { DATETIME_FORMAT, DateRangeTypes } from '@/constants/date'
import client from '@/utils/client'
import annotations from '@/components/event-annotation/annotations'

import {
  SET_DATA,
  SET_END_TIME,
  SET_ERROR,
  SET_LAST_UPDATED,
  SET_START_TIME,
  SET_CANCEL_TOKEN,
} from '../base/mutations'
import { baseState, baseMutations, baseActions } from '../base'
import rangeSelector from './range-selector-minute'

// Mutations.
export const SET_SAMPLING = 'SET_SAMPLING'
export const SET_STATION = 'SET_STATION'
export const SET_AREAS = 'SET_AREAS'
export const SET_VISIBLE = 'SET_VISIBLE'
export const SET_SKY_FILTER = 'SET_SKY_FILTER'
export const SET_AUTO_UPDATE = 'SET_AUTO_UPDATE'

// Actions.
export const FETCH_THERMAL_AXIS = 'FETCH_THERMAL_AXIS'
export const UPDATE_THERMAL_AXIS = 'UPDATE_THERMAL_AXIS'

// Initial state.
export const initialState = {
  ...baseState,
  annotationOptions: annotations,
  sampling: 'minute',
  autoUpdate: true,
  station: 'babadan',
}

export const initState = (station, period) => {
  const { startTime, endTime } = calculatePeriod(period)
  return {
    ...initialState,
    period,
    startTime,
    endTime,
    station,
    areas: [],
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
  [SET_AUTO_UPDATE](state, autoUpdate) {
    state.autoUpdate = autoUpdate
  },
  [SET_AREAS](state, areas) {
    if (!state.areas.length) {
      state.areas = areas
    }

    const existingAreasMap = state.areas.reduce((map, area) => {
      map[area.name] = area
      return map
    }, {})

    state.areas = areas.map((newArea) => {
      const existingArea = existingAreasMap[newArea.name]
      return {
        ...newArea,
        isVisible: existingArea ? existingArea.isVisible : true,
      }
    })
  },
  [SET_VISIBLE](state, { index, isVisible }) {
    state.areas[index].isVisible = isVisible
  },
}

export const actions = {
  ...baseActions,
  async [FETCH_THERMAL_AXIS]({ commit, state }) {
    if (state.cancelToken !== null) {
      state.cancelToken.cancel('Operation canceled due to new request')
    }

    commit(SET_CANCEL_TOKEN, axios.CancelToken.source())

    if (state.error) {
      commit(SET_ERROR, null)
    }

    const data = await client
      .get(`/thermal-axis-bbd/`, {
        params: {
          start: state.startTime.format(DATETIME_FORMAT),
          end: state.endTime.format(DATETIME_FORMAT),
          sampling: state.sampling,
          field_types: ['max_temp', 'avg_temp'].join(','),
        },
        cancelToken: state.cancelToken.token,
      })
      .then((response) => {
        return response.data
      })
      .catch((error) => {
        commit(SET_ERROR, error)
        return []
      })

    commit(SET_DATA, data)
    commit(
      SET_AREAS,
      data.areas.map((area) => ({
        ...area,
        isVisible: true,
      }))
    )
    commit(SET_LAST_UPDATED, moment())
  },

  async [UPDATE_THERMAL_AXIS]({ dispatch, commit, state }) {
    if (state.period.type === DateRangeTypes.CUSTOM) {
      return dispatch(FETCH_THERMAL_AXIS)
    } else {
      const { startTime, endTime } = calculatePeriod(state.period)
      commit(SET_START_TIME, startTime)
      commit(SET_END_TIME, endTime)
      return dispatch(FETCH_THERMAL_AXIS)
    }
  },
}

export const initModule = (station, period) => {
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
    babadan: initModule('babadan', rangeSelector[3]),
  },
}
