import moment from 'moment'

import { DATE_FORMAT, DATETIME_FORMAT, DateRangeTypes } from '@/constants/date'
import { SamplingTypes } from '@/constants/seismicity'
import client from '@/utils/client'
import { calculatePeriod } from '@/utils/datetime'
import eventTypes from '@/components/echarts/chart-options/seismic/seismicity/event-types'
import { primaryAnnotations } from '@/components/event-annotation/annotations'

import {
  SET_DATA,
  SET_END_TIME,
  SET_ERROR,
  SET_LAST_UPDATED,
  SET_START_TIME,
} from '../../base/mutations'
import { SET_SAMPLING } from './mutations'
import { baseState, baseMutations, baseActions } from '../../base'
import {
  FETCH_SEISMICITY,
  FETCH_SEISMICITY_CLUSTER,
  UPDATE_SEISMICITY,
  UPDATE_SEISMICITY_CLUSTER,
} from './actions'
import rangeSelector from './range-selector'

const formatDateBySampling = (date, sampling) => {
  return sampling === SamplingTypes.DAY
    ? date.format(DATE_FORMAT)
    : date.format(DATETIME_FORMAT)
}

export const initialState = {
  ...baseState,
  sampling: '',
  eventTypes,
  annotationOptions: primaryAnnotations,
}

export const initState = (period, sampling = SamplingTypes.DAY) => {
  const { startTime, endTime } = calculatePeriod(period)

  return {
    ...initialState,
    period,
    sampling,
    startTime,
    endTime,
  }
}

export const state = () => {
  return { ...initialState }
}

export const getters = {
  /**
   * Get seismicity data as table with event type being column names, and event
   * date as row indices.
   *
   * It returns array of object containing table data with each row consist of
   * event date and count for each event types.
   *
   * If no data present, it return empty array.
   */
  eventItems(state) {
    const { data, sampling, eventTypes } = state

    if (data.length === 0) return data

    const timestamp = data
      .map((d) => d.map((v) => v.timestamp))
      .filter((e) => e.length > 0)
      .flat(1)

    const start = timestamp.reduce((a, b) => moment.min(moment(a), moment(b)))
    const numEvents = data.map((d) => d.length).reduce((a, b) => Math.max(a, b))
    const duration = {
      hour: 'hours',
      day: 'days',
    }

    // Get event name as array.
    const eventNames = eventTypes.map((v) => v.type)

    const day = start.clone()
    const events = []

    const getValueByIndex = (data, index) => {
      if (index >= 0 && index < data.length) {
        return data[index]
      } else {
        return 0
      }
    }

    for (let i = 0; i < numEvents; i++) {
      const event = {}
      data.forEach((item, index) => {
        const value = getValueByIndex(item, i)

        event.event_date = formatDateBySampling(day, sampling)
        // Return default count 0 if for particular event date, value is not
        // found.
        event[eventNames[index]] = value && value.count ? value.count : 0
      })

      events.push(event)
      day.add(1, duration[sampling])
    }

    return events
  },
  duration(state) {
    if (state.startTime && state.endTime) {
      return moment.duration(state.endTime.diff(state.startTime)).asSeconds()
    } else {
      return null
    }
  },
}

export const mutations = {
  ...baseMutations,
  [SET_SAMPLING](state, sampling) {
    state.sampling = sampling
  },
}

export const actions = {
  ...baseActions,
  async [FETCH_SEISMICITY]({ commit, state }) {
    if (state.error) {
      commit(SET_ERROR, null)
    }

    const requests = state.eventTypes.map((event) => {
      return client.get('/seismicity/', {
        params: {
          count_per: state.sampling,
          end: state.endTime.format(DATETIME_FORMAT),
          eventdate__gte: state.startTime.format(DATETIME_FORMAT),
          eventdate__lt: state.endTime.format(DATETIME_FORMAT),
          eventtype: event.code,
          nolimit: true,
          reindex: true,
          start: state.startTime.format(DATETIME_FORMAT),
        },
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

  async [UPDATE_SEISMICITY]({ dispatch, commit, state }) {
    if (state.period.type === DateRangeTypes.CUSTOM) {
      return dispatch(FETCH_SEISMICITY)
    } else {
      const { startTime, endTime } = calculatePeriod(state.period)
      commit(SET_START_TIME, startTime)
      commit(SET_END_TIME, endTime)
      return dispatch(FETCH_SEISMICITY)
    }
  },

  async [FETCH_SEISMICITY_CLUSTER]({ commit, state }) {
    if (state.error) {
      commit(SET_ERROR, null)
    }

    const requests = state.eventTypes.map((event) => {
      return client.get('/cluster/seisgroup/', {
        params: {
          eventdate__gte: state.startTime.format(DATETIME_FORMAT),
          eventdate__lt: state.endTime.format(DATETIME_FORMAT),
          cluster_event: event.code,
          count_per: state.sampling,
          nolimit: true,
          group: true,
          reindex: true,
          start: state.startTime.format(DATETIME_FORMAT),
          end: state.endTime.format(DATETIME_FORMAT),
        },
      })
    })

    const data = await Promise.all(requests)
      .then((responses) => {
        // response.data.results may undefined, so replace it with empty array
        // if is.
        return responses.map((response) => response.data.results || [])
      })
      .catch((error) => {
        commit(SET_ERROR, error)
        return []
      })

    commit(SET_DATA, data)
    commit(SET_LAST_UPDATED, moment())
  },

  async [UPDATE_SEISMICITY_CLUSTER]({ dispatch, commit, state }) {
    if (state.period.type === DateRangeTypes.CUSTOM) {
      return dispatch(FETCH_SEISMICITY_CLUSTER)
    } else {
      const { startTime, endTime } = calculatePeriod(state.period)
      commit(SET_START_TIME, startTime)
      commit(SET_END_TIME, endTime)
      return dispatch(FETCH_SEISMICITY_CLUSTER)
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
