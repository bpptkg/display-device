import moment from 'moment'
import { calculatePeriod } from '@/utils/datetime'
import { DATETIME_FORMAT, DateRangeTypes } from '@/constants/date'
import client from '@/utils/client'

import {
  SET_DATA,
  SET_END_TIME,
  SET_ERROR,
  SET_LAST_UPDATED,
  SET_START_TIME,
  SET_CANCEL_TOKEN,
} from '../base/mutations'
import { baseState, baseMutations } from '../base'

import { FETCH_RAINFALL, UPDATE_RAINFALL } from './actions'
import rangeSelector from './range-selector'
import axios from 'axios'
import { SET_AUTO_UPDATE, SET_IS_VISIBLE } from './mutations'

export const NAMESPACE = 'rainfallStation'

/**
 * tb: Tipping Bucket
 * vs: Vaisala
 */
export const STATIONS = [
  {
    stationId: 'tb:pasarbubar',
    stationName: 'Pasarbubar',
    stationLabel: 'Pasarbubar (Tipping Bucket)',
    url: `/rainfall-station/pasarbubar/`,
    isVisible: false,
  },
  {
    stationId: 'vs:pasarbubar',
    stationName: 'Pasarbubar',
    stationLabel: 'Pasarbubar (Vaisala)',
    isVaisala: true,
    url: '/meteorology/pasarbubar/rainfall/',
    params: {
      fields: 'timestamp,cumulative_rainfall,rate',
    },
    isVisible: true,
  },
  {
    stationId: 'tb:gunungijo',
    stationName: 'Gunung Ijo',
    stationLabel: 'Gunung Ijo (Tipping Bucket)',
    url: `/rainfall-station/gunungijo/`,
    isVisible: false,
  },
  {
    stationId: 'tb:klatakan',
    stationName: 'Klatakan',
    stationLabel: 'Klatakan (Tipping Bucket)',
    url: `/rainfall-station/klatakan/`,
    isVisible: false,
  },
  {
    stationId: 'vs:klatakan',
    stationName: 'Klatakan',
    stationLabel: 'Klatakan (Vaisala)',
    isVaisala: true,
    url: '/meteorology/klatakan/rainfall/',
    params: {
      fields: 'timestamp,cumulative_rainfall,rate',
    },
    isVisible: true,
  },
  {
    stationId: 'tb:labuhan',
    stationName: 'Labuhan',
    stationLabel: 'Labuhan (Tipping Bucket)',
    url: `/rainfall-station/labuhan/`,
    isVisible: false,
  },
  {
    stationId: 'vs:labuhan',
    stationName: 'Labuhan',
    stationLabel: 'Labuhan (Vaisala)',
    isVaisala: true,
    url: '/meteorology/labuhan/rainfall/',
    params: {
      fields: 'timestamp,cumulative_rainfall,rate',
    },
    isVisible: true,
  },
  {
    stationId: 'vs:selo',
    stationName: 'Selo',
    stationLabel: 'Selo (Vaisala)',
    isVaisala: true,
    url: '/meteorology/selo/rainfall/',
    params: {
      fields: 'timestamp,cumulative_rainfall,rate',
    },
    isVisible: true,
  },
  {
    stationId: 'vs:jurangjero',
    stationName: 'Jurang Jero',
    stationLabel: 'Jurang Jero (Vaisala)',
    isVaisala: true,
    url: '/meteorology/jurangjero/rainfall/',
    params: {
      fields: 'timestamp,cumulative_rainfall,rate',
    },
    isVisible: true,
  },
  {
    stationId: 'vs:babadan',
    stationName: 'Babadan',
    stationLabel: 'Babadan (Vaisala)',
    isVaisala: true,
    url: '/meteorology/babadan/rainfall/',
    params: {
      fields: 'timestamp,cumulative_rainfall,rate',
    },
    isVisible: true,
  },
  {
    stationId: 'vs:jrakah',
    stationName: 'Jrakah',
    stationLabel: 'Jrakah (Vaisala)',
    isVaisala: true,
    url: '/meteorology/jrakah/rainfall/',
    params: {
      fields: 'timestamp,cumulative_rainfall,rate',
    },
    isVisible: true,
  },
  {
    stationId: 'vs:kaliurang',
    stationName: 'Kaliurang',
    stationLabel: 'Kaliurang (Vaisala)',
    isVaisala: true,
    url: '/meteorology/kaliurang/rainfall/',
    params: {
      fields: 'timestamp,cumulative_rainfall,rate',
    },
    isVisible: true,
  },
  {
    stationId: 'vs:ngepos',
    stationName: 'Ngepos',
    stationLabel: 'Ngepos (Vaisala)',
    isVaisala: true,
    url: '/meteorology/ngepos/rainfall/',
    params: {
      fields: 'timestamp,cumulative_rainfall,rate',
    },
    isVisible: true,
  },
]

export const initialState = {
  ...baseState,
  stations: STATIONS,
  autoUpdate: true,
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
      let url = ''
      const baseParams = {
        timestamp__gte: state.startTime.format(DATETIME_FORMAT),
        timestamp__lt: state.endTime.format(DATETIME_FORMAT),
        nolimit: true,
      }
      let params = {}
      if (station.isVaisala) {
        url = station.url
        params = {
          ...baseParams,
          ...station.params,
        }
      } else {
        url = station.url
        params = {
          ...baseParams,
        }
      }
      return client.get(url, {
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

export const defaultPeriod = rangeSelector[1]

export default {
  namespaced: true,
  state: initState(defaultPeriod),
  getters,
  mutations,
  actions,
}
