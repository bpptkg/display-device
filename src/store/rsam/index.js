import client from '../../utils/client'
import moment from 'moment'
import rangeSelector from './range-selector'
import { DateRangeTypes } from '@/constants/date'
import { calculatePeriod } from '@/utils/datetime'
import {
  SET_PERIOD,
  SET_START_TIME,
  SET_END_TIME,
  SET_ERROR,
  SET_LAST_UPDATED,
} from '../base/mutations'
import {
  isAbsolutePeriod,
  toUTC,
  WINSTON_DATETIME_FORMAT,
  HelicorderChannel,
} from '../helicorder'

// Mutations
export const SET_IMAGE = 'SET_IMAGE'
export const SET_OPTIONS = 'SET_OPTIONS'
export const SET_SETTLED = 'SET_SETTLED'

// Actions
export const UPDATE_IMAGE = 'UPDATE_IMAGE'

export const defaultPeriod = rangeSelector[0]

export const initialState = {
  src: '',
  period: defaultPeriod,
  startTime: null,
  endTime: null,
  error: null,
  code: 'MEPAS_HHZ_VG_00',
  lastUpdated: moment(),
  options: {},
  settled: false,
}

export const initState = (code, period = defaultPeriod) => {
  const { startTime, endTime } = calculatePeriod(period)
  return {
    ...initialState,
    code,
    period,
    startTime,
    endTime,
  }
}

export const getters = {}

export const mutations = {
  [SET_IMAGE](state, src) {
    state.src = src
  },
  [SET_ERROR](state, error) {
    state.error = error
  },
  [SET_LAST_UPDATED](state, lastUpdated) {
    state.lastUpdated = lastUpdated
  },
  [SET_PERIOD](state, period) {
    state.period = period
  },
  [SET_START_TIME](state, value) {
    state.startTime = value
  },
  [SET_END_TIME](state, value) {
    state.endTime = value
  },
  [SET_OPTIONS](state, options) {
    state.options = { ...state.options, ...options }
  },
  [SET_SETTLED](state, value) {
    state.settled = value
  },
}

/**
 * Calculate number of days before present for relative period. Note that the
 * value is returned in negative number. If count is invalid, returns default
 * value.
 */
export const calculateStartTime = (period) => {
  const { type, count } = period
  let value = 1
  const defaultValue = -12
  const maxValue = 144

  switch (type) {
    case DateRangeTypes.MINUTE:
      value = Math.abs(Math.floor(count / (60 * 24)))
      return value >= 1 && value < maxValue ? value * -1 : defaultValue

    case DateRangeTypes.HOUR:
      value = Math.abs(count)
      return value >= 1 && value < maxValue ? value * -1 : defaultValue

    case DateRangeTypes.DAY:
      value = Math.abs(count)
      return value > 0 && value < maxValue ? value * -1 : defaultValue

    default:
      return defaultValue
  }
}

export const actions = {
  async [UPDATE_IMAGE]({ commit, state }) {
    if (state.error) {
      commit(SET_ERROR, null)
    }

    commit(SET_SETTLED, false)

    const periodParams = {}
    if (isAbsolutePeriod(state.period)) {
      // Set t1 & t2 parameters if period is custom or absolute.
      periodParams['t1'] = state.startTime
        ? toUTC(state.startTime).format(WINSTON_DATETIME_FORMAT)
        : ''
      periodParams['t2'] = state.endTime
        ? toUTC(state.endTime).format(WINSTON_DATETIME_FORMAT)
        : ''
    } else {
      // For relative period, we only have to set t1 parameter and leave t2
      // parameter to default or 'now'.
      periodParams['t1'] = calculateStartTime(state.period)
    }

    client
      .get('/winston/rsam/', {
        responseType: 'arraybuffer',
        params: {
          ...periodParams,
          code: state.code,
          rsamP: 10,
          rm: 1,
          rmp: 600,
          tz: 'Asia/Jakarta',
          ...state.options,
        },
      })
      .then((response) => {
        const data = Buffer.from(response.data, 'binary').toString('base64')
        const imageSrc = `data:image/png;base64,${data}`
        commit(SET_IMAGE, imageSrc)

        // Reset settled status after image is updated.
        commit(SET_SETTLED, true)
      })
      .catch((error) => {
        commit(SET_ERROR, error)
      })
      .finally(() => {
        commit(SET_LAST_UPDATED, moment())
      })
  },
}

export const initModule = (args = {}) => {
  return {
    namespaced: true,
    state: initState(args),
    getters,
    mutations,
    actions,
  }
}

const HC = HelicorderChannel

export default {
  namespaced: true,
  modules: {
    namespaced: true,
    [HC.MEDEL_EHZ_VG_00]: initModule(HC.MEDEL_EHZ_VG_00),
    [HC.MEDEL_HHZ_VG_00]: initModule(HC.MEDEL_HHZ_VG_00),
    [HC.MEGEM_HHZ_VG_00]: initModule(HC.MEGEM_HHZ_VG_00),
    [HC.MEGRA_HHZ_VG_00]: initModule(HC.MEGRA_HHZ_VG_00),
    [HC.MEIJO_HHZ_VG_00]: initModule(HC.MEIJO_HHZ_VG_00),
    [HC.MEIMO_HHZ_VG_00]: initModule(HC.MEIMO_HHZ_VG_00),
    [HC.MEJRO_HHZ_VG_00]: initModule(HC.MEJRO_HHZ_VG_00),
    [HC.MEKLA_HHZ_VG_00]: initModule(HC.MEKLA_HHZ_VG_00),
    [HC.MEKLS_EHZ_VG_00]: initModule(HC.MEKLS_EHZ_VG_00),
    [HC.MELAB_HHZ_VG_00]: initModule(HC.MELAB_HHZ_VG_00),
    [HC.MEMBB_HHZ_VG_00]: initModule(HC.MEMBB_HHZ_VG_00),
    [HC.MEPAS_HHZ_VG_00]: initModule(HC.MEPAS_HHZ_VG_00),
    [HC.MEPET_HHZ_VG_00]: initModule(HC.MEPET_HHZ_VG_00),
    [HC.MEPLA_EHZ_VG_00]: initModule(HC.MEPLA_EHZ_VG_00),
    [HC.MEPSL_HHZ_VG_00]: initModule(HC.MEPSL_HHZ_VG_00),
    [HC.MEPUS_EHZ_VG_00]: initModule(HC.MEPUS_EHZ_VG_00),
    [HC.MESEL_HHZ_VG_00]: initModule(HC.MESEL_HHZ_VG_00),
  },
}
