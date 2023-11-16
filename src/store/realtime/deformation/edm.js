import moment from 'moment'
import client from '../../../utils/client'
import {
  SET_DATA,
  SET_ERROR,
  SET_START_TIME,
  SET_END_TIME,
  SET_LAST_UPDATED,
} from '../../base/mutations'
import { baseMutations } from '../../base'
import { FETCH_EDM, UPDATE_EDM } from '../../../store/edm/actions'
import { DATETIME_FORMAT } from '../../../constants/date'
import { DateRangeTypes } from '../../../constants/date'
import { calculatePeriod } from '../../../utils/datetime'
import { createChartOptions } from '../../../components/echarts/chart-options/realtime/edm'
import { toUnixMiliSeconds } from '../../../utils/series'

export const state = {
  benchmark: 'BAB0',
  reflector: 'RB2',
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
}

export const getters = {
  chartOptions({ data, startTime, endTime }) {
    return createChartOptions({
      data,
      min: toUnixMiliSeconds(startTime),
      max: toUnixMiliSeconds(endTime),
    })
  },
}

export const mutations = { ...baseMutations }

export const actions = {
  async [FETCH_EDM]({ commit, state }) {
    if (state.error) {
      commit(SET_ERROR, null)
    }

    const data = await client
      .get('/edm/', {
        params: {
          start_at: state.startTime.format(DATETIME_FORMAT),
          end_at: state.endTime.format(DATETIME_FORMAT),
          ci: true,
          benchmark: state.benchmark,
          reflector: state.reflector,
          ordering: 'timestamp',
          rate: true,
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
  async [UPDATE_EDM]({ dispatch, commit, state }) {
    if (state.period.type === DateRangeTypes.CUSTOM) {
      return dispatch(FETCH_EDM)
    } else {
      const { startTime, endTime } = calculatePeriod(state.period)
      commit(SET_START_TIME, startTime)
      commit(SET_END_TIME, endTime)
      return dispatch(FETCH_EDM)
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
