import moment from 'moment'
import axios from 'axios'

import { calculatePeriod } from '@/utils/datetime'
import { DATETIME_FORMAT, DateRangeTypes } from '@/constants/date'
import {
  SamplingTypes,
  AggregationTypes,
  DataTypes,
} from '@/constants/tiltmeter'
import client from '@/utils/client'
import annotations from '@/components/event-annotation/annotations'

import {
  SET_DATA,
  SET_END_TIME,
  SET_ERROR,
  SET_LAST_UPDATED,
  SET_START_TIME,
  SET_CANCEL_TOKEN,
} from '../base/mutations'
import { baseState, baseMutations, baseActions } from '../base'
import { SET_SAMPLING, SET_TYPE, SET_STATION, SET_MID_MODE } from './mutations'
import { FETCH_TILTMETER, UPDATE_TILTMETER } from './actions'
import rangeSelector from './range-selector-day'

// Submodules.
import overview from './overview'

export const initialState = {
  ...baseState,
  annotationOptions: annotations,
  sampling: SamplingTypes.DAY,
  station: '',
  type: '',
  // Use custom range hour daily aggregation for tiltmeter borehole.
  mid: true,
}

export const initState = (type, station, period) => {
  const { startTime, endTime } = calculatePeriod(period)

  return {
    ...initialState,
    type,
    station,
    period,
    startTime,
    endTime,
  }
}

export const state = () => {
  return { ...initialState }
}

export const getters = {
  latestData(state) {
    if (state.data.length === 0) return null
    return state.data[state.data.length - 1]
  },
}

export const mutations = {
  ...baseMutations,
  [SET_SAMPLING](state, sampling) {
    state.sampling = sampling
  },
  [SET_TYPE](state, type) {
    state.type = type
  },
  [SET_STATION](state, station) {
    state.station = station
  },
  [SET_MID_MODE](state, value) {
    state.mid = Boolean(value)
  },
}

export const actions = {
  ...baseActions,
  /**
   * Fetch tiltmeter data using existing store state.
   */
  async [FETCH_TILTMETER]({ commit, state }) {
    if (state.cancelToken !== null) {
      state.cancelToken.cancel('Operation canceled due to new request')
    }

    commit(SET_CANCEL_TOKEN, axios.CancelToken.source())

    if (state.error) {
      commit(SET_ERROR, null)
    }

    let url = ''
    let params = {}
    switch (state.type) {
      case DataTypes.PLATFORM:
        url = `/tiltmeter/${state.station}/`
        break
      case DataTypes.PLATFORM_RAW:
        url = `/tiltmeter/raw/${state.station}/`
        break
      case DataTypes.BOREHOLE:
        url = `/tiltborehole/${state.station}/`
        // Use mid data aggregation for tiltmeter borehole.
        params = {
          mid: state.mid,
        }
        break
      case DataTypes.TLR:
        params =
          state.sampling === SamplingTypes.DAY
            ? {
                filter: 'median',
                median_window: 5,
                median_aggregation: 'mean',
              }
            : {
                filter: 'median',
                median_window: 5,
              }

        url = `/tiltmeter/tlr/${state.station}/`
        break
      default:
        url = `/tiltmeter/${state.station}/`
    }

    const aggregation =
      state.sampling === SamplingTypes.DAY && state.type !== DataTypes.TLR
        ? AggregationTypes.MEAN
        : ''

    const data = await client
      .get(url, {
        params: {
          timestamp__gte: state.startTime.format(DATETIME_FORMAT),
          timestamp__lt: state.endTime.format(DATETIME_FORMAT),
          nolimit: true,
          aggregation: aggregation,
          ...params,
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
  /**
   * Update period (startTime, endTime) store if using relative period and fetch
   * tiltmeter data. Otherwise, if using custom period, it will use existing
   * startTime and endTime value.
   */
  async [UPDATE_TILTMETER]({ dispatch, commit, state }) {
    if (state.period.type === DateRangeTypes.CUSTOM) {
      return dispatch(FETCH_TILTMETER)
    } else {
      const { startTime, endTime } = calculatePeriod(state.period)
      commit(SET_START_TIME, startTime)
      commit(SET_END_TIME, endTime)
      return dispatch(FETCH_TILTMETER)
    }
  },
}

const defaultPeriod = rangeSelector[2]

export const initModule = (type, station, period = defaultPeriod) => {
  return {
    namespaced: true,
    state: initState(type, station, period),
    getters,
    mutations,
    actions,
  }
}

export default {
  namespaced: true,
  modules: {
    namespaced: true,
    overview,
    platform: {
      namespaced: true,
      modules: {
        grawah: initModule(DataTypes.PLATFORM, 'grawah'),
        gunungijo: initModule(DataTypes.PLATFORM, 'gunungijo'),
        klatakan: initModule(DataTypes.PLATFORM, 'klatakan'),
        patuk: initModule(DataTypes.PLATFORM, 'patuk'),
        labuhan: initModule(DataTypes.PLATFORM, 'labuhan'),
        selokopo: initModule(DataTypes.PLATFORM, 'selokopo'),
      },
    },
    tlr: {
      namespaced: true,
      modules: {
        babadan: initModule(DataTypes.TLR, 'babadan'),
        deles: initModule(DataTypes.TLR, 'deles'),
        plawangan: initModule(DataTypes.TLR, 'plawangan'),
        gadjahmungkur: initModule(DataTypes.TLR, 'gadjahmungkur'),
      },
    },
    borehole: {
      namespaced: true,
      modules: {
        bawahkendit: initModule(DataTypes.BOREHOLE, 'bawahkendit'),
        kendit: initModule(DataTypes.BOREHOLE, 'kendit'),
        klatakan: initModule(DataTypes.BOREHOLE, 'klatakan'),
        lavaflow1902: initModule(DataTypes.BOREHOLE, 'lavaflow1902'),
        lavaflow1953: initModule(DataTypes.BOREHOLE, 'lavaflow1953'),
      },
    },
  },
}
