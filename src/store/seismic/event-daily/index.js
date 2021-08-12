import _ from 'lodash'
import moment from 'moment'
import Axios from 'axios'

import client from '@/utils/client'

import {
  SET_DAILY_EVENTS,
  SET_MONTHLY_EVENTS,
  SET_LAST_UPDATED,
  SET_ERROR,
} from './mutations'
import {
  FETCH_SEISMICITY,
  UPDATE_DAILY_EVENTS,
  UPDATE_MONTHLY_EVENTS,
  UPDATE_EVENT_DAILY,
} from './actions'

const DATE_FORMAT = 'YYYY-MM-DD'

export const initialState = {
  today: moment(),
  dailyEvents: [],
  monthlyEvents: [],
  eventTypes: [
    { type: 'VTA', code: 'VTA' },
    { type: 'VTB', code: 'VTB' },
    { type: 'MP', code: 'MP' },
    { type: 'LF', code: 'LF' },
    { type: 'RF', code: 'ROCKFALL' },
    { type: 'DG', code: 'GASBURST' },
    { type: 'AP', code: 'AWANPANAS' },
    { type: 'TECT', code: 'TECT' },
  ],
  lastUpdated: null,
  error: null,
}

export const state = () => {
  return { ...initialState }
}

export const getters = {
  todayEvents(state) {
    return state.dailyEvents.map((item, index) => {
      return {
        label: state.eventTypes[index].type,
        count: item.length > 0 ? _.sumBy(item, 'count') : 0,
      }
    })
  },
  eventFields(state) {
    return [
      { key: 'timestamp', label: 'Date' },
      ...state.eventTypes.map((item) => {
        return {
          key: item.type,
        }
      }),
    ]
  },
  eventItems(state) {
    const day = state.today.clone()
    const oneMonthAgo = day.clone().subtract(1, 'month')
    const events = []

    // eslint-disable-next-line no-unmodified-loop-condition
    while (day >= oneMonthAgo) {
      const event = {
        timestamp: day.format('MMM D'),
        ...state.monthlyEvents
          .map((item) => {
            const value = _.find(item, { timestamp: day.format(DATE_FORMAT) })
            return value ? value.count : 0
          })
          .reduce((obj, count, index) => {
            obj[state.eventTypes[index].type] = count
            return obj
          }, {}),
      }
      events.push(event)
      day.subtract(1, 'day')
    }
    return events
  },
}

export const mutations = {
  [SET_DAILY_EVENTS](state, events) {
    state.dailyEvents = events
  },
  [SET_MONTHLY_EVENTS](state, events) {
    state.monthlyEvents = events
  },
  [SET_LAST_UPDATED](state, value) {
    state.lastUpdated = value
  },
  [SET_ERROR](state, error) {
    state.error = error
  },
}

export const actions = {
  [FETCH_SEISMICITY]({ commit, state }, day) {
    if (state.error) {
      commit(SET_ERROR, null)
    }

    const tomorrow = state.today.clone().add(1, 'day')
    const requests = state.eventTypes.map((event) => {
      return client.get('/seismicity/', {
        params: {
          eventdate__gte: tomorrow
            .clone()
            .subtract(day, 'day')
            .format(DATE_FORMAT),
          eventdate__lt: tomorrow.format(DATE_FORMAT),
          eventtype: event.code,
          nolimit: true,
        },
      })
    })
    return Axios.all(requests)
      .then(
        Axios.spread((...responses) => {
          return responses.map((response) => response.data)
        })
      )
      .catch((error) => {
        commit(SET_ERROR, error)
        return []
      })
  },
  async [UPDATE_DAILY_EVENTS]({ dispatch, commit }) {
    const day = 1
    dispatch(FETCH_SEISMICITY, day).then((data) => {
      commit(SET_DAILY_EVENTS, data)
    })
  },
  async [UPDATE_MONTHLY_EVENTS]({ dispatch, commit }) {
    const day = 30
    dispatch(FETCH_SEISMICITY, day).then((data) => {
      commit(SET_MONTHLY_EVENTS, data)
    })
  },
  async [UPDATE_EVENT_DAILY]({ dispatch, commit }) {
    dispatch(UPDATE_DAILY_EVENTS)
    dispatch(UPDATE_MONTHLY_EVENTS)
    commit(SET_LAST_UPDATED, moment())
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
