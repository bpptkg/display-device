import moment from 'moment'
import client from '@/utils/cendana-client'
import { calculatePeriod } from '@/utils/datetime'
import { DATETIME_FORMAT, DateRangeTypes } from '@/constants/date'
import {
  SET_DATA,
  SET_END_TIME,
  SET_ERROR,
  SET_LAST_UPDATED,
  SET_START_TIME,
} from '../base/mutations'
import { baseState, baseMutations, baseActions } from '../base'
import rangeSelector from './range-selector'

// Mutations.
export const SET_STATION = 'SET_STATION'

// Actions.
export const FETCH_VISUAL = 'FETCH_VISUAL'
export const UPDATE_VISUAL = 'UPDATE_VISUAL'

export const Stations = [
  { id: '1', value: 'kaliurang', text: 'Pos Kaliurang' },
  { id: '2', value: 'babadan', text: 'Pos Babadan' },
  { id: '3', value: 'jrakah', text: 'Pos Jrakah' },
  { id: '4', value: 'selo', text: 'Pos Selo' },
  { id: '5', value: 'ngepos', text: 'Pos Ngepos' },
]

export const StationIdMap = {
  kaliurang: 1,
  babadan: 2,
  jrakah: 3,
  selo: 4,
  ngepos: 5,
}

export const DataIndex = {
  WEATHER: 0,
  SMOKE: 1,
  SOUND: 2,
  STATIC_FIRE: 3,
  SHAKE: 4,
  LAVA: 5,
  ASH_RAIN: 6,
}

export const initialState = {
  ...baseState,
  station: 'kaliurang',
}

export const initState = (station, period) => {
  const { startTime, endTime } = calculatePeriod(period)

  return {
    ...initialState,
    station,
    period,
    startTime,
    endTime,
  }
}

export const getters = {}

export const mutations = {
  ...baseMutations,
  [SET_STATION](state, station) {
    state.station = station
  },
}

export const actions = {
  ...baseActions,
  async [FETCH_VISUAL]({ commit, state }) {
    commit(SET_ERROR, null)

    const stationId = StationIdMap[state.station]

    const requests = [
      client.get('/api/analytics/weather', {
        params: {
          station_id: stationId,
          start_at: state.startTime.format(DATETIME_FORMAT),
          end_at: state.endTime.format(DATETIME_FORMAT),
        },
      }),
      client.get('/api/analytics/smoke', {
        params: {
          station_id: stationId,
          start_at: state.startTime.format(DATETIME_FORMAT),
          end_at: state.endTime.format(DATETIME_FORMAT),
        },
      }),
      client.get('/api/analytics/sound', {
        params: {
          station_id: stationId,
          start_at: state.startTime.format(DATETIME_FORMAT),
          end_at: state.endTime.format(DATETIME_FORMAT),
        },
      }),
      client.get('/api/analytics/static-fire', {
        params: {
          station_id: stationId,
          start_at: state.startTime.format(DATETIME_FORMAT),
          end_at: state.endTime.format(DATETIME_FORMAT),
        },
      }),
      client.get('/api/analytics/shake', {
        params: {
          station_id: stationId,
          start_at: state.startTime.format(DATETIME_FORMAT),
          end_at: state.endTime.format(DATETIME_FORMAT),
        },
      }),
      client.get('/api/analytics/lava', {
        params: {
          station_id: stationId,
          start_at: state.startTime.format(DATETIME_FORMAT),
          end_at: state.endTime.format(DATETIME_FORMAT),
        },
      }),
      client.get('/api/analytics/ash-rain', {
        params: {
          station_id: stationId,
          start_at: state.startTime.format(DATETIME_FORMAT),
          end_at: state.endTime.format(DATETIME_FORMAT),
        },
      }),
    ]

    try {
      const responses = await Promise.all(requests)
      const data = responses.map((response) => response.data)

      commit(SET_DATA, data)
      commit(SET_LAST_UPDATED, moment())
    } catch (error) {
      commit(SET_ERROR, error)
    }
  },
  async [UPDATE_VISUAL]({ dispatch, commit, state }) {
    if (state.period.type === DateRangeTypes.CUSTOM) {
      return dispatch(FETCH_VISUAL)
    } else {
      const { startTime, endTime } = calculatePeriod(state.period)
      commit(SET_START_TIME, startTime)
      commit(SET_END_TIME, endTime)
      return dispatch(FETCH_VISUAL)
    }
  },
}

export const initModule = (station, period) => {
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
    namespaced: true,
    kaliurang: initModule('kaliurang', rangeSelector[1]),
    babadan: initModule('babadan', rangeSelector[1]),
    jrakah: initModule('jrakah', rangeSelector[1]),
    selo: initModule('selo', rangeSelector[1]),
    ngepos: initModule('ngepos', rangeSelector[1]),
  },
}
