import moment from 'moment'
import client from '@/utils/cendana-client'
import { DATE_FORMAT } from '@/constants/date'
import { POS } from '@/constants/stations'
import { SET_ERROR, SET_LAST_UPDATED } from '../../base/mutations'

import { FETCH_DAILY_REPORT } from './actions'

import {
  APPEND_REPORT,
  INCREMENT_DATE,
  DECREMENT_DATE,
  TRUNCATE_REPORT,
  RESET_DATE,
} from './mutations'
import { baseMutations } from '../../base'
import { eventListReducer } from '@/utils/observation-utils'
import { isObject } from '@/utils/common'

export const NAMESPACE = 'observation/event'

export const initialState = {
  reports: [],
  date: moment(),
  error: null,
  lastUpdate: moment(),
}

export const state = () => {
  return { ...initialState }
}

export const getters = {}

export const mutations = {
  ...baseMutations,
  [APPEND_REPORT](state, { reports, date }) {
    // eventListReducer() combines all events from all observatory stations.
    const data = {
      event_avalanches: eventListReducer(
        reports,
        'event_avalanches',
        'occured_at'
      ),
      event_explosions: eventListReducer(
        reports,
        'event_explosions',
        'occurred_at'
      ),
      event_volcanic_ashes: eventListReducer(
        reports,
        'event_volcanic_ashes',
        'occured_at'
      ),
      event_blasts: eventListReducer(reports, 'event_blasts', 'end_time'),
      event_static_fires: eventListReducer(
        reports,
        'event_static_fires',
        'end_time'
      ),
      event_sounds: eventListReducer(reports, 'event_sounds', 'occured_at'),
      event_lavas: eventListReducer(reports, 'event_lavas', 'end_time'),
    }

    state.reports.push({
      date,
      data,
    })
  },
  [INCREMENT_DATE](state) {
    state.date.add(1, 'days')
  },
  [DECREMENT_DATE](state) {
    state.date.subtract(1, 'days')
  },
  [RESET_DATE](state) {
    state.date = moment()
  },
  [TRUNCATE_REPORT](state) {
    state.reports = []
  },
}

export const actions = {
  async [FETCH_DAILY_REPORT]({ commit, state }, scrollState) {
    if (state.error) {
      commit(SET_ERROR, null)
    }

    const reportDate = state.date.clone()

    const requests = POS.map((pos) => {
      return client.get('/api/daily-reports', {
        params: {
          station_id: pos.id,
          report_date: reportDate.format(DATE_FORMAT),
        },
      })
    })

    await Promise.all(requests)
      .then((responses) => {
        const reports = responses
          .map((response) => response.data.report)
          .filter((report) => isObject(report))

        commit(APPEND_REPORT, {
          reports,
          date: reportDate,
        })

        scrollState.loaded()

        commit(DECREMENT_DATE)
        commit(SET_LAST_UPDATED, moment())
      })
      .catch((error) => {
        commit(SET_ERROR, error)
        scrollState.error()
      })
  },
}

export default {
  namespaced: true,
  state: initialState,
  getters,
  mutations,
  actions,
}
