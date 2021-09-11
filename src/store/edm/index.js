import Axios from 'axios'
import moment from 'moment'
import client from '@/utils/client'
import { calculatePeriod } from '@/utils/datetime'
import { DATETIME_FORMAT, DateRangeTypes } from '@/constants/date'
import { EDMBenchmarkReflectorRelations } from '@/constants/edm'
import annotations from '@/components/event-annotation/annotations'
import { CHART_VIEWS } from '@/components/echarts/chart-options/edm'
import {
  SET_DATA,
  SET_END_TIME,
  SET_ERROR,
  SET_LAST_UPDATED,
  SET_START_TIME,
} from '../base/mutations'
import { baseState, baseMutations, baseActions } from '../base'
import {
  SET_RETRIEVED,
  SET_SHOW_REGRESSION_LINE,
  SET_CHART_VIEW,
} from './mutations'

import { UPDATE_EDM, FETCH_EDM } from './actions'
import rangeSelector from './range-selector'

// Submodules
import overview from './overview'

export const initialState = {
  ...baseState,
  annotationOptions: annotations,
  benchmark: '',
  reflectors: [],
  retrieved: false,
  showRegressionLine: false,
  isVectorSupported: false,
  chartView: CHART_VIEWS.slope_distance,
}

export const initState = (
  benchmark,
  period,
  { isVectorSupported = false } = {}
) => {
  const { startTime, endTime } = calculatePeriod(period)

  return {
    ...initialState,
    period,
    benchmark,
    reflectors: EDMBenchmarkReflectorRelations[benchmark],
    startTime,
    endTime,
    isVectorSupported,
  }
}

export const getters = {}

export const mutations = {
  ...baseMutations,
  [SET_RETRIEVED](state, value) {
    state.retrieved = value
  },
  [SET_SHOW_REGRESSION_LINE](state, value) {
    state.showRegressionLine = value
  },
  [SET_CHART_VIEW](state, value) {
    state.chartView = value
  },
}

export const actions = {
  ...baseActions,
  async [FETCH_EDM]({ commit, state }) {
    if (state.error) {
      commit(SET_ERROR, null)
    }

    const requests = state.reflectors.map((reflector) => {
      return client.get('/edm/', {
        params: {
          start_at: state.startTime.format(DATETIME_FORMAT),
          end_at: state.endTime.format(DATETIME_FORMAT),
          ci: true,
          benchmark: state.benchmark,
          reflector: reflector,
          ordering: 'timestamp',
          compact: !state.isVectorSupported,
          rate: true,
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

const defaultPeriod = rangeSelector[2]

const BAB0 = {
  namespaced: true,
  state: initState('BAB0', defaultPeriod, { isVectorSupported: false }),
  getters,
  mutations,
  actions,
}

const BAB1 = {
  namespaced: true,
  state: initState('BAB1', defaultPeriod, { isVectorSupported: true }),
  getters,
  mutations,
  actions,
}

const BAT0 = {
  namespaced: true,
  state: initState('BAT0', defaultPeriod, { isVectorSupported: false }),
  getters,
  mutations,
  actions,
}

const BEL0 = {
  namespaced: true,
  state: initState('BEL0', defaultPeriod, { isVectorSupported: false }),
  getters,
  mutations,
  actions,
}

const CEP0 = {
  namespaced: true,
  state: initState('CEP0', defaultPeriod, { isVectorSupported: false }),
  getters,
  mutations,
  actions,
}

const DEL0 = {
  namespaced: true,
  state: initState('DEL0', defaultPeriod, { isVectorSupported: false }),
  getters,
  mutations,
  actions,
}

const GEB0 = {
  namespaced: true,
  state: initState('GEB0', defaultPeriod, { isVectorSupported: false }),
  getters,
  mutations,
  actions,
}

const JRK0 = {
  namespaced: true,
  state: initState('JRK0', defaultPeriod, { isVectorSupported: true }),
  getters,
  mutations,
  actions,
}

const KAJ0 = {
  namespaced: true,
  state: initState('KAJ0', defaultPeriod, { isVectorSupported: false }),
  getters,
  mutations,
  actions,
}

const KAL0 = {
  namespaced: true,
  state: initState('KAL0', defaultPeriod, { isVectorSupported: false }),
  getters,
  mutations,
  actions,
}

const MRY0 = {
  namespaced: true,
  state: initState('MRY0', defaultPeriod, { isVectorSupported: false }),
  getters,
  mutations,
  actions,
}

const SAP0 = {
  namespaced: true,
  state: initState('SAP0', defaultPeriod, { isVectorSupported: false }),
  getters,
  mutations,
  actions,
}

const SEL0 = {
  namespaced: true,
  state: initState('SEL0', defaultPeriod, { isVectorSupported: false }),
  getters,
  mutations,
  actions,
}

const STA0 = {
  namespaced: true,
  state: initState('STA0', defaultPeriod, { isVectorSupported: true }),
  getters,
  mutations,
  actions,
}

const TRI0 = {
  namespaced: true,
  state: initState('TRI0', defaultPeriod, { isVectorSupported: false }),
  getters,
  mutations,
  actions,
}

export default {
  namespaced: true,
  modules: {
    namespaced: true,
    BAB0,
    BAB1,
    BAT0,
    BEL0,
    CEP0,
    DEL0,
    GEB0,
    JRK0,
    KAJ0,
    KAL0,
    MRY0,
    SAP0,
    SEL0,
    STA0,
    TRI0,
    overview,
  },
}
