import { DATETIME_FORMAT, DateRangeTypes } from '@/constants/date'
import client from '@/utils/client'
import { calculatePeriod } from '@/utils/datetime'
import moment from 'moment'

import { baseMutations, baseState } from '../base'
import {
  SET_CANCEL_TOKEN,
  SET_DATA,
  SET_END_TIME,
  SET_ERROR,
  SET_LAST_UPDATED,
  SET_START_TIME,
} from '../base/mutations'

import axios from 'axios'
import { FETCH_RAINFALL, UPDATE_RAINFALL } from './actions'
import { SET_AUTO_UPDATE, SET_IS_VISIBLE, SET_SAMPLING } from './mutations'
import rangeSelector from './range-selector'

export const NAMESPACE = 'rainfallDaily'

/**
 * tb: Tipping Bucket
 * vs: Vaisala
 */
export const STATIONS = [
  {
    stationId: 'pasarbubar',
    stationName: 'Pasarbubar',
    stationLabel: 'Pasarbubar (Vaisala)',
    isVaisala: true,
    isVisible: true,
  },
  {
    stationId: 'klatakan',
    stationName: 'Klatakan',
    stationLabel: 'Klatakan (Vaisala)',
    isVaisala: true,
    isVisible: true,
  },
  {
    stationId: 'labuhan',
    stationName: 'Labuhan',
    stationLabel: 'Labuhan (Vaisala)',
    isVaisala: true,
    isVisible: true,
  },
  {
    stationId: 'selo',
    stationName: 'Selo',
    stationLabel: 'Selo (Vaisala)',
    isVaisala: true,
    isVisible: true,
  },
  {
    stationId: 'jurangjero',
    stationName: 'Jurang Jero',
    stationLabel: 'Jurang Jero (Vaisala)',
    isVaisala: true,
    isVisible: true,
  },
  {
    stationId: 'babadan',
    stationName: 'Babadan',
    stationLabel: 'Babadan (Vaisala)',
    isVaisala: true,
    isVisible: true,
  },
  {
    stationId: 'jrakah',
    stationName: 'Jrakah',
    stationLabel: 'Jrakah (Vaisala)',
    isVaisala: true,
    isVisible: true,
  },
  {
    stationId: 'kaliurang',
    stationName: 'Kaliurang',
    stationLabel: 'Kaliurang (Vaisala)',
    isVaisala: true,
    isVisible: true,
  },
  {
    stationId: 'ngepos',
    stationName: 'Ngepos',
    stationLabel: 'Ngepos (Vaisala)',
    isVaisala: true,
    isVisible: true,
  },
]

export const SamplingTypes = Object.freeze({
  DAY: 'day',
  HOUR: 'hour',
})

export const initialState = {
  ...baseState,
  stations: STATIONS,
  autoUpdate: false,
  sampling: 'day',
}

export const initState = (period) => {
  const { startTime, endTime } = calculatePeriod(period)
  return {
    ...initialState,
    period,
    startTime,
    endTime,
  }
}

export const getters = {}

export const mutations = {
  ...baseMutations,
  [SET_AUTO_UPDATE](state, value) {
    state.autoUpdate = value
  },
  [SET_IS_VISIBLE](state, { index, isVisible }) {
    state.stations[index].isVisible = isVisible
  },
  [SET_SAMPLING](state, value) {
    state.sampling = value
  },
}

export const actions = {
  async [FETCH_RAINFALL]({ commit, state }) {
    if (state.cancelToken !== null) {
      state.cancelToken.cancel('Operation canceled due to new request')
    }

    commit(SET_CANCEL_TOKEN, axios.CancelToken.source())

    if (state.error) {
      commit(SET_ERROR, null)
    }

    const requests = state.stations.map((station) => {
      const params = {
        start: state.startTime.format(DATETIME_FORMAT),
        end: state.endTime.format(DATETIME_FORMAT),
        station: station.stationId,
        sampling: state.sampling,
      }
      return client.get('/vaisala-rainfall/', {
        params,
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

  async [UPDATE_RAINFALL]({ dispatch, commit, state }) {
    if (state.period.type === DateRangeTypes.CUSTOM) {
      return dispatch(FETCH_RAINFALL)
    } else {
      const { startTime, endTime } = calculatePeriod(state.period)
      commit(SET_START_TIME, startTime)
      commit(SET_END_TIME, endTime)
      return dispatch(FETCH_RAINFALL)
    }
  },
}

export const defaultPeriod = rangeSelector[0]

export default {
  namespaced: true,
  state: initState(defaultPeriod),
  getters,
  mutations,
  actions,
}
