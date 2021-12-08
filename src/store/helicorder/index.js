import moment from 'moment'
import client from '@/utils/client'
import {
  SET_PERIOD,
  SET_START_TIME,
  SET_END_TIME,
  SET_ERROR,
} from '../base/mutations'
import { SET_SETTLED, SET_IMAGE, SET_CODE, SET_OPTIONS } from './mutations'
import { UPDATE_IMAGE } from './actions'
import { SET_LAST_UPDATED } from '../base/mutations'
import rangeSelector from './range-selector'
import { DateRangeTypes } from '../../constants/date'
import { calculatePeriod } from '../../utils/datetime'

export const defaultPeriod = rangeSelector[0]

export const HelicorderChannel = Object.freeze({
  PASB_BHZ_MP_10: 'PASB_BHZ_MP_10',
  DELS_SHZ_MP_01: 'DELS_SHZ_MP_01',
})

export const initialState = {
  /**
   * Image src in base64 string.
   */
  src: '',
  /**
   * If the first image is successfully fetched, the value will be true
   * subsequently.
   */
  settled: false,
  /**
   * Error message if fetching failed.
   */
  error: null,
  /**
   * Query options.
   */
  options: {
    lb: 1,
  },
  /**
   * Channel name (code).
   */
  code: HelicorderChannel.PASB_BHZ_MP_10,
  /**
   * Last updated timestamp.
   */
  lastUpdated: moment(),
  /**
   * Start time filter if set. The value is stored in moment object.
   */
  startTime: null,
  /**
   * End time filter if set. The value is stored in moment object.
   */
  endTime: null,
  /**
   * Period info.
   */
  period: defaultPeriod,
}

export const initState = (period = defaultPeriod) => {
  const { startTime, endTime } = calculatePeriod(period)
  return {
    ...initialState,
    period,
    startTime,
    endTime,
  }
}

export const getters = {}

export const mutations = {
  [SET_SETTLED](state, value) {
    state.settled = value
  },
  [SET_IMAGE](state, src) {
    state.src = src
  },
  [SET_ERROR](state, error) {
    state.error = error
  },
  [SET_LAST_UPDATED](state, lastUpdated) {
    state.lastUpdated = lastUpdated
  },
  [SET_CODE](state, code) {
    state.code = code
  },
  [SET_OPTIONS](state, options) {
    state.options = { ...state.options, ...options }
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
}

export const isAbsolutePeriod = (period) => {
  return period.type.toLowerCase() === DateRangeTypes.CUSTOM
}

export const isRelativePeriod = (period) => {
  return !isAbsolutePeriod(period)
}

/**
 * Calculate number of hours before present for relative period. Note that the
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
      value = Math.abs(Math.floor(count / 60))
      return value >= 1 && value < maxValue ? value * -1 : defaultValue

    case DateRangeTypes.HOUR:
      value = Math.abs(count)
      return value >= 1 && value < maxValue ? value * -1 : defaultValue

    case DateRangeTypes.DAY:
      value = Math.abs(count * 24)
      return value > 0 && value < maxValue ? value * -1 : defaultValue

    default:
      return defaultValue
  }
}

export const WINSTON_DATETIME_FORMAT = 'YYYYMMDDHHmm'

export const actions = {
  async [UPDATE_IMAGE]({ commit, state }) {
    if (state.error) {
      commit(SET_ERROR, null)
    }

    const periodParams = {}
    if (isAbsolutePeriod(state.period)) {
      // Set t1 & t2 parameters if period is custom or absolute.
      periodParams['t1'] = state.startTime
        ? state.startTime.format(WINSTON_DATETIME_FORMAT)
        : ''
      periodParams['t2'] = state.endTime
        ? state.endTime.format(WINSTON_DATETIME_FORMAT)
        : ''
    } else {
      // For relative period, we only have to set t1 parameter and leave t2
      // parameter to default or 'now'.
      periodParams['t1'] = calculateStartTime(state.period)
    }

    client
      .get('/winston/helicorder/', {
        responseType: 'arraybuffer',
        params: {
          code: state.code,
          ...state.options,
          ...periodParams,
        },
      })
      .then((response) => {
        const data = Buffer.from(response.data, 'binary').toString('base64')
        const imageSrc = `data:image/png;base64,${data}`
        commit(SET_IMAGE, imageSrc)

        // Set settled once the image has been successfully fetched.
        if (!state.settled) {
          commit(SET_SETTLED, true)
        }
      })
      .catch((error) => {
        commit(SET_ERROR, error)
      })
      .finally(() => {
        commit(SET_LAST_UPDATED, moment())
      })
  },
}

export const initModule = () => {
  return {
    namespaced: true,
    state: initState(),
    getters,
    mutations,
    actions,
  }
}

/**
 * Default channel name for period data sharing.
 */
export const defaultChannel = HelicorderChannel.PASB_BHZ_MP_10

export default {
  namespaced: true,
  state: () => {
    return {
      /**
       * Helicorder channel list. For now, it only support 2 channels.
       */
      channels: [
        HelicorderChannel.PASB_BHZ_MP_10,
        HelicorderChannel.DELS_SHZ_MP_01,
      ],
    }
  },
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    namespaced: true,
    [HelicorderChannel.DELS_SHZ_MP_01]: initModule(),
    [HelicorderChannel.PASB_BHZ_MP_10]: initModule(),
  },
}
