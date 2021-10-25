import moment from 'moment'
import { DATETIME_FORMAT, DateRangeTypes } from '@/constants/date'
import client from '@/utils/client'
import { calculatePeriod } from '@/utils/datetime'
import annotations from '@/components/event-annotation/annotations'
import { STATIONS } from '@/constants/rsam'
import { mapFieldColumns, cumulativeSum } from '@/utils/series'
import { max } from 'lodash'

import {
  SET_DATA,
  SET_END_TIME,
  SET_ERROR,
  SET_LAST_UPDATED,
  SET_START_TIME,
} from '../../base/mutations'

import { baseState, baseMutations, baseActions } from '../../base'
import { FETCH_RSAM, UPDATE_RSAM } from './actions'
import { SET_STATION } from './mutations'
import rangeSelector from './range-selector'
import { BANDS } from '../../../components/echarts/chart-options/seismic/rsam'

export const initialState = {
  ...baseState,
  station: STATIONS.pasarbubar,
  annotationOptions: annotations,
}

export const initState = (period, station = STATIONS.pasarbubar) => {
  const { startTime, endTime } = calculatePeriod(period)

  return {
    ...initialState,
    period,
    startTime,
    endTime,
    station,
  }
}

export const state = () => {
  return { ...initialState }
}

export const getters = {
  rsamBands({ data }) {
    const series = Object.fromEntries(
      new Map(
        BANDS.map(({ name }) => {
          return [
            [name, []],
            [`c${name}`, []],
          ]
        }).flat(1)
      )
    )

    BANDS.forEach(({ name }) => {
      series[name] = mapFieldColumns(data, 'timestamp', name)
      series[`c${name}`] = cumulativeSum(
        mapFieldColumns(data, 'timestamp', name)
      )
    })

    return series
  },
}

export const mutations = {
  ...baseMutations,
  [SET_STATION](state, station) {
    state.station = station
  },
}

export const getSsamAdaptiveSampling = (startTime, endTime) => {
  const maxDuration = 7 // Duration is days
  const duration = moment.duration(endTime.diff(startTime)).asDays()
  return duration >= maxDuration ? 'ssam1' : 'ssam'
}

export const actions = {
  ...baseActions,
  async [FETCH_RSAM]({ commit, state }) {
    if (state.error) {
      commit(SET_ERROR, null)
    }

    const data = await client
      .get(`/rsam/seismic/${state.station}/`, {
        params: {
          timestamp__gte: state.startTime.format(DATETIME_FORMAT),
          timestamp__lt: state.endTime.format(DATETIME_FORMAT),
          nolimit: true,
          sampling: getSsamAdaptiveSampling(state.startTime, state.endTime),
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

  async [UPDATE_RSAM]({ dispatch, commit, state }) {
    if (state.period.type === DateRangeTypes.CUSTOM) {
      return dispatch(FETCH_RSAM)
    } else {
      const { startTime, endTime } = calculatePeriod(state.period)
      commit(SET_START_TIME, startTime)
      commit(SET_END_TIME, endTime)
      return dispatch(FETCH_RSAM)
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
