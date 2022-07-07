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
import { SET_STATION } from './mutations'
import { FETCH_THERMAL, UPDATE_THERMAL } from './actions'
import rangeSelector from './range-selector'

export const initialState = {
  ...baseState,
  annotationOptions: annotations,
  station: '',
  areas: [],
}

export const KALIURANG = [
  {
    id: 'kal-kubah-bd',
    name: 'Kubah BD',
  },
  {
    id: 'kal-asap',
    name: 'Asap',
  },
  {
    id: 'kal-gendol',
    name: 'Gendol',
  },
  {
    id: 'kal-boyong',
    name: 'Boyong',
  },
  {
    id: 'kal-krasak',
    name: 'Krasak',
  },
  {
    id: 'kal-bebeng',
    name: 'Bebeng',
  },
]

export const BABADAN = [
  {
    id: 'baba-kubah-bd',
    name: 'Kubah BD',
  },
  {
    id: 'baba-asap',
    name: 'Asap',
  },
  {
    id: 'baba-barat-laut',
    name: 'Barat Laut',
  },
]

export const AREAS_STATION_MAP = {
  kaliurang: KALIURANG,
  babadan: BABADAN,
}

export const initState = (station, areas, period) => {
  const { startTime, endTime } = calculatePeriod(period)
  return {
    ...initialState,
    station,
    period,
    startTime,
    endTime,
    areas,
  }
}

export const state = () => {
  return { ...initialState }
}

export const getters = {}

export const mutations = {
  ...baseMutations,
  [SET_STATION](state, station) {
    state.station = station
  },
}

export const actions = {
  ...baseActions,
  async [FETCH_THERMAL]({ commit, state }) {
    if (state.cancelToken !== null) {
      state.cancelToken.cancel('Operation canceled due to new request')
    }

    commit(SET_CANCEL_TOKEN, axios.CancelToken.source())

    if (state.error) {
      commit(SET_ERROR, null)
    }

    const requests = state.areas.map((area) => {
      return client.get('/thermal2/', {
        params: {
          timestamp__gte: state.startTime.format(DATETIME_FORMAT),
          timestamp__lt: state.endTime.format(DATETIME_FORMAT),
          area: area.id,
          nolimit: true,
          fields: 'timestamp,temperature,density',
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

  async [UPDATE_THERMAL]({ dispatch, commit, state }) {
    if (state.period.type === DateRangeTypes.CUSTOM) {
      return dispatch(FETCH_THERMAL)
    } else {
      const { startTime, endTime } = calculatePeriod(state.period)
      commit(SET_START_TIME, startTime)
      commit(SET_END_TIME, endTime)
      return dispatch(FETCH_THERMAL)
    }
  },
}

export const defaultPeriod = rangeSelector[0]

export const initModule = (station, period = defaultPeriod) => {
  return {
    namespaced: true,
    state: initState(station, AREAS_STATION_MAP[station], period),
    getters,
    mutations,
    actions,
  }
}

export default {
  namespaced: true,
  modules: {
    kaliurang: initModule('kaliurang'),
    babadan: initModule('babadan'),
  },
}
