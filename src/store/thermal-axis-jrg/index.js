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
  station: 'jurangjero',
  areas: [],
  use_sky_filter: false,
  autoUpdate: true,
}

export const AREAS = [
  // Max temperature.
  {
    id: 'asap',
    name: 'Asap (max)',
    isVisible: true,
    fieldType: 'max_temp',
  },
  {
    id: 'bebeng',
    name: 'Bebeng (max)',
    isVisible: true,
    fieldType: 'max_temp',
  },
  {
    id: 'boyong',
    name: 'Boyong (max)',
    isVisible: true,
    fieldType: 'max_temp',
  },
  {
    id: 'krasak',
    name: 'Krasak (max)',
    isVisible: true,
    fieldType: 'max_temp',
  },
  {
    id: 'kubah-bd',
    name: 'Kubah BD (max)',
    isVisible: true,
    fieldType: 'max_temp',
  },
  {
    id: 'kubah-bd-kanan',
    name: 'Kubah BD Kanan (max)',
    isVisible: true,
    fieldType: 'max_temp',
  },
  {
    id: 'sat-1',
    name: 'Sat 1 (max)',
    isVisible: true,
    fieldType: 'max_temp',
  },
  {
    id: 'sat-2',
    name: 'Sat 2 (max)',
    isVisible: true,
    fieldType: 'max_temp',
  },
  // Average temperature.
  {
    id: 'asap',
    name: 'Asap (avg)',
    isVisible: true,
    fieldType: 'avg_temp',
  },
  {
    id: 'bebeng',
    name: 'Bebeng (avg)',
    isVisible: true,
    fieldType: 'avg_temp',
  },
  {
    id: 'boyong',
    name: 'Boyong (avg)',
    isVisible: true,
    fieldType: 'avg_temp',
  },
  {
    id: 'krasak',
    name: 'Krasak (avg)',
    isVisible: true,
    fieldType: 'avg_temp',
  },
  {
    id: 'kubah-bd',
    name: 'Kubah BD (avg)',
    isVisible: true,
    fieldType: 'avg_temp',
  },
  {
    id: 'kubah-bd-kanan',
    name: 'Kubah BD Kanan (avg)',
    isVisible: true,
    fieldType: 'avg_temp',
  },
  {
    id: 'sat-1',
    name: 'Sat 1 (avg)',
    isVisible: true,
    fieldType: 'avg_temp',
  },
  {
    id: 'sat-2',
    name: 'Sat 2 (avg)',
    isVisible: true,
    fieldType: 'avg_temp',
  },
]

export const initState = (station, areas, period) => {
  const { startTime, endTime } = calculatePeriod(period)
  return {
    ...initialState,
    period,
    startTime,
    endTime,
    station,
    areas,
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
  [SET_STATION](state, station) {
    state.station = station
  },
  [SET_AREAS](state, areas) {
    state.areas = areas
  },
  [SET_VISIBLE](state, { index, isVisible }) {
    state.areas[index].isVisible = isVisible
  },
  [SET_SKY_FILTER](state, use_sky_filter) {
    state.use_sky_filter = use_sky_filter
  },
  [SET_AUTO_UPDATE](state, autoUpdate) {
    state.autoUpdate = autoUpdate
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

    const requests = state.areas.map((area) => {
      return client.get(`/thermal-axis-jrg/`, {
        params: {
          start: state.startTime.format(DATETIME_FORMAT),
          end: state.endTime.format(DATETIME_FORMAT),
          sampling: state.sampling,
          area: area.id,
          field_type: area.fieldType || 'max_temp',
        },
        cancelToken: state.cancelToken.token,
      })
    })

    const data = await Promise.all(requests)
      .then((responses) => {
        return responses.map((response) => response.data)
      })
      .catch((error) => {
        commit(SET_ERROR, error)
        return []
      })

    commit(SET_DATA, data)
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
    state: initState(station, AREAS, period),
    getters,
    mutations,
    actions,
  }
}

export default {
  namespaced: true,
  modules: {
    namespaced: true,
    jurangjero: initModule('jurangjero', rangeSelector[3]),
  },
}
