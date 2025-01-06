import moment from 'moment'
import axios from 'axios'

import client from '@/utils/client'
import { calculatePeriod } from '@/utils/datetime'
import { DATETIME_FORMAT, DateRangeTypes } from '@/constants/date'
import { gpsStations } from '@/constants/gps'
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

import { FETCH_GPS_BASELINE, UPDATE_GPS_BASELINE } from './actions'
import rangeSelector from './range-selector'

export const initialState = {
  ...baseState,
  station: '',
  references: [],
  annotationOptions: annotations,
}

export const initState = (station, period) => {
  const { startTime, endTime } = calculatePeriod(period)

  return {
    ...initialState,
    period,
    station,
    references: gpsStations.filter((v) => v !== station),
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
  async [FETCH_GPS_BASELINE]({ commit, state }) {
    if (state.cancelToken !== null) {
      state.cancelToken.cancel('Operation canceled due to new request')
    }

    commit(SET_CANCEL_TOKEN, axios.CancelToken.source())

    if (state.error) {
      commit(SET_ERROR, null)
    }

    const requests = state.references.map((reference) => {
      return client.get('/gps/baseline/', {
        params: {
          station1: state.station,
          station2: reference,
          timestamp__gte: state.startTime.format(DATETIME_FORMAT),
          timestamp__lt: state.endTime.format(DATETIME_FORMAT),
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
  },
  async [UPDATE_GPS_BASELINE]({ dispatch, commit, state }) {
    if (state.period.type === DateRangeTypes.CUSTOM) {
      return dispatch(FETCH_GPS_BASELINE)
    } else {
      const { startTime, endTime } = calculatePeriod(state.period)
      commit(SET_START_TIME, startTime)
      commit(SET_END_TIME, endTime)
      return dispatch(FETCH_GPS_BASELINE)
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

const delessendang = {
  namespaced: true,
  state: initState('delessendang', defaultPeriod),
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

const puncak = {
  namespaced: true,
  state: initState('puncak', defaultPeriod),
  getters,
  mutations,
  actions,
}

const p1 = {
  namespaced: true,
  state: initState('p1', defaultPeriod),
  getters,
  mutations,
  actions,
}

const kalitengahlor = {
  namespaced: true,
  state: initState('kalitengahlor', defaultPeriod),
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
    delessendang,
    grawah,
    jrakah,
    klatakan,
    kendit,
    labuhan,
    pasarbubar,
    plawangan,
    selo,
    puncak,
    p1,
    kalitengahlor,
  },
}
