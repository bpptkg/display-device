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
export const SET_TYPE = 'SET_TYPE'

// Actions.
export const FETCH_THERMAL_AXIS = 'FETCH_THERMAL_AXIS'
export const UPDATE_THERMAL_AXIS = 'UPDATE_THERMAL_AXIS'

// Initial state.
export const initialState = {
  ...baseState,
  annotationOptions: annotations,
  sampling: 'minute',
  station: 'kaliurang',
}

export const AREAS = [
  {
    id: 'asap',
    name: 'Asap',
  },
  {
    id: 'bebeng',
    name: 'Bebeng',
  },
  {
    id: 'boyong',
    name: 'Boyong',
  },
  {
    id: 'krasak',
    name: 'Krasak',
  },
  {
    id: 'kubah-bd',
    name: 'Kubah BD',
  },
  {
    id: 'kubah-bd-1',
    name: 'Kubah BD 1',
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
      return client.get(`/thermal-axis-kal/`, {
        params: {
          start: state.startTime.format(DATETIME_FORMAT),
          end: state.endTime.format(DATETIME_FORMAT),
          sampling: state.sampling,
          area: area.id,
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
    kaliurang: initModule('kaliurang', rangeSelector[0]),
  },
}
