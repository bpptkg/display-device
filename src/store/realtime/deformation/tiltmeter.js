import moment from 'moment'
import {
  SET_DATA,
  SET_ERROR,
  SET_START_TIME,
  SET_END_TIME,
  SET_LAST_UPDATED,
} from '../../base/mutations'
import { baseMutations } from '../../base'
import { FETCH_TILTMETER, UPDATE_TILTMETER } from '../../tiltmeter/actions'
import client from '../../../utils/client'
import { DATETIME_FORMAT } from '../../../constants/date'
import axios from 'axios'
import { DateRangeTypes } from '../../../constants/date'
import { calculatePeriod } from '../../../utils/datetime'
import { createChartOptions } from '../../../components/echarts/chart-options/realtime/tiltmeter'
import { toUnixMiliSeconds } from '../../../utils/series'

export const state = {
  data: [],
  startTime: moment().subtract(1, 'month'),
  endTime: moment(),
  period: {
    count: 1,
    type: 'month',
    text: '1 month',
  },
  error: null,
  lastUpdated: moment(),
  tiltOptions: [
    {
      type: 'tlr',
      station: 'gadjahmungkur',
      label: 'Gadjah Mungkur',
      url: '/tiltmeter/tlr/gadjahmungkur/',
      params: {
        nolimit: true,
        filter: 'median',
        median_window: 5,
        median_aggregation: 'mean',
      },
    },
    {
      type: 'platform',
      station: 'labuhan',
      label: 'Labuhan',
      url: '/tiltmeter/labuhan/',
      params: {
        nolimit: true,
        aggregation: 'mean',
      },
    },
  ],
  sampling: 'day',
}

export const getters = {
  chartOptions({ data, tiltOptions, sampling, startTime, endTime }) {
    return createChartOptions({
      data,
      tiltOptions,
      sampling,
      min: toUnixMiliSeconds(startTime),
      max: toUnixMiliSeconds(endTime),
    })
  },
}

export const mutations = { ...baseMutations }

export const actions = {
  async [FETCH_TILTMETER]({ commit, state }) {
    if (state.error) {
      commit(SET_ERROR, null)
    }

    const requests = state.tiltOptions.map((station) => {
      return client.get(station.url, {
        params: {
          timestamp__gte: state.startTime.format(DATETIME_FORMAT),
          timestamp__lt: state.endTime.format(DATETIME_FORMAT),
          ...station.params,
        },
      })
    })

    const data = await Promise.all(requests)
      .then(
        axios.spread((...responses) => {
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

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
