import moment from 'moment'

import { DATE_FORMAT, DATETIME_FORMAT, DateRangeTypes } from '@/constants/date'
import { SamplingTypes } from '@/constants/seismicity'
import client from '@/utils/client'
import { calculatePeriod } from '@/utils/datetime'
import { primaryAnnotations } from '@/components/event-annotation/annotations'

import {
  SET_DATA,
  SET_END_TIME,
  SET_ERROR,
  SET_LAST_UPDATED,
  SET_START_TIME,
} from '../../base/mutations'
import { SET_SAMPLING } from '../seismicity/mutations'
import { baseState, baseMutations, baseActions } from '../../base'
import { FETCH_SEISMICITY, UPDATE_SEISMICITY } from '../seismicity/actions'
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

const defaultPeriod = rangeSelector[0]

export default {
  namespaced: true,
  state: initState(defaultPeriod),
  getters: getters,
  mutations: mutations,
  actions: actions,
}
