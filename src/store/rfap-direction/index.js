import _ from 'lodash'
import moment from 'moment'

import client from '@/utils/client'
import { DATETIME_FORMAT, DateRangeTypes } from '@/constants/date'
import { calculatePeriod } from '@/utils/datetime'

import { DIRECTION_GROUP } from '@/constants/rfap'

import {
  SET_DATA,
  SET_END_TIME,
  SET_ERROR,
  SET_LAST_UPDATED,
  SET_START_TIME,
} from '../base/mutations'
import { baseState, baseMutations, baseActions } from '../base'

import { FETCH_DATA, UPDATE_DATA } from './actions'
import rangeSelector from './range-selector'

export const NAMESPACE = 'rfapDirection'

export const initialState = {
  ...baseState,
}

export const initState = (period) => {
  const { startTime, endTime } = calculatePeriod(period)

  return {
    ...initialState,
    endTime,
    startTime,
    period,
  }
}

export const state = () => {
  return { ...initialState }
}

export const getters = {
  /**
   * Reformat RF & AP direction data to (numData, numDirectionGroup) size where
   * numData is number of data fetched from RF & AP rose API, and
   * numDirectionGroup is number of DIRECTION_GROUP.
   */
  rfapDirectionGroup(state) {
    return state.data.map((d) => {
      const bin = DIRECTION_GROUP.reduce((acc, g) => {
        const caseInsensitiveDirectionGroup = g.map((v) => v.toLowerCase())
        if (caseInsensitiveDirectionGroup.includes(d.direction.toLowerCase())) {
          acc.push(d.count)
        } else {
          acc.push(0)
        }
        return acc
      }, [])

      return { binData: bin, direction: d.direction }
    })
  },
  /**
   * Sort RF & AP direction data in descending value and reformat to the form
   * [[count, direction], [count, direction], ...]
   */
  rfapDirectionSorted(state) {
    return _.orderBy(state.data, ['count'], 'asc').map((d) => [
      d.count,
      d.direction,
    ])
  },
}

export const mutations = {
  ...baseMutations,
}

export const actions = {
  ...baseActions,
  async [FETCH_DATA]({ commit, state }) {
    if (state.error) {
      commit(SET_ERROR, null)
    }

    const data = await client
      .get('/rfap-rose/', {
        params: {
          start: state.startTime.format(DATETIME_FORMAT),
          end: state.endTime.format(DATETIME_FORMAT),
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

  async [UPDATE_DATA]({ dispatch, commit, state }) {
    if (state.period.type === DateRangeTypes.CUSTOM) {
      return dispatch(FETCH_DATA)
    } else {
      const { startTime, endTime } = calculatePeriod(state.period)
      commit(SET_START_TIME, startTime)
      commit(SET_END_TIME, endTime)
      return dispatch(FETCH_DATA)
    }
  },
}

const defaultPeriod = rangeSelector[3]

export default {
  namespaced: true,
  state: initState(defaultPeriod),
  getters,
  mutations,
  actions,
}
