import Axios from 'axios'
import moment from 'moment'

import { calculatePeriod } from '@/utils/datetime'
import { DATETIME_FORMAT, DateRangeTypes } from '@/constants/date'
import {
  SamplingTypes,
  AggregationTypes,
  DataTypes,
} from '@/constants/tiltmeter'
import client from '@/utils/client'
import annotations from '@/components/event-annotation/annotations'
import tiltOptions from '@/components/echarts/chart-options/tiltmeter/overview/tilt-options'

import {
  SET_DATA,
  SET_END_TIME,
  SET_ERROR,
  SET_LAST_UPDATED,
  SET_START_TIME,
} from '../../base/mutations'
import { baseState, baseMutations, baseActions } from '../../base'
import { SET_SAMPLING } from './mutations'
import { FETCH_TILTMETER, UPDATE_TILTMETER } from './actions'
import rangeSelector from './range-selector-day'

export const NAMESPACE = 'tiltmeter/overview'

export const initialState = {
  ...baseState,
  annotationOptions: annotations,
  sampling: SamplingTypes.DAY,
  tiltOptions,
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
  [SET_SAMPLING](state, sampling) {
    state.sampling = sampling
  },
}

const tiltUriBuilder = (tilt, sampling) => {
  let url = ''

  const aggregation =
    sampling === SamplingTypes.DAY && tilt.type !== DataTypes.TLR
      ? AggregationTypes.MEAN
      : ''

  let params = {
    aggregation: aggregation,
  }

  switch (tilt.type) {
    case DataTypes.PLATFORM:
      url = `/tiltmeter/${tilt.station}/`
      break
    case DataTypes.PLATFORM_RAW:
      url = `/tiltmeter/raw/${tilt.station}/`
      break
    case DataTypes.BOREHOLE:
      url = `/tiltborehole/${tilt.station}/`
      break
    case DataTypes.TLR:
      params =
        sampling === SamplingTypes.DAY
          ? {
              filter: 'median',
              median_window: 5,
              median_aggregation: 'mean',
            }
          : {
              filter: 'median',
              median_window: 5,
            }

      url = `/tiltmeter/tlr/${tilt.station}/`
      break
    default:
      url = `/tiltmeter/${tilt.station}/`
  }

  return {
    url,
    params,
  }
}

export const actions = {
  ...baseActions,
  async [FETCH_TILTMETER]({ commit, state }) {
    if (state.error) {
      commit(SET_ERROR, null)
    }

    // Build request for all tiltmeter stations.
    const requests = state.tiltOptions.map((tilt) => {
      const { url, params } = tiltUriBuilder(tilt, state.sampling)
      return client.get(url, {
        params: {
          timestamp__gte: state.startTime.format(DATETIME_FORMAT),
          timestamp__lt: state.endTime.format(DATETIME_FORMAT),
          nolimit: true,
          ...params,
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

export default {
  namespaced: true,
  state: initState(defaultPeriod),
  getters,
  mutations,
  actions,
}
