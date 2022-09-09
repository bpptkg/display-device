import moment from 'moment'
import axios from 'axios'
import { min, max } from 'lodash'

import { DATETIME_FORMAT, DateRangeTypes } from '@/constants/date'
import client from '@/utils/client'
import { calculatePeriod } from '@/utils/datetime'
import { toUnixMiliSeconds } from '@/utils/series'
import { DEFAULT_SETTINGS } from '@/components/echarts/chart-options/hypocenter'
import eventFilterOptions from '@/components/event-filter/filters'
import { isLocalStorageAvailable } from '@/utils/localstorage'

import {
  SET_DATA,
  SET_END_TIME,
  SET_ERROR,
  SET_LAST_UPDATED,
  SET_START_TIME,
  SET_CANCEL_TOKEN,
} from '../../base/mutations'
import { baseState, baseMutations } from '../../base'
import {
  RESET_RMS_FILTER,
  SET_EVENT_FILTER,
  SET_ONLY_PLOTTABLE,
  SET_RMS_FILTER,
  SET_SETTINGS,
  SET_TOPO,
  USE_HYPO_MODE,
} from './mutations'
import { FETCH_HYPO, UPDATE_HYPO, FETCH_TOPO } from './actions'
import rangeSelector from './range-selector'

export const NAMESPACE = 'seismic/hypocenter'

// Events with the following types are not locatable.
const excludeLocationTypes = ['other event', 'not locatable']

const topoCacheKey = 'display-device:hypocenter/topo/v1'

export const DEFAULT_RMS_RANGE = [0, 0.1]

export const initialState = {
  ...baseState,
  accumulate: false,
  onlyPlottable: false,
  topo: [],
  settings: {
    ...DEFAULT_SETTINGS,
    onlyLocatable: true,
    useBtbbHypo: true,
  },
  eventFilter: [...eventFilterOptions],
  // Setting the value to null will force DD to calculate min and max of rms
  // error.
  rmsFilter: [...DEFAULT_RMS_RANGE],
}

export const initState = (period, customSettings = {}) => {
  const { startTime, endTime } = calculatePeriod(period)

  return {
    ...initialState,
    period,
    startTime,
    endTime,
    settings: {
      ...initialState.settings,
      ...customSettings,
      timeMin: toUnixMiliSeconds(startTime),
      timeMax: toUnixMiliSeconds(endTime),
    },
  }
}

export const state = () => {
  return { ...initialState }
}

export const getters = {
  /**
   * Filter events whose longitude, latitude, depth, and magnitude only. We also
   * filter magnitude because the hypocenter chart categorizes magnitude values.
   */
  plottableEvents({ data }) {
    return data.filter((event) => {
      return event.longitude && event.latitude && event.depth && event.magnitude
    })
  },
  locatableEvents({ data }) {
    return data
      .filter((event) => {
        return (
          event.longitude && event.latitude && event.depth && event.magnitude
        )
      })
      .filter((event) => {
        return (
          !excludeLocationTypes.includes(event.location_type) ||
          !event.location_type
        )
      })
  },
  /**
   * BackTrackBB events with RMS filter applied (if any).
   */
  btbbEvents({ data, rmsFilter }) {
    const events = data
      .filter((event) => {
        return (
          event.btbb &&
          event.btbb.lat &&
          event.btbb.lon &&
          event.btbb.z &&
          event.magnitude
        )
      })
      .map((event) => {
        return {
          ...event,
          // Override latitude, longitude, and depth to use the values from
          // BackTrackBB. See the BMA documentation:
          // https://bma.cendana15.com/docs/apis/monitoring/magnitude.html
          latitude: event.btbb.lat,
          longitude: event.btbb.lon,
          depth: event.btbb.z,
          rmsp: event.btbb.rmsp,
        }
      })

    if (Array.isArray(rmsFilter)) {
      if (rmsFilter.length !== 2) {
        return events
      } else {
        return isFinite(rmsFilter[0]) && isFinite(rmsFilter[1])
          ? events.filter((e) => {
              return e.rmsp >= rmsFilter[0] && e.rmsp <= rmsFilter[1]
            })
          : events
      }
    } else {
      return events
    }
  },
  /**
   * BackTrackBB events without RMS filter.
   */
  btbbEventsUnfiltered({ data }) {
    const events = data
      .filter((event) => {
        return (
          event.btbb &&
          event.btbb.lat &&
          event.btbb.lon &&
          event.btbb.z &&
          event.magnitude
        )
      })
      .map((event) => {
        return {
          ...event,
          latitude: event.btbb.lat,
          longitude: event.btbb.lon,
          depth: event.btbb.z,
          rmsp: event.btbb.rmsp,
        }
      })

    return events
  },
  rmsRange({ data }) {
    const rmsp = data
      .filter((event) => event.btbb && event.btbb.rmsp)
      .map((event) => event.btbb.rmsp)
    return [min(rmsp), max(rmsp)]
  },
}

