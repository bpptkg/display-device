import moment from 'moment'
import axios from 'axios'

import client from '@/utils/client'
import { DATETIME_FORMAT, DateRangeTypes } from '@/constants/date'
import { calculatePeriod } from '@/utils/datetime'
import {
  EnergyTypes,
  EnergyEventTypes,
  SamplingTypes,
} from '@/constants/energy'
import { primaryAnnotations } from '@/components/event-annotation/annotations'

import {
  SET_DATA,
  SET_END_TIME,
  SET_ERROR,
  SET_LAST_UPDATED,
  SET_START_TIME,
  SET_CANCEL_TOKEN,
} from '../../base/mutations'
import { baseState, baseMutations, baseActions } from '../../base'
import { SET_EVENT_TYPE, SET_SAMPLING } from './mutations'
import { FETCH_ENERGY, UPDATE_ENERGY } from './actions'
import rangeSelector from './range-selector'

export const initialState = {
  ...baseState,
  annotationOptions: primaryAnnotations,
  eventType: '',
  sampling: '',
  type: '',
}

export const initState = (type, period, sampling = SamplingTypes.DAY) => {
  const { startTime, endTime } = calculatePeriod(period)

  return {
    ...initialState,
    endTime,
    eventType: EnergyEventTypes[type].eventtype,
    period,
    sampling,
    startTime,
    type,
  }
}

export const state = () => {
  return { ...initialState }
}

export const getters = {}

export const mutations = {
  ...baseMutations,
  [SET_EVENT_TYPE](state, eventType) {
    state.eventType = eventType
  },
  [SET_SAMPLING](state, sampling) {
    state.sampling = sampling
  },
}

export const actions = {
  ...baseActions,
  async [FETCH_ENERGY]({ commit, state }) {
    if (state.cancelToken !== null) {
      state.cancelToken.cancel('Operation canceled due to new request')
    }

    commit(SET_CANCEL_TOKEN, axios.CancelToken.source())

    if (state.error) {
      commit(SET_ERROR, null)
    }

    if (Array.isArray(state.eventType) && state.eventType.length) {
      const requests = state.eventType.map((event) => {
        return client.get('/energy/', {
          params: {
            accumulate: state.sampling,
            eventdate__gte: state.startTime.format(DATETIME_FORMAT),
            eventdate__lt: state.endTime.format(DATETIME_FORMAT),
            eventtype__in: event,
            nolimit: true,
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
    } else {
      const data = await client
        .get('/energy/', {
          params: {
            accumulate: state.sampling,
            eventdate__gte: state.startTime.format(DATETIME_FORMAT),
            eventdate__lt: state.endTime.format(DATETIME_FORMAT),
            eventtype__in: state.eventType,
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
    }
  },

  async [UPDATE_ENERGY]({ dispatch, commit, state }) {
    if (state.period.type === DateRangeTypes.CUSTOM) {
      return dispatch(FETCH_ENERGY)
    } else {
      const { startTime, endTime } = calculatePeriod(state.period)
      commit(SET_START_TIME, startTime)
      commit(SET_END_TIME, endTime)
      return dispatch(FETCH_ENERGY)
    }
  },
}

const defaultPeriod = rangeSelector[2]

const energyTotalModule = {
  namespaced: true,
  state: initState(EnergyTypes.TOTAL, defaultPeriod),
  getters,
  mutations,
  actions,
}

const energyVTModule = {
  namespaced: true,
  state: initState(EnergyTypes.VT, defaultPeriod),
  getters,
  mutations,
  actions,
}

const energyVTAModule = {
  namespaced: true,
  state: initState(EnergyTypes.VTA, defaultPeriod),
  getters,
  mutations,
  actions,
}

const energyVTBModule = {
  namespaced: true,
  state: initState(EnergyTypes.VTB, defaultPeriod),
  getters,
  mutations,
  actions,
}

const energyVTBMPModule = {
  namespaced: true,
  state: initState(EnergyTypes.VTBMP, defaultPeriod),
  getters,
  mutations,
  actions,
}

export default {
  namespaced: true,
  modules: {
    namespaced: true,
    total: energyTotalModule,
    vt: energyVTModule,
    vta: energyVTAModule,
    vtb: energyVTBModule,
    vtbmp: energyVTBMPModule,
  },
}
