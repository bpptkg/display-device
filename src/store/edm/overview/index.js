import Axios from 'axios'
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
} from '../../base/mutations'
import { baseState, baseMutations, baseActions } from '../../base'

import { UPDATE_EDM, FETCH_EDM } from './actions'
import rangeSelector from './range-selector'
import edmOptions from '@/components/echarts/chart-options/edm/overview/edm-options'

export const initialState = {
  ...baseState,
  annotationOptions: annotations,
  edmOptions,
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
  ...baseActions,
  async [FETCH_EDM]({ commit, state }) {
    if (state.error) {
      commit(SET_ERROR, null)
    }

    const requests = state.edmOptions.map((edm) => {
      return client.get('/edm/', {
        params: {
          start_at: state.startTime.format(DATETIME_FORMAT),
          end_at: state.endTime.format(DATETIME_FORMAT),
          ci: true,
          benchmark: edm.benchmark,
          reflector: edm.reflector,
          ordering: 'timestamp',
          compact: true,
        },
      })
    })

    const data = await Axios.all(requests)
      .then(
        Axios.spread((...responses) => {
          return responses.map((response) => response.data)
        })
      )
      .catch((error) => {
        commit(SET_ERROR, error)
        return []
      })

    commit(SET_DATA, data)
    commit(SET_LAST_UPDATED, moment())
  },
  async [UPDATE_EDM]({ dispatch, commit, state }) {
    if (state.period.type === DateRangeTypes.CUSTOM) {
      return dispatch(FETCH_EDM)
    } else {
      const { startTime, endTime } = calculatePeriod(state.period)
      commit(SET_START_TIME, startTime)
      commit(SET_END_TIME, endTime)
      return dispatch(FETCH_EDM)
    }
  },
}

const defaultPeriod = rangeSelector[3]

export default {
  namespaced: true,
  state: initState(defaultPeriod),
  getters,
  mutations,
  actions,
}