export const mutations = {
  ...baseMutations,
  [SET_TOPO](state, data) {
    state.topo = data
  },
  [SET_SETTINGS](state, settings) {
    state.settings = {
      ...state.settings,
      ...settings,
    }
  },
  [SET_ONLY_PLOTTABLE](state, value) {
    state.onlyPlottable = value
  },
  [USE_HYPO_MODE](state, value) {
    const useBtbbHypo = value.toLowerCase() === 'automatic'
    state.settings = {
      ...state.settings,
      useBtbbHypo: useBtbbHypo,
    }
  },
  [SET_RMS_FILTER](state, value) {
    state.rmsFilter = value
  },
  [RESET_RMS_FILTER](state) {
    state.rmsFilter = null
  },
  [SET_EVENT_FILTER](state, value) {
    state.eventFilter = value
  },
}

export const actions = {
  async [FETCH_HYPO]({ commit, state }) {
    if (state.cancelToken !== null) {
      state.cancelToken.cancel('Operation canceled due to new request')
    }

    commit(SET_CANCEL_TOKEN, axios.CancelToken.source())

    if (state.error) {
      commit(SET_ERROR, null)
    }

    const eventFilter = state.eventFilter.filter((e) => e.checked === true)

    const baseParams = {
      eventdate__gte: state.startTime.format(DATETIME_FORMAT),
      eventdate__lt: state.endTime.format(DATETIME_FORMAT),
      nolimit: true,
      accumulate: state.accumulate,
    }

    let params
    if (eventFilter.length) {
      params = {
        ...baseParams,
        eventtype__in: eventFilter.map((e) => e.name).join(','),
      }
    } else {
      params = {
        ...baseParams,
        // Dummy value because eventFilter is all unchecked.
        eventtype__in: 'NULL',
      }
    }

    let queryParams
    if (state.onlyPlottable) {
      queryParams = {
        ...params,
        longitude__isnull: false,
        latitude__isnull: false,
        depth__isnull: false,
      }
    } else {
      queryParams = {
        ...params,
      }
    }

    const data = await client
      .get('/magnitude/', {
        params: queryParams,
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
  async [UPDATE_HYPO]({ dispatch, commit, state }) {
    if (state.period.type === DateRangeTypes.CUSTOM) {
      return dispatch(FETCH_HYPO)
    } else {
      const { startTime, endTime } = calculatePeriod(state.period)
      commit(SET_START_TIME, startTime)
      commit(SET_END_TIME, endTime)
      return dispatch(FETCH_HYPO)
    }
  },
  async [FETCH_TOPO]({ commit }) {
    if (isLocalStorageAvailable()) {
      const cachedTopo = JSON.parse(localStorage.getItem(topoCacheKey))
      if (
        cachedTopo !== null &&
        Array.isArray(cachedTopo) &&
        cachedTopo.length
      ) {
        commit(SET_TOPO, cachedTopo)
      } else {
        const data = await client
          .get('topo/', {
            params: {
              model: 'm1000',
            },
          })
          .then((response) => response.data.data)
          .catch((error) => {
            commit(SET_ERROR, error)
            return []
          })

        localStorage.setItem(topoCacheKey, JSON.stringify(data))
        commit(SET_TOPO, data)
      }
    } else {
      const data = await client
        .get('topo/', {
          params: {
            model: 'm1000',
          },
        })
        .then((response) => response.data.data)
        .catch((error) => {
          commit(SET_ERROR, error)
          return []
        })

      commit(SET_TOPO, data)
    }
  },
}

const defaultPeriod = rangeSelector[2]

export default {
  namespaced: true,
  state: initState(defaultPeriod),
  getters,
  mutations,
  actions,
}
