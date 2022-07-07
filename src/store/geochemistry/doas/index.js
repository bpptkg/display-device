import moment from 'moment'
import axios from 'axios'
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
  SET_CANCEL_TOKEN,
} from '../../base/mutations'
import { baseState, baseMutations, baseActions } from '../../base'
import { UPDATE_DOAS, FETCH_DOAS } from './actions'
import rangeSelector from './range-selector'

export const initialState = {
  ...baseState,
  station: '',
  annotationOptions: annotations,
}

export const initState = (station, period) => {
  const { startTime, endTime } = calculatePeriod(period)

  return {
    ...initialState,
    period,
    station,
    startTime,
    endTime,
  }
}

export const getters = {}

export const mutations = {
  ...baseMutations,
}

export const actions = {
  ...baseActions,
  async [FETCH_DOAS]({ commit, state }) {
    if (state.cancelToken !== null) {
      state.cancelToken.cancel('Operation canceled due to new request')
    }

    commit(SET_CANCEL_TOKEN, axios.CancelToken.source())

    if (state.error) {
      commit(SET_ERROR, null)
    }

    const data = await client
      .get(`/doas2/${state.station}/`, {
        params: {
          starttime__gte: state.startTime.format(DATETIME_FORMAT),
          starttime__lt: state.endTime.format(DATETIME_FORMAT),
          nolimit: true,
        },
        cancelToken: state.cancelToken.token,
      })
      .then((response) => response.data)
      .catch((error) => {
        commit(SET_ERROR, error)
        return []
      })

    commit(SET_DATA, data)
    commit(SET_LAST_UPDATED, moment())
  },
  async [UPDATE_DOAS]({ dispatch, commit, state }) {
    if (state.period.type === DateRangeTypes.CUSTOM) {
      return dispatch(FETCH_DOAS)
    } else {
      const { startTime, endTime } = calculatePeriod(state.period)
      commit(SET_START_TIME, startTime)
      commit(SET_END_TIME, endTime)
      return dispatch(FETCH_DOAS)
    }
  },
}

const defaultPeriod = rangeSelector[2]

export const initModule = (station, period = defaultPeriod) => {
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
    babadan: initModule('babadan'),
  },
}
