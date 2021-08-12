import moment from 'moment'
import { get } from 'lodash'
import client from '@/utils/client'
import { DATETIME_FORMAT, DateRangeTypes } from '@/constants/date'
import { calculatePeriod } from '@/utils/datetime'

import {
  SET_DATA,
  SET_END_TIME,
  SET_ERROR,
  SET_LAST_UPDATED,
  SET_START_TIME,
} from '../../base/mutations'
import { baseState, baseMutations } from '../../base'
import { FETCH_BULLETIN, UPDATE_BULLETIN } from './actions'
import { RESET_EVENT_TYPE, SET_CLUSTER_DICT, SET_EVENT_TYPE } from './mutations'
import rangeSelector from './range-selector'
import { seismicEvents } from '@/constants/bulletin'

export const NAMESPACE = 'seismic/bulletin'

export const eventTypesFilter = [
  { code: 'ALL', value: 'ALL', text: 'ALL' },
  ...seismicEvents.map((v) => ({
    code: v.code,
    value: v.code,
    text: v.code,
  })),
]

export const initialState = {
  ...baseState,
  clusterDict: {},
  eventType: 'ALL',
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

export const state = () => {
  return { ...initialState }
}

export const getters = {}

export const mutations = {
  ...baseMutations,
  [SET_CLUSTER_DICT](state, value) {
    state.clusterDict = value
  },
  [SET_EVENT_TYPE](state, value) {
    state.eventType = value
  },
  [RESET_EVENT_TYPE](state) {
    state.eventType = 'ALL'
  },
}

export const actions = {
  async [FETCH_BULLETIN]({ commit, state }) {
    if (state.error) {
      commit(SET_ERROR, null)
    }

    // Because bulletin API doesn't has clusterEvent included, we need to fetch
    // cluster dictionary to calculate clusterEvent.
    const clusterDictRequest = client.get('/cluster/dict/')

    // Fetch for selected fields to speed up query.
    const fields = [
      'eventid',
      'eventdate',
      'eventdate_microsecond',
      'duration',
      'amplitude',
      'magnitude',
      'longitude',
      'latitude',
      'depth',
      'eventtype',
      'seiscompid',
      'validated',
      'projection',
      'operator',
      'last_modified',
      'ml_deles',
      'ml_labuhan',
      'ml_pasarbubar',
      'ml_pusunglondon',
      'location_type',
      'location_mode',
      'cluster',
      'corr_coef',
    ]

    const params = {
      eventdate__gte: state.startTime.format(DATETIME_FORMAT),
      eventdate__lt: state.endTime.format(DATETIME_FORMAT),
      eventtype__isnull: false,
      nolimit: true,
      ordering: '-eventdate',
      fields: fields.join(','),
    }
    if (state.eventType !== 'ALL') {
      params.eventtype = state.eventType
    }

    const bulletinRequest = client.get('/bulletin/', {
      params,
    })

    const { data, clusterDict } = await Promise.all([
      bulletinRequest,
      clusterDictRequest,
    ]).then((responses) => {
      const clusterDict = responses[1].data.reduce((acc, cur) => {
        acc[cur.cluster] = cur.eventtype
        return acc
      }, {})

      const data = responses[0].data.map((v) => {
        return {
          ...v,
          clusterEvent: get(clusterDict, v.cluster, 'UNCLUSTERED'),
        }
      })

      return { data, clusterDict }
    })

    commit(SET_CLUSTER_DICT, clusterDict)
    commit(SET_DATA, data)
    commit(SET_LAST_UPDATED, moment())
  },

  async [UPDATE_BULLETIN]({ dispatch, commit, state }) {
    if (state.period.type === DateRangeTypes.CUSTOM) {
      return dispatch(FETCH_BULLETIN)
    } else {
      const { startTime, endTime } = calculatePeriod(state.period)
      commit(SET_START_TIME, startTime)
      commit(SET_END_TIME, endTime)
      return dispatch(FETCH_BULLETIN)
    }
  },
}

const defaultPeriod = rangeSelector[0]

export default {
  namespaced: true,
  state: initState(defaultPeriod),
  getters,
  mutations,
  actions,
}
