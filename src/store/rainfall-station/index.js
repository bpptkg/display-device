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

export const NAMESPACE = 'rainfallStation'

export const STATIONS = [
  {
    stationId: 'pasarbubar',
    stationName: 'Pasarbubar',
  },
  {
    stationId: 'gunungijo',
    stationName: 'Gunung Ijo',
  },
  {
    stationId: 'klatakan',
    stationName: 'Klatakan',
  },
  {
    stationId: 'labuhan',
    stationName: 'Labuhan',
  },
  {
    stationId: 'jurangjero',
    stationName: 'Jurang Jero',
    isVaisala: true,
    url: '/meteorology/jurangjero/',
    params: {
      fields:
        'timestamp,rain_acc,rain_intensity,rain_duration,rain_peak_intensity',
    },
  },
  {
    stationId: 'babadan',
    stationName: 'Babadan',
    isVaisala: true,
    url: '/meteorology/babadan/',
    params: {
      fields:
        'timestamp,rain_acc,rain_intensity,rain_duration,rain_peak_intensity',
    },
  },
]

export const initialState = {
  ...baseState,
  stations: STATIONS,
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
        url = `/rainfall-station/${station.stationId}/`
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
