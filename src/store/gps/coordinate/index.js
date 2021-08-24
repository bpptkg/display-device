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
import { FETCH_GPS_COORDINATE, UPDATE_GPS_COORDINATE } from './actions'
import rangeSelector from './range-selector'

const initialState = {
  ...baseState,
  station: '',
  annotationOptions: annotations,
}

const initState = (station, period) => {
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
  async [FETCH_GPS_COORDINATE]({ commit, state }) {
    if (state.error) {
      commit(SET_ERROR, null)
    }

    const data = await client
      .get(`/gps/position/${state.station}/`, {
        params: {
          timestamp__gte: state.startTime.format(DATETIME_FORMAT),
          timestamp__lt: state.endTime.format(DATETIME_FORMAT),
          nolimit: true,
        },
      })
      .then((response) => response.data)
      .catch((error) => {
        commit(SET_ERROR, error)
        return []
      })

    commit(SET_DATA, data)
    commit(SET_LAST_UPDATED, moment())
  },
  async [UPDATE_GPS_COORDINATE]({ dispatch, commit, state }) {
    if (state.period.type === DateRangeTypes.CUSTOM) {
      return dispatch(FETCH_GPS_COORDINATE)
    } else {
      const { startTime, endTime } = calculatePeriod(state.period)
      commit(SET_START_TIME, startTime)
      commit(SET_END_TIME, endTime)
      return dispatch(FETCH_GPS_COORDINATE)
    }
  },
}

const defaultPeriod = rangeSelector[2]

const babadan = {
  namespaced: true,
  state: initState('babadan', defaultPeriod),
  getters,
  mutations,
  actions,
}

const bpptkg = {
  namespaced: true,
  state: initState('bpptkg', defaultPeriod),
  getters,
  mutations,
  actions,
}

const deles = {
  namespaced: true,
  state: initState('deles', defaultPeriod),
  getters,
  mutations,
  actions,
}

const grawah = {
  namespaced: true,
  state: initState('grawah', defaultPeriod),
  getters,
  mutations,
  actions,
}

const jrakah = {
  namespaced: true,
  state: initState('jrakah', defaultPeriod),
  getters,
  mutations,
  actions,
}

const klatakan = {
  namespaced: true,
  state: initState('klatakan', defaultPeriod),
  getters,
  mutations,
  actions,
}

const kendit = {
  namespaced: true,
  state: initState('kendit', defaultPeriod),
  getters,
  mutations,
  actions,
}

const labuhan = {
  namespaced: true,
  state: initState('labuhan', defaultPeriod),
  getters,
  mutations,
  actions,
}

const pasarbubar = {
  namespaced: true,
  state: initState('pasarbubar', defaultPeriod),
  getters,
  mutations,
  actions,
}

const plawangan = {
  namespaced: true,
  state: initState('plawangan', defaultPeriod),
  getters,
  mutations,
  actions,
}

const selo = {
  namespaced: true,
  state: initState('selo', defaultPeriod),
  getters,
  mutations,
  actions,
}

export default {
  namespaced: true,
  modules: {
    namespaced: true,
    babadan,
    bpptkg,
    deles,
    grawah,
    jrakah,
    klatakan,
    kendit,
    labuhan,
    pasarbubar,
    plawangan,
    selo,
  },
}
