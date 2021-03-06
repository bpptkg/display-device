import moment from 'moment'
import axios from 'axios'

import { DATETIME_FORMAT } from '@/constants/date'
import { SamplingTypes } from '@/constants/seismicity'
import client from '@/utils/client'
import { calculatePeriod } from '@/utils/datetime'

import {
  SET_DATA,
  SET_ERROR,
  SET_LAST_UPDATED,
  SET_CANCEL_TOKEN,
} from '../../base/mutations'
import { FETCH_SEISMICITY } from '../seismicity/actions'
import rangeSelector from './range-selector'
import { SET_EVENT_TYPE } from './mutations'

import {
  actions as seismicityActions,
  getters as seismicityGetters,
  mutations as seismicityMutations,
  initialState,
} from '../seismicity/index'

export const initState = (period, sampling = SamplingTypes.DAY) => {
  const { startTime, endTime } = calculatePeriod(period)

  return {
    ...initialState,
    period,
    sampling,
    startTime,
    endTime,
    eventType: 'VTA',
  }
}

export const mutations = {
  ...seismicityMutations,
  [SET_EVENT_TYPE](state, eventType) {
    state.eventType = eventType
  },
}

export const getters = {
  ...seismicityGetters,
  clusterGroup(state) {
    return state.data.results || []
  },
  numClusters(state) {
    return state.data.num_clusters || 0
  },
}

export const actions = {
  ...seismicityActions,
  async [FETCH_SEISMICITY]({ commit, state }) {
    if (state.cancelToken !== null) {
      state.cancelToken.cancel('Operation canceled due to new request')
    }

    commit(SET_CANCEL_TOKEN, axios.CancelToken.source())

    if (state.error) {
      commit(SET_ERROR, null)
    }

    const data = await client
      .get('/cluster/seisgroup/', {
        params: {
          eventdate__gte: state.startTime.format(DATETIME_FORMAT),
          eventdate__lt: state.endTime.format(DATETIME_FORMAT),
          cluster_event: state.eventType,
          count_per: state.sampling,
          nolimit: true,
          reindex: true,
          start: state.startTime.format(DATETIME_FORMAT),
          end: state.endTime.format(DATETIME_FORMAT),
        },
        cancelToken: state.cancelToken.token,
      })
      .then((response) => response.data)
      .catch((error) => {
        commit(SET_ERROR, error)
        return {}
      })

    commit(SET_DATA, data)
    commit(SET_LAST_UPDATED, moment())
  },
}

const defaultPeriod = rangeSelector[2]

export default {
  namespaced: true,
  state: initState(defaultPeriod),
  getters: getters,
  mutations: mutations,
  actions: actions,
}
