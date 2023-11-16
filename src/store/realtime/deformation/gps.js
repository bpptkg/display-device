import moment from 'moment'
import { baseMutations } from '../../base'
import client from '../../../utils/client'
import {
  FETCH_GPS_BASELINE,
  UPDATE_GPS_BASELINE,
} from '../../gps/baseline/actions'
import { DATETIME_FORMAT } from '../../../constants/date'
import { DateRangeTypes } from '../../../constants/date'
import { calculatePeriod } from '../../../utils/datetime'
import {
  SET_DATA,
  SET_ERROR,
  SET_LAST_UPDATED,
  SET_START_TIME,
  SET_END_TIME,
} from '../../base/mutations'
import { createChartOptions } from '../../../components/echarts/chart-options/realtime/gps'
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
  station1: 'klatakan',
  station2: 'labuhan',
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
  async [FETCH_GPS_BASELINE]({ commit, state }) {
    const data = await client
      .get('/gps/baseline/', {
        params: {
          station1: state.station1,
          station2: state.station2,
          timestamp__gte: state.startTime.format(DATETIME_FORMAT),
          timestamp__lt: state.endTime.format(DATETIME_FORMAT),
          nolimit: true,
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
  async [UPDATE_GPS_BASELINE]({ dispatch, commit, state }) {
    if (state.period.type === DateRangeTypes.CUSTOM) {
      return dispatch(FETCH_GPS_BASELINE)
    } else {
      const { startTime, endTime } = calculatePeriod(state.period)
      commit(SET_START_TIME, startTime)
      commit(SET_END_TIME, endTime)
      return dispatch(FETCH_GPS_BASELINE)
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
