import moment from 'moment-timezone'
import client from '@/utils/client'
import { DateRangeTypes } from '@/constants/date'
import { calculatePeriod } from '@/utils/datetime'
import {
  SET_PERIOD,
  SET_START_TIME,
  SET_END_TIME,
  SET_ERROR,
  SET_LAST_UPDATED,
} from '../base/mutations'
import { SET_SETTLED, SET_IMAGE, SET_CODE, SET_OPTIONS } from './mutations'
import { UPDATE_IMAGE } from './actions'
import rangeSelector from './range-selector'

export const defaultPeriod = rangeSelector[0]

/**
 * Helicorder channels.
 *
 * Refer to the Winston Wave Server for more information.
 */
export const HelicorderChannel = Object.freeze({
  MEPET_HHZ_VG_00: 'MPET_HHZ_VG_00',
  MEIJO_HHZ_VG_00: 'MIJO_HHZ_VG_00',
  MEGEM_HHZ_VG_00: 'MGEM_HHZ_VG_00',
  MELAB_HHZ_VG_00: 'MLAB_HHZ_VG_00',
  MEJRO_HHZ_VG_00: 'MJRO_HHZ_VG_00',
  MEDEL_HHZ_VG_00: 'MDEL_HHZ_VG_00',
  MEPAS_HHZ_VG_00: 'MPAS_HHZ_VG_00',
  MEIMO_HHZ_VG_00: 'MIMO_HHZ_VG_00',
  MEDEL_EHZ_VG_00: 'MDEL_EHZ_VG_00',
  MEPUS_EHZ_VG_00: 'MPUS_EHZ_VG_00',
  MEKLA_EHZ_VG_00: 'MKLA_EHZ_VG_00',
  MEPLA_EHZ_VG_00: 'MPLA_EHZ_VG_00',
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
    tz: 'Asia/Jakarta',
  },
  /**
   * Channel name (code).
   */
  code: HelicorderChannel.MEPAS_HHZ_VG_00,
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

export const initState = ({ period = defaultPeriod, options = {} } = {}) => {
  const { startTime, endTime } = calculatePeriod(period)
  return {
    ...initialState,
    period,
    startTime,
    endTime,
    options: {
      ...initialState.options,
      ...options,
    },
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

export const toUTC = (date) => {
  const dt = moment(date.clone()).tz('Asia/Jakarta')
  return moment(dt).tz('UTC')
}

export const actions = {
  async [UPDATE_IMAGE]({ commit, state }) {
    if (state.error) {
      commit(SET_ERROR, null)
    }

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

export const initModule = (args = {}) => {
  return {
    namespaced: true,
    state: initState(args),
    getters,
    mutations,
    actions,
  }
}

/**
 * Default channel name for period data sharing.
 */
export const defaultChannel = HelicorderChannel.MEPAS_HHZ_VG_00

export default {
  namespaced: true,
  state: () => {
    return {
      /**
       * Helicorder channel list. For now, it only supports 2 channels.
       */
      channels: [
        HelicorderChannel.MEPAS_HHZ_VG_00,
        HelicorderChannel.MELAB_HHZ_VG_00,
      ],
    }
  },
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    namespaced: true,
    [HelicorderChannel.MEPET_HHZ_VG_00]: initModule(),
    [HelicorderChannel.MEIJO_HHZ_VG_00]: initModule(),
    [HelicorderChannel.MEGEM_HHZ_VG_00]: initModule(),
    [HelicorderChannel.MELAB_HHZ_VG_00]: initModule(),
    [HelicorderChannel.MEJRO_HHZ_VG_00]: initModule(),
    [HelicorderChannel.MEDEL_EHZ_VG_00]: initModule(),
    [HelicorderChannel.MEPAS_HHZ_VG_00]: initModule(),
    [HelicorderChannel.MEIMO_HHZ_VG_00]: initModule(),
    [HelicorderChannel.MEDEL_EHZ_VG_00]: initModule(),
    [HelicorderChannel.MEPUS_EHZ_VG_00]: initModule(),
    [HelicorderChannel.MEKLA_EHZ_VG_00]: initModule(),
    [HelicorderChannel.MEPLA_EHZ_VG_00]: initModule(),
  },
}
